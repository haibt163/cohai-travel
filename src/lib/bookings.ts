import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { num } from "@/lib/utils";

const bookingInput = z.object({
  kind: z.enum(["tour", "stay", "car"]),
  itemId: z.string().min(1),
  departureId: z.string().optional(),
  startDate: z.string().min(8),
  guests: z.number().int().min(1).max(16),
  nights: z.number().int().min(1).max(30),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  notes: z.string().max(800).optional(),
});

export type BookingRow = {
  id: string;
  kind: string;
  item_id: string;
  departure_id: string | null;
  start_date: string;
  guests: number;
  nights: number;
  first_name: string;
  last_name: string;
  email: string;
  total_price: number;
  status: string;
  created_at: string;
  title_en: string;
  title_vn: string;
};

export const createBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => bookingInput.parse(raw))
  .handler(async ({ context, data }) => {
    const sql = await getSql();

    return sql.transaction(async (tx) => {
      let total = 0;
      let startDate = data.startDate;

      if (data.kind === "tour") {
        if (!data.departureId) throw new Error("Choose a departure");
        const deps = await tx<{
          id: string;
          start_date: string;
          price: string | number;
          max_people: number;
          booked: number;
        }>`
          select td.id, td.start_date, td.price, td.max_people,
            coalesce((select sum(guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)::int as booked
          from tour_departures td
          where td.id = ${data.departureId} and td.tour_id = ${data.itemId}
          for update
        `;
        const dep = deps[0];
        if (!dep) throw new Error("Departure not found");
        const left = dep.max_people - num(dep.booked);
        if (data.guests > left) throw new Error("Not enough seats on that departure");
        total = num(dep.price) * data.guests;
        startDate = dep.start_date;
      } else if (data.kind === "stay") {
        const stays = await tx<{ price_per_night: string | number }>`
          select price_per_night from stays where id = ${data.itemId} limit 1
        `;
        if (!stays[0]) throw new Error("Stay not found");
        total = num(stays[0].price_per_night) * data.nights;
      } else {
        const cars = await tx<{ price_per_day: string | number }>`
          select price_per_day from cars where id = ${data.itemId} limit 1
        `;
        if (!cars[0]) throw new Error("Car not found");
        total = num(cars[0].price_per_day) * data.nights;
      }

      const id = crypto.randomUUID();
      await tx`
        insert into bookings (
          id, user_id, kind, item_id, departure_id, start_date, guests, nights,
          first_name, last_name, email, phone, notes, total_price, status
        ) values (
          ${id}, ${context.userId}, ${data.kind}, ${data.itemId}, ${data.departureId ?? null},
          ${startDate}, ${data.guests}, ${data.nights}, ${data.firstName}, ${data.lastName},
          ${data.email}, ${data.phone ?? null}, ${data.notes ?? null}, ${total}, 'confirmed'
        )
      `;
      return { id, total };
    });
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      kind: string;
      item_id: string;
      departure_id: string | null;
      start_date: string;
      guests: number;
      nights: number;
      first_name: string;
      last_name: string;
      email: string;
      total_price: string | number;
      status: string;
      created_at: string;
    }>`
      select id, kind, item_id, departure_id, start_date, guests, nights,
        first_name, last_name, email, total_price, status, created_at
      from bookings
      where user_id = ${context.userId}
      order by created_at desc
    `;

    const titled: BookingRow[] = [];
    for (const row of rows) {
      let title_en = row.item_id;
      let title_vn = row.item_id;
      if (row.kind === "tour") {
        const t = await sql<{ title_en: string; title_vn: string }>`
          select title_en, title_vn from tours where id = ${row.item_id} limit 1
        `;
        if (t[0]) ({ title_en, title_vn } = t[0]);
      } else if (row.kind === "stay") {
        const t = await sql<{ title_en: string; title_vn: string }>`
          select title_en, title_vn from stays where id = ${row.item_id} limit 1
        `;
        if (t[0]) ({ title_en, title_vn } = t[0]);
      } else {
        const t = await sql<{ title_en: string; title_vn: string }>`
          select title_en, title_vn from cars where id = ${row.item_id} limit 1
        `;
        if (t[0]) ({ title_en, title_vn } = t[0]);
      }
      titled.push({ ...row, total_price: num(row.total_price), title_en, title_vn });
    }
    return titled;
  });

const contactInput = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  message: z.string().min(8).max(2000),
});

export const sendContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => contactInput.parse(raw))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into contact_messages (id, user_id, name, email, message)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.name}, ${data.email}, ${data.message})
    `;
    return { ok: true as const };
  });
