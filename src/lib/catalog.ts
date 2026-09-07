import { createServerFn } from "@tanstack/react-start";
import { sql } from "@/lib/db";

export type TourCard = {
  id: string;
  slug: string;
  destination_id: string;
  chapter: string;
  duration_days: number;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  image: string;
  featured: boolean;
  dest_title_en: string;
  dest_title_vn: string;
  dest_slug: string;
  from_price: number;
};

export type Departure = {
  id: string;
  tour_id: string;
  start_date: string;
  price: number;
  max_people: number;
  booked: number;
};

export type DestinationRow = {
  id: string;
  slug: string;
  country: string;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  body_en: string;
  body_vn: string;
  image: string;
  languages: string | null;
  currency: string | null;
};

export type StayRow = {
  id: string;
  slug: string;
  destination_id: string;
  star_count: number;
  price_per_night: number;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  body_en: string;
  body_vn: string;
  image: string;
  dest_title_en: string;
  dest_title_vn: string;
};

export type CarRow = {
  id: string;
  slug: string;
  pickup_id: string;
  seats: number;
  transmission: string;
  price_per_day: number;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  image: string;
  dest_title_en: string;
  dest_title_vn: string;
};

export type SearchHit = {
  kind: "tour" | "stay" | "car" | "destination";
  slug: string;
  image: string;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
};

function money(value: unknown) {
  const n = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function asTour(r: TourCard): TourCard {
  return { ...r, from_price: money(r.from_price), featured: Boolean(r.featured) };
}

export const listTours = createServerFn({ method: "GET" })
  .inputValidator((data: { chapter?: string } | undefined) => data ?? {})
  .handler(async ({ data }) => {
    const chapter = data.chapter;
    const rows = chapter
      ? await sql<TourCard[]>`
          select
            t.id, t.slug, t.destination_id, t.chapter, t.duration_days,
            t.title_en, t.title_vn, t.excerpt_en, t.excerpt_vn, t.image, t.featured,
            d.title_en as dest_title_en, d.title_vn as dest_title_vn, d.slug as dest_slug,
            coalesce((
              select min(td.price)::float from tour_departures td
              where td.tour_id = t.id and td.start_date >= current_date
            ), 0) as from_price
          from tours t
          join destinations d on d.id = t.destination_id
          where t.chapter = ${chapter}
          order by t.featured desc, t.title_en
        `
      : await sql<TourCard[]>`
          select
            t.id, t.slug, t.destination_id, t.chapter, t.duration_days,
            t.title_en, t.title_vn, t.excerpt_en, t.excerpt_vn, t.image, t.featured,
            d.title_en as dest_title_en, d.title_vn as dest_title_vn, d.slug as dest_slug,
            coalesce((
              select min(td.price)::float from tour_departures td
              where td.tour_id = t.id and td.start_date >= current_date
            ), 0) as from_price
          from tours t
          join destinations d on d.id = t.destination_id
          order by t.featured desc, t.title_en
        `;
    return rows.map(asTour);
  });

export const getTour = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const [tour] = await sql<(TourCard & { body_en: string; body_vn: string })[]>`
      select
        t.id, t.slug, t.destination_id, t.chapter, t.duration_days,
        t.title_en, t.title_vn, t.excerpt_en, t.excerpt_vn, t.body_en, t.body_vn,
        t.image, t.featured,
        d.title_en as dest_title_en, d.title_vn as dest_title_vn, d.slug as dest_slug,
        coalesce((
          select min(td.price)::float from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
        ), 0) as from_price
      from tours t
      join destinations d on d.id = t.destination_id
      where t.slug = ${slug}
      limit 1
    `;
    if (!tour) return null;
    const departures = await sql<Departure[]>`
      select
        td.id, td.tour_id, td.start_date::text as start_date,
        td.price::float as price, td.max_people,
        coalesce((
          select sum(b.guests) from bookings b
          where b.departure_id = td.id and b.status = 'confirmed'
        ), 0)::int as booked
      from tour_departures td
      where td.tour_id = ${tour.id}
      order by td.start_date
    `;
    return {
      tour: asTour(tour),
      departures: departures.map((d) => ({
        ...d,
        price: money(d.price),
        booked: Number(d.booked) || 0,
      })),
    };
  });

