#!/usr/bin/env node
/**
 * Booking integration test — runs the REAL production booking transaction
 * (`placeBooking` in src/lib/booking-core.ts, the body used by `createBooking`)
 * against the REAL schema and seed data built from migrations/*.sql.
 *
 * Backends:
 *   - TEST_DATABASE_URL set  -> real PostgreSQL, one connection per concurrent
 *     booking (true row-lock contention). Runs inside a throwaway schema that is
 *     dropped afterwards; use a disposable database, never production.
 *   - not set                -> in-memory PGlite. PGlite runs one transaction at
 *     a time, so this checks booking logic and pricing but does NOT prove row
 *     locking. In CI (CI=true) the real-Postgres backend is mandatory.
 *
 * Run: node --experimental-strip-types scripts/booking-concurrency.integration.mjs
 */
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pendingMigrations } from "./migration-plan.mjs";
import { placeBooking } from "../src/lib/booking-core.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v) => v;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
if (!testDatabaseUrl && process.env.CI) {
  throw new Error(
    "TEST_DATABASE_URL is required in CI so the booking test runs against real PostgreSQL (PGlite cannot prove row locking).",
  );
}

// Same tagged-template -> $1,$2 conversion as src/lib/db.ts (buildTx). After any
// "for update" statement returns (row lock held) we pause briefly so competing
// transactions are guaranteed to overlap; without the lock they would all read
// stale state and over-book.
function taggedTx(run) {
  return async (strings, ...values) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    const rows = await run(text, values);
    if (/\bfor update\b/i.test(text)) await sleep(150);
    return rows;
  };
}

async function openBackend() {
  const migrationTexts = [];
  const files = (await readdir(join(root, "migrations"))).map((n) => `migrations/${n}`);
  for (const { path } of pendingMigrations(files, [])) {
    migrationTexts.push([path, await readFile(join(root, path), "utf8")]);
  }

  if (testDatabaseUrl) {
    const { default: pg } = await import("pg");
    pg.types.setTypeParser(OID_INT8, Number);
    pg.types.setTypeParser(OID_DATE, identity);
    pg.types.setTypeParser(OID_INTERVAL, identity);
    const schema = `booking_test_${randomBytes(4).toString("hex")}`;
    const admin = new pg.Pool({ connectionString: testDatabaseUrl, max: 1 });
    await admin.query(`create schema ${schema}`);
    const pool = new pg.Pool({
      connectionString: testDatabaseUrl,
      max: 10,
      options: `-c search_path=${schema}`,
    });
    for (const [path, text] of migrationTexts) {
      try {
        await pool.query(text);
      } catch (err) {
        throw new Error(`migration ${path} failed: ${err.message}`);
      }
    }
    return {
      name: "real PostgreSQL",
      realLocking: true,
      query: async (text, params = []) => (await pool.query(text, params)).rows,
      transaction: async (fn) => {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const result = await fn(taggedTx(async (t, p) => (await client.query(t, p)).rows));
          await client.query("COMMIT");
          return result;
        } catch (err) {
          await client.query("ROLLBACK").catch(() => undefined);
          throw err;
        } finally {
          client.release();
        }
      },
      close: async () => {
        await pool.end();
        await admin.query(`drop schema ${schema} cascade`);
        await admin.end();
      },
    };
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite({
    parsers: { [OID_INT8]: Number, [OID_DATE]: identity, [OID_INTERVAL]: identity },
  });
  await db.waitReady;
  for (const [path, text] of migrationTexts) {
    try {
      await db.exec(text);
    } catch (err) {
      throw new Error(`migration ${path} failed: ${err.message}`);
    }
  }
  return {
    name: "PGlite (logic only, no row-lock proof)",
    realLocking: false,
    query: async (text, params = []) => (await db.query(text, params)).rows,
    transaction: (fn) =>
      db.transaction((client) => fn(taggedTx(async (t, p) => (await client.query(t, p)).rows))),
    close: async () => db.close(),
  };
}

const db = await openBackend();
console.log(`[integration] backend: ${db.name}`);

const book = (req, userId = "test-user") => db.transaction((tx) => placeBooking(tx, userId, req));
const person = { firstName: "Test", lastName: "Guest", email: "test@example.com" };
const settle = (reqs) => Promise.allSettled(reqs.map((r, i) => book(r, `user-${i}`)));
const split = (results) => ({
  ok: results.filter((r) => r.status === "fulfilled").map((r) => r.value),
  failed: results.filter((r) => r.status === "rejected").map((r) => r.reason.message),
});
const confirmed = async (where, params) =>
  (await db.query(`select * from bookings where status = 'confirmed' and ${where}`, params));

async function step(name, fn) {
  await db.query("delete from bookings");
  await fn();
  console.log(`[integration] ok: ${name}`);
}

