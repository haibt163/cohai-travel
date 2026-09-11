import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { num } from "@/lib/utils";

export type Chapter = "nature" | "beach" | "unesco";
export type ProvenanceState = "source-backed" | "modern-addition" | "synthetic-pending";

export type Destination = {
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
  source_ref: string | null;
  provenance_state: ProvenanceState;
};

export type TourCard = {
  id: string;
  slug: string;
  destination_id: string;
  chapter: Chapter;
  duration_days: number;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  body_en: string;
  body_vn: string;
  image: string;
  featured: boolean;
  dest_slug: string;
  dest_title_en: string;
  dest_title_vn: string;
  from_price: number;
  next_departure: string | null;
  available_departures: number;
  source_ref: string | null;
  provenance_state: ProvenanceState;
};

export type Departure = {
  id: string;
  tour_id: string;
  start_date: string;
  price: number;
  max_people: number;
  booked: number;
};

export type Stay = {
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
  dest_slug: string;
  dest_title_en: string;
  dest_title_vn: string;
};

export type Car = {
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
  body_en: string;
  body_vn: string;
  image: string;
  dest_slug: string;
  dest_title_en: string;
  dest_title_vn: string;
};

type TourRow = Omit<TourCard, "from_price" | "featured" | "duration_days" | "next_departure" | "available_departures" | "provenance_state"> & {
  from_price: string | number | null;
  featured: boolean | number;
  duration_days: number;
  next_departure: string | null;
  available_departures: number | string;
  provenance_state: string;
};

function mapTour(row: TourRow): TourCard {
  return {
    ...row,
    chapter: row.chapter as Chapter,
    featured: Boolean(row.featured),
    from_price: num(row.from_price),
    available_departures: num(row.available_departures),
    provenance_state: row.provenance_state as ProvenanceState,
  };
}

export const listDestinations = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<Destination>`select * from destinations order by title_en`;
});

export const getDestination = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<Destination>`select * from destinations where slug = ${slug} limit 1`;
    return rows[0] ?? null;
  });

export const listTours = createServerFn({ method: "GET" })
  .validator((input: { chapter?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const sql = await getSql();
    const chapter = data.chapter && data.chapter !== "all" ? data.chapter : null;
    const rows = await sql<TourRow>`
      select t.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn,
        (select min(td.price) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as from_price,
        (select min(td.start_date) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as next_departure,
        (select count(*) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as available_departures
      from tours t
      join destinations d on d.id = t.destination_id
      where (${chapter}::text is null or t.chapter = ${chapter})
      order by t.featured desc, t.title_en
    `;
    return rows.map(mapTour);
  });

export const getTour = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const tours = await sql<TourRow>`
      select t.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn,
        (select min(td.price) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as from_price,
        (select min(td.start_date) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as next_departure,
        (select count(*) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as available_departures
      from tours t
      join destinations d on d.id = t.destination_id
      where t.slug = ${slug}
      limit 1
    `;
    const tour = tours[0] ? mapTour(tours[0]) : null;
    if (!tour) return null;
    const deps = await sql<{
      id: string;
      tour_id: string;
      start_date: string;
      price: string | number;
      max_people: number;
      booked: number;
    }>`
      select td.id, td.tour_id, td.start_date, td.price, td.max_people,
        coalesce((select sum(guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)::int as booked
      from tour_departures td
      where td.tour_id = ${tour.id} and td.start_date >= current_date
      order by td.start_date
    `;
    const departures: Departure[] = deps.map((d) => ({ ...d, price: num(d.price), booked: num(d.booked) }));
    return { tour, departures };
  });

export const listStays = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<Stay & { price_per_night: string | number }>`
    select s.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn
    from stays s join destinations d on d.id = s.destination_id
    order by s.title_en
  `;
  return rows.map((r) => ({ ...r, price_per_night: num(r.price_per_night) }));
});

export const getStay = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<Stay & { price_per_night: string | number }>`
      select s.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn
      from stays s join destinations d on d.id = s.destination_id
      where s.slug = ${slug} limit 1
    `;
    const r = rows[0];
    return r ? { ...r, price_per_night: num(r.price_per_night) } : null;
  });

export const listCars = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<Car & { price_per_day: string | number }>`
    select c.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn
    from cars c join destinations d on d.id = c.pickup_id
    order by c.price_per_day
  `;
  return rows.map((r) => ({ ...r, price_per_day: num(r.price_per_day) }));
});

export const getCar = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<Car & { price_per_day: string | number }>`
      select c.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn
      from cars c join destinations d on d.id = c.pickup_id
      where c.slug = ${slug} limit 1
    `;
    const r = rows[0];
    return r ? { ...r, price_per_day: num(r.price_per_day) } : null;
  });