export const listDestinations = createServerFn({ method: "GET" }).handler(async () => {
  return sql<DestinationRow[]>`
    select * from destinations order by country, title_en
  `;
});

export const getDestination = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const [row] = await sql<DestinationRow[]>`
      select * from destinations where slug = ${slug} limit 1
    `;
    return row ?? null;
  });

export const toursForDestination = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const rows = await sql<TourCard[]>`
      select
        t.id, t.slug, t.destination_id, t.chapter, t.duration_days,
        t.title_en, t.title_vn, t.excerpt_en, t.excerpt_vn, t.image, t.featured,
        d.title_en as dest_title_en, d.title_vn as dest_title_vn, d.slug as dest_slug,
        coalesce((
          select min(td.price)::float from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
        ), 0) as from_price
      from tours t
      join destinations d on d.id = t.destination_id
      where t.destination_id = ${id}
      order by t.featured desc, t.title_en
    `;
    return rows.map(asTour);
  });

export const listStays = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql<StayRow[]>`
    select s.*, d.title_en as dest_title_en, d.title_vn as dest_title_vn
    from stays s
    join destinations d on d.id = s.destination_id
    order by s.star_count desc, s.title_en
  `;
  return rows.map((r) => ({ ...r, price_per_night: money(r.price_per_night) }));
});

export const getStay = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const [row] = await sql<StayRow[]>`
      select s.*, d.title_en as dest_title_en, d.title_vn as dest_title_vn
      from stays s
      join destinations d on d.id = s.destination_id
      where s.slug = ${slug}
      limit 1
    `;
    return row ? { ...row, price_per_night: money(row.price_per_night) } : null;
  });

export const listCars = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql<CarRow[]>`
    select c.*, d.title_en as dest_title_en, d.title_vn as dest_title_vn
    from cars c
    join destinations d on d.id = c.pickup_id
    order by c.seats, c.title_en
  `;
  return rows.map((r) => ({ ...r, price_per_day: money(r.price_per_day) }));
});

export const getCar = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const [row] = await sql<CarRow[]>`
      select c.*, d.title_en as dest_title_en, d.title_vn as dest_title_vn
      from cars c
      join destinations d on d.id = c.pickup_id
      where c.slug = ${slug}
      limit 1
    `;
    return row ? { ...row, price_per_day: money(row.price_per_day) } : null;
  });

export const searchCatalog = createServerFn({ method: "GET" })
  .inputValidator((data: { q?: string; chapter?: string } | undefined) => data ?? {})
  .handler(async ({ data }) => {
    const q = (data.q ?? "").trim();
    if (!q) return [] as SearchHit[];
    const like = `%${q}%`;

    const tours = await sql<SearchHit[]>`
      select 'tour'::text as kind, t.slug, t.image, t.title_en, t.title_vn, t.excerpt_en, t.excerpt_vn
      from tours t
      where t.title_en ilike ${like} or t.title_vn ilike ${like}
         or t.excerpt_en ilike ${like} or t.excerpt_vn ilike ${like}
         or t.chapter ilike ${like}
      limit 12
    `;
    const stays = await sql<SearchHit[]>`
      select 'stay'::text as kind, slug, image, title_en, title_vn, excerpt_en, excerpt_vn
      from stays
      where title_en ilike ${like} or title_vn ilike ${like}
         or excerpt_en ilike ${like} or excerpt_vn ilike ${like}
      limit 8
    `;
    const cars = await sql<SearchHit[]>`
      select 'car'::text as kind, slug, image, title_en, title_vn, excerpt_en, excerpt_vn
      from cars
      where title_en ilike ${like} or title_vn ilike ${like}
         or excerpt_en ilike ${like} or excerpt_vn ilike ${like}
      limit 8
    `;
    const places = await sql<SearchHit[]>`
      select 'destination'::text as kind, slug, image, title_en, title_vn, excerpt_en, excerpt_vn
      from destinations
      where title_en ilike ${like} or title_vn ilike ${like}
         or country ilike ${like} or excerpt_en ilike ${like} or excerpt_vn ilike ${like}
      limit 8
    `;
    return [...tours, ...stays, ...cars, ...places];
  });
