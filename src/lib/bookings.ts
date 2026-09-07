import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

const bookingInput = z.object({
  kind: z.enum(["tour", "stay", "car"]),
  itemId: z.string().min(1),
  departureId: z.string().optional(),
  startDate: z.string().min(8),
  guests: z.number().int().min(1).max(16),
  nights: z.number().int().min(1).max(21),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  notes: z.string().max(2000).optional(),
});

const contactInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(4).max(4000),
});

export type BookingRow = {
  id: string;
  kind: string;
  item_id: string;
  start_date: string;
  guests: number;
  nights: number;
  total_price: number;
  status: string;
  title_en: string;
  title_vn: string;
};

function money(value: unknown) {
  const n = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export const createBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: unknown) => bookingInput.parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    let total = 0;

    if (data.kind === "tour") {
      if (!data.departureId) throw new Error("Pick a departure.");
      const [dep] = await sql<{
        id: string;
        price: number;
        max_people: number;
        booked: number;
        start_date: string;
      }[]>`
        select
          td.id, td.price::float as price, td.max_people,
          td.start_date::text as start_date,
          coalesce((
            select sum(b.guests) from bookings b
            where b.departure_id = td.id and b.status = 'confirmed'
          ), 0)::int as booked
        from tour_departures td
        where td.id = ${data.departureId} and td.tour_id = ${data.itemId}
        limit 1
      `;
      if (!dep) throw new Error("That departure is not on the list.");
      const left = dep.max_people - Number(dep.booked);
      if (data.guests > left) throw new Error("Not enough seats on that departure.");
      total = money(dep.price) * data.guests;
    } else if (data.kind === "stay") {
      const [stay] = await sql<{ price_per_night: number }[]>`
        select price_per_night::float as price_per_night from stays where id = ${data.itemId} limit 1
      `;
      if (!stay) throw new Error("Stay not found.");
      total = money(stay.price_per_night) * data.nights;
    } else {
      const [car] = await sql<{ price_per_day: number }[]>`
        select price_per_day::float as price_per_day from cars where id = ${data.itemId} limit 1
      `;
      if (!car) throw new Error("Car not found.");
      total = money(car.price_per_day) * data.nights;
    }

    const id = newId("bk");
    await sql`
      insert into bookings (
        id, user_id, kind, item_id, departure_id, start_date,
        guests, nights, first_name, last_name, email, phone, notes,
        total_price, status
      ) values (
        ${id}, ${userId}, ${data.kind}, ${data.itemId}, ${data.departureId ?? null},
        ${data.startDate}, ${data.guests}, ${data.nights},
        ${data.firstName}, ${data.lastName}, ${data.email},
        ${data.phone ?? null}, ${data.notes ?? null}, ${total}, 'confirmed'
      )
    `;
    return { id, total };
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId as string;
    const rows = await sql<BookingRow[]>`
      select
        b.id, b.kind, b.item_id, b.start_date::text as start_date,
        b.guests, b.nights, b.total_price::float as total_price, b.status,
        coalesce(t.title_en, s.title_en, c.title_en, b.kind) as title_en,
        coalesce(t.title_vn, s.title_vn, c.title_vn, b.kind) as title_vn
      from bookings b
      left join tours t on b.kind = 'tour' and t.id = b.item_id
      left join stays s on b.kind = 'stay' and s.id = b.item_id
      left join cars c on b.kind = 'car' and c.id = b.item_id
      where b.user_id = ${userId}
      order by b.created_at desc
    `;
    return rows.map((r) => ({ ...r, total_price: money(r.total_price) }));
  });

export const sendContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: unknown) => contactInput.parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const id = newId("msg");
    await sql`
      insert into contact_messages (id, user_id, name, email, message)
      values (${id}, ${userId}, ${data.name}, ${data.email}, ${data.message})
    `;
    return { id };
  });
