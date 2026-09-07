# CoHai Travel — project status

Last updated: 7 September 2026.

## One-line status

v1 of the **CoHai Travel** booking site is running as a React app: editorial atlas, live tour departures in AUD, EN/VN chrome, stays and cars on day one, sign-in required to hold a seat.

## Product choices (locked for v1)

| Decision | Choice |
| --- | --- |
| Brand | CoHai Travel |
| Commerce | Live departure booking (not request-only, not vacancy calendars) |
| CMS | Postgres + seed (+ thin operator admin later). Not headless WP |
| IA | Tours, destinations, contact, stays, cars from day one |
| Currency | AUD |
| Languages | English + Vietnamese |
| Visual | Paper / ink / teal. Fraunces + IBM Plex Sans |

## Why this stack (not Next.js App Router)

The original brief asked for a modern Next.js rebuild. The environment that actually hosts the playable preview is the Grok App Builder sandbox, which **requires TanStack Start + Vite + React 19 + Tailwind v4**, not Next.js App Router.

That is an environment constraint, not a product change:

- Same React UI, same Postgres schema, same booking rules
- File routes instead of the App Router `app/` directory
- `createServerFn` instead of Next server actions
- i18n via `LocaleProvider`, not `next-intl`

A future move onto Next.js is a packaging change. Do not start a second app folder unless the product is being re-hosted.

### Runtime stack as built

```
React 19
TanStack Start / Router / Query
Vite 8
Tailwind CSS v4
Better Auth (Google, X) + Grok broker
Postgres — Neon on deploy, PGLite in preview
Zod
Lucide icons
```

Auth is **on** because bookings and contact messages store PII and must be scoped to `user_id`. Catalog reads stay public.

## What shipped in v1

### Schema (`migrations/`)

- `0001_auth.sql` — Better Auth identity tables (copied up so sign-in applies)
- `0002_catalog.sql` — `destinations`, `tours`, `tour_departures`, `stays`, `cars`, `bookings`, `contact_messages`
- `0003_seed.sql` — 10 places, 9 tours, 6 stays, 4 cars, 23 departures

### Server functions

- `src/lib/catalog.ts` — list/get/search for public inventory; remaining seats computed from confirmed bookings
- `src/lib/bookings.ts` — `createBooking`, `listMyBookings`, `sendContact` behind `authMiddleware`

### Surfaces

- Home with Ha Long hero, chapter tiles (Nature / Coast / UNESCO), featured journeys, neighbour gates (Angkor, Bangkok)
- Tour index with chapter chips; tour detail with itinerary + departure picker
- Destination, stay, and car indexes + details
- Search across tours, stays, cars, places
- Contact form (signed-in)
- Login (Google / X) and My trips
- EN/VN toggle persisted in `localStorage`

### Design

- Tokens in `src/styles.css`
- Shell: currency + language + auth slot, sticky nav, ink footer
- Generated destination photography under `public/media/`
- Brand card `public/og.jpg`, mark `public/favicon.svg`

### Quality bar that already passed in the builder

- `npm run typecheck`
- `npm run build`
- Desktop + mobile browser smoke, no console errors, no horizontal overflow
- Production build rendered the same homepage copy as dev

## What is not in v1

| Gap | Notes |
| --- | --- |
| Operator / desk admin | “Thin admin” was the CMS decision, not a shipped UI. My trips is guest-facing only |
| Parse of `data_vietaustravel` | Seed invented to the old IA instead of importing 845 KB of posts |
| Payments | Hold is a confirmed row in Postgres, not a card charge |
| Email / WhatsApp tickets | Confirmation is on-site only |
| Reviews, room types, two-location car dropoff | Flattened or omitted |
| URL-prefixed locales (`/vn/...`) | Client toggle only |
| Standalone Next.js repo | This React app *is* the rebuild |

## Implementation plan

### Phase 0 — done

Brand, stack, IA, schema, seed, chrome, public catalog, authenticated booking + contact.

### Phase 1 — desk

- Signed-in operator view of bookings and contact messages
- Status changes (`confirmed` / `cancelled`) that free departure seats
- Optional CSV / email of a booking

### Phase 2 — dump fidelity

- Map `data_vietaustravel` posts onto `destinations` / `tours` / `stays`
- Keep AUD prices; do not import vacancy rows blindly
- Replace generated photos with licensed operator photography where it exists

### Phase 3 — commerce depth

- Payment hold (Stripe in AUD) before `confirmed`
- Waitlist when a departure is full
- Room-level stay inventory if the desk needs it
- Driver-assigned cars

### Phase 4 — packaging (optional)

- If the public site should live on Vercel as a conventional Next.js app, port routes 1:1
- Keep Postgres + Better Auth (or the same session issuer)
- Do not reopen WordPress

## Repo vs preview

| Surface | Role |
| --- | --- |
| This GitHub repo (`haibt163/cohai-travel`) | Source of record, docs, catalog seed, UI |
| Grok App Builder preview | Running v1 with platform auth + PGLite/Neon |
| `haibt163/travel` | Frozen WordPress dump — do not overwrite |

## How to extend the catalog

Add a new ordered migration. Example:

```sql
-- migrations/0004_more_departures.sql
insert into tour_departures (id, tour_id, start_date, price, max_people)
values ('junk-4', 'junk-halong', '2027-02-08', 990, 12);
```

Then add EN/VN copy in `src/lib/locale.tsx` only if new chrome strings are required. Catalog copy lives in the row, not the dictionary.