try {
  await step("tour: concurrent requests never exceed departure seats", async () => {
    await db.query("update tour_departures set max_people = 2 where id = 'junk-1'");
    const req = { kind: "tour", itemId: "junk-halong", departureId: "junk-1", startDate: "2026-10-12", guests: 1, nights: 1, ...person };
    const { ok, failed } = split(await settle([req, req, req, req]));
    assert.equal(ok.length, 2, `expected exactly 2 admitted, got ${ok.length}`);
    assert.equal(failed.length, 2);
    assert.ok(failed.every((m) => m === "Not enough seats on that departure"), failed.join(" | "));
    const seats = await db.query("select coalesce(sum(guests),0)::int as n from bookings where departure_id = 'junk-1' and status = 'confirmed'");
    assert.equal(seats[0].n, 2);
  });

  await step("stay: concurrent overlapping requests never exceed inventory", async () => {
    await db.query("update stays set inventory_unit_count = 1 where id = 'sapa-lodge'");
    const req = { kind: "stay", itemId: "sapa-lodge", startDate: "2027-03-01", guests: 2, nights: 3, ...person };
    const { ok, failed } = split(await settle([req, req, req, req]));
    assert.equal(ok.length, 1, `expected exactly 1 admitted, got ${ok.length}`);
    assert.ok(failed.every((m) => m === "Not enough rooms for those dates"), failed.join(" | "));
    assert.equal((await confirmed("item_id = 'sapa-lodge'")).length, 1);
  });

  await step("car: concurrent overlapping requests never exceed inventory", async () => {
    const req = { kind: "car", itemId: "sedan-hanoi", startDate: "2027-03-01", guests: 1, nights: 2, ...person };
    const { ok, failed } = split(await settle([req, req, req, req]));
    assert.equal(ok.length, 1, `expected exactly 1 admitted, got ${ok.length}`);
    assert.ok(failed.every((m) => m === "Car is unavailable for those dates"), failed.join(" | "));
    assert.equal((await confirmed("item_id = 'sedan-hanoi'")).length, 1);
  });

  await step("stay: same-day check-out / check-in is allowed, overlap is not", async () => {
    const base = { kind: "stay", itemId: "sapa-lodge", guests: 2, ...person };
    await book({ ...base, startDate: "2027-04-01", nights: 3 }); // occupies 1-3 Apr, leaves 4 Apr
    await book({ ...base, startDate: "2027-04-04", nights: 1 }); // starts on the check-out day
    await assert.rejects(book({ ...base, startDate: "2027-04-03", nights: 1 }), /Not enough rooms/);
  });

  await step("cancellation frees inventory", async () => {
    const req = { kind: "car", itemId: "sedan-hanoi", startDate: "2027-05-01", guests: 1, nights: 2, ...person };
    const first = await book(req);
    await assert.rejects(book(req), /Car is unavailable/);
    await db.query("update bookings set status = 'cancelled' where id = $1", [first.id]);
    await book(req);
  });

  await step("price is derived from catalog data, never from the client", async () => {
    // Unit prices come from the seeded catalog (migrations), not from the request.
    const prices = await db.query(
      `select (select price_per_night from stays where id = 'sapa-lodge')::float as stay,
              (select price_per_day from cars where id = 'sedan-hanoi')::float as car,
              (select price from tour_departures where id = 'junk-1')::float as tour`,
    );
    const { stay, car, tour } = prices[0];
    const forged = { total: 1, total_price: 1 }; // must be ignored
    const s = await book({ kind: "stay", itemId: "sapa-lodge", startDate: "2027-06-01", guests: 2, nights: 3, ...person, ...forged });
    const c = await book({ kind: "car", itemId: "sedan-hanoi", startDate: "2027-06-01", guests: 1, nights: 2, ...person, ...forged });
    await db.query("update tour_departures set max_people = 8 where id = 'junk-1'");
    const t = await book({ kind: "tour", itemId: "junk-halong", departureId: "junk-1", startDate: "2026-10-12", guests: 2, nights: 1, ...person, ...forged });
    assert.equal(s.total, stay * 3, "stay total = price_per_night x nights");
    assert.equal(c.total, car * 2, "car total = price_per_day x days");
    assert.equal(t.total, tour * 2, "tour total = departure price x guests");
    const stored = await db.query("select id, total_price::float as total from bookings");
    for (const [id, total] of [[s.id, s.total], [c.id, c.total], [t.id, t.total]]) {
      assert.equal(stored.find((r) => r.id === id).total, total, "stored total matches returned total");
    }
  });
} finally {
  await db.close();
}

console.log(
  db.realLocking
    ? "[integration] PASS on real PostgreSQL (row locking exercised)."
    : "[integration] PASS on PGlite — logic only; set TEST_DATABASE_URL to prove row locking.",
);