export type SearchHit = {
  kind: "tour" | "stay" | "car" | "place";
  slug: string;
  title_en: string;
  title_vn: string;
  excerpt_en: string;
  excerpt_vn: string;
  image: string;
  meta: string;
  next_departure?: string | null;
  available_departures?: number;
};

export const searchCatalog = createServerFn({ method: "GET" })
  .validator((input: { q?: string; chapter?: string; fromDate?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const q = (data.q ?? "").trim().toLowerCase();
    const like = `%${q}%`;
    const chapter = data.chapter && data.chapter !== "all" ? data.chapter : null;
    const fromDate = data.fromDate ?? null;
    const hits: SearchHit[] = [];

    const tours = await sql<{
      slug: string;
      title_en: string;
      title_vn: string;
      excerpt_en: string;
      excerpt_vn: string;
      image: string;
      chapter: string;
      next_departure: string | null;
      available_departures: number | string;
    }>`
      select t.slug, t.title_en, t.title_vn, t.excerpt_en, t.excerpt_vn, t.image, t.chapter,
        (select min(td.start_date) from tour_departures td
          where td.tour_id = t.id and td.start_date >= coalesce(${fromDate}::date, current_date)
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as next_departure,
        (select count(*) from tour_departures td
          where td.tour_id = t.id and td.start_date >= coalesce(${fromDate}::date, current_date)
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as available_departures
      from tours t
      join destinations d on d.id = t.destination_id
      where (${chapter}::text is null or t.chapter = ${chapter})
        and (
          ${q} = ''
          or lower(t.title_en) like ${like}
          or lower(t.title_vn) like ${like}
          or lower(d.title_en) like ${like}
          or lower(d.title_vn) like ${like}
        )
        and (
          ${fromDate}::date is null
          or exists (
            select 1 from tour_departures td
            where td.tour_id = t.id and td.start_date >= ${fromDate}::date
              and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)
          )
        )
      order by
        (select count(*) from tour_departures td
          where td.tour_id = t.id and td.start_date >= coalesce(${fromDate}::date, current_date)
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) desc,
        (select min(td.start_date) from tour_departures td
          where td.tour_id = t.id and td.start_date >= coalesce(${fromDate}::date, current_date)
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)),
        t.title_en
    `;
    for (const t of tours) hits.push({ kind: "tour", ...t, available_departures: num(t.available_departures), meta: t.chapter });

    if (!chapter) {
      const stays = await sql<Omit<SearchHit, "kind" | "meta" | "next_departure" | "available_departures">>`
        select s.slug, s.title_en, s.title_vn, s.excerpt_en, s.excerpt_vn, s.image
        from stays s join destinations d on d.id = s.destination_id
        where ${q} = '' or lower(s.title_en) like ${like} or lower(d.title_en) like ${like} or lower(s.title_vn) like ${like}
      `;
      for (const s of stays) hits.push({ kind: "stay", ...s, meta: "stay" });
      const cars = await sql<Omit<SearchHit, "kind" | "meta" | "next_departure" | "available_departures">>`
        select c.slug, c.title_en, c.title_vn, c.excerpt_en, c.excerpt_vn, c.image
        from cars c join destinations d on d.id = c.pickup_id
        where ${q} = '' or lower(c.title_en) like ${like} or lower(d.title_en) like ${like}
      `;
      for (const c of cars) hits.push({ kind: "car", ...c, meta: "car" });
      const places = await sql<Omit<SearchHit, "kind" | "meta" | "next_departure" | "available_departures">>`
        select slug, title_en, title_vn, excerpt_en, excerpt_vn, image
        from destinations
        where ${q} = '' or lower(title_en) like ${like} or lower(title_vn) like ${like} or lower(country) like ${like}
      `;
      for (const p of places) hits.push({ kind: "place", ...p, meta: "place" });
    }

    return hits;
  });

export const toursForDestination = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const rows = await sql<TourRow>`
      select t.*, d.slug as dest_slug, d.title_en as dest_title_en, d.title_vn as dest_title_vn,
        (select min(td.price) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as from_price,
        (select min(td.start_date) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as next_departure,
        (select count(*) from tour_departures td
          where td.tour_id = t.id and td.start_date >= current_date
            and td.max_people > coalesce((select sum(b.guests) from bookings b where b.departure_id = td.id and b.status = 'confirmed'), 0)) as available_departures
      from tours t
      join destinations d on d.id = t.destination_id
      where t.destination_id = ${id}
      order by t.title_en
    `;
    return rows.map(mapTour);
  });
