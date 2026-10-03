import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { placeBooking } from "@/lib/booking-core";
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

const availabilityInput = z.object({
  kind: z.enum(["stay", "car"]),
  itemId: z.string().min(1),
  startDate: z.string().min(8),
  nights: z.number().int().min(1).max(30),
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

export const checkItemAvailability = createServerFn({ method: "GET" })
  .validator((raw: unknown) => availabilityInput.parse(raw))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const table = data.kind === "stay" ? "stays" : "cars";
    const rows = data.kind === "stay"
      ? await sql<{ inventory_unit_count: number }>`select inventory_unit_count from stays where id = ${data.itemId} limit 1`
      : await sql<{ inventory_unit_count: number }>`select inventory_unit_count from cars where id = ${data.itemId} limit 1`;
    const item = rows[0];
    if (!item) return { availableUnits: 0 };

    const conflicts = await sql<{ booked_units: number }>`
      select coalesce(sum(inventory_units), 0)::int as booked_units
      from bookings
      where kind = ${data.kind}
        and item_id = ${data.itemId}
        and status = 'confirmed'
        and start_date < (${data.startDate}::date + ${data.nights}::int)
        and (start_date + nights) > ${data.startDate}::date
    `;

    return {
      availableUnits: Math.max(0, item.inventory_unit_count - num(conflicts[0]?.booked_units ?? 0)),
      source: table,
    };
  });

export const createBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => bookingInput.parse(raw))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return sql.transaction((tx) => placeBooking(tx, context.userId, data));
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
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(8).max(2000),
  website: z.string().max(200).optional(),
});

export const sendContact = createServerFn({ method: "POST" })
  .validator((raw: unknown) => contactInput.parse(raw))
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.website?.trim()) return { ok: true as const };

    const recent = await sql<{ count: number }>`
      select count(*)::int as count
      from contact_messages
      where lower(email) = lower(${data.email})
        and created_at > now() - interval '1 hour'
    `;
    if (num(recent[0]?.count ?? 0) >= 5) {
      throw new Error("Too many messages. Please try again later.");
    }

    await sql`
      insert into contact_messages (id, user_id, name, email, message)
      values (${crypto.randomUUID()}, null, ${data.name}, ${data.email}, ${data.message})
    `;
    return { ok: true as const };
  });
