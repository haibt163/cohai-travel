#!/usr/bin/env node
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function setup() {
  await db.exec(`
    create table tour_departures (
      id text primary key,
      max_people integer not null
    );
    create table bookings (
      id text primary key,
      kind text not null,
      item_id text not null,
      departure_id text,
      start_date date not null,
      guests integer not null,
      nights integer not null,
      inventory_units integer not null default 1,
      status text not null default 'confirmed'
    );
    create table stays (
      id text primary key,
      inventory_unit_count integer not null
    );
    insert into tour_departures values ('dep-race', 2);
    insert into stays values ('stay-race', 1);
  `);
}

async function attemptTourBooking(id, guests) {
  return db.transaction(async (tx) => {
    const deps = await tx.query(
      `select id, max_people from tour_departures where id = $1 for update`,
      ["dep-race"],
    );
    assert.equal(deps.rows.length, 1);

    // Deliberately yield while the row is locked so competing transactions are
    // forced through the same serialized critical section as production code.
    await sleep(20);

    const booked = await tx.query(
      `select coalesce(sum(guests), 0)::int as booked
         from bookings
        where departure_id = $1 and status = 'confirmed'`,
      ["dep-race"],
    );
    const left = Number(deps.rows[0].max_people) - Number(booked.rows[0].booked);
    if (guests > left) return false;

    await tx.query(
      `insert into bookings
        (id, kind, item_id, departure_id, start_date, guests, nights, inventory_units, status)
       values ($1, 'tour', 'tour-race', 'dep-race', '2026-10-01', $2, 1, 1, 'confirmed')`,
      [id, guests],
    );
    return true;
  });
}

async function attemptStayBooking(id) {
  return db.transaction(async (tx) => {
    const stays = await tx.query(
      `select inventory_unit_count from stays where id = $1 for update`,
      ["stay-race"],
    );
    assert.equal(stays.rows.length, 1);

    await sleep(20);

    const conflicts = await tx.query(
      `select coalesce(sum(inventory_units), 0)::int as booked_units
         from bookings
        where kind = 'stay'
          and item_id = 'stay-race'
          and status = 'confirmed'
          and start_date < ('2026-11-03'::date + 3)
          and (start_date + nights) > '2026-11-03'::date`,
    );
    const booked = Number(conflicts.rows[0].booked_units);
    if (booked + 1 > Number(stays.rows[0].inventory_unit_count)) return false;

    await tx.query(
      `insert into bookings
        (id, kind, item_id, start_date, guests, nights, inventory_units, status)
       values ($1, 'stay', 'stay-race', '2026-11-03', 1, 3, 1, 'confirmed')`,
      [id],
    );
    return true;
  });
}

try {
  await setup();

  const tourResults = await Promise.all([
    attemptTourBooking("tour-a", 2),
    attemptTourBooking("tour-b", 2),
  ]);
  assert.deepEqual(tourResults.sort(), [false, true]);
  const tourCount = await db.query(
    `select coalesce(sum(guests), 0)::int as booked from bookings where departure_id = 'dep-race'`,
  );
  assert.equal(Number(tourCount.rows[0].booked), 2);

  const stayResults = await Promise.all([
    attemptStayBooking("stay-a"),
    attemptStayBooking("stay-b"),
  ]);
  assert.deepEqual(stayResults.sort(), [false, true]);
  const stayCount = await db.query(
    `select coalesce(sum(inventory_units), 0)::int as booked from bookings where item_id = 'stay-race'`,
  );
  assert.equal(Number(stayCount.rows[0].booked), 1);

  console.log("[integration] tour race: exactly one concurrent booking admitted");
  console.log("[integration] stay race: exactly one overlapping booking admitted");
} finally {
  await db.close();
}
