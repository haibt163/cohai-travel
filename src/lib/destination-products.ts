import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { num } from "@/lib/utils";

export type DestinationStay = {
  id: string;
  slug: string;
  star_count: number;
  price_per_night: number;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  image: string;
};

export type DestinationCar = {
  id: string;
  slug: string;
  seats: number;
  transmission: string;
  price_per_day: number;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  image: string;
};

export const staysForDestination = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const rows = await sql<DestinationStay & { price_per_night: string | number }>`
      select s.id, s.slug, s.star_count, s.price_per_night, s.title_en, s.title_vn,
        s.excerpt_en, s.excerpt_vn, s.image
      from stays s
      where s.destination_id = ${id}
      order by s.star_count desc, s.title_en
    `;
    return rows.map((row) => ({ ...row, price_per_night: num(row.price_per_night) }));
  });

export const carsForDestination = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const rows = await sql<DestinationCar & { price_per_day: string | number }>`
      select c.id, c.slug, c.seats, c.transmission, c.price_per_day, c.title_en, c.title_vn,
        c.excerpt_en, c.excerpt_vn, c.image
      from cars c
      where c.pickup_id = ${id}
      order by c.price_per_day, c.title_en
    `;
    return rows.map((row) => ({ ...row, price_per_day: num(row.price_per_day) }));
  });
