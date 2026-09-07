# CoHai Travel — project status

Last updated: 7 September 2026 (standalone TanStack Start scaffold on `main`).

## One-line status

v1 of the **CoHai Travel** booking site is a bootable React app: editorial atlas, live tour departures in AUD, EN/VN chrome, stays and cars on day one, sign-in required to hold a seat. `npm run dev` works outside the App Builder once `.env` points at Neon.

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
TanStack Start / Router
Vite 7+
Tailwind CSS v4
Better Auth (Google, X) + Neon Postgres
Zod
Lucide icons
```

Auth is **on** because bookings and contact messages store PII and must be scoped to `user_id`. Catalog reads stay public.

## What shipped in v1

### Schema (`migrations/`)

- `0001_auth.sql` — Better Auth `user` / `session` / `account` / `verification`
- `0002_catalog.sql` — destinations, tours, departures, stays, cars, bookings, contact
- `0003_seed.sql` — 10 places, 9 tours, 6 stays, 4 cars, 23 departures

Apply with `npm run db:migrate`.

### Server functions

- `src/lib/catalog.ts` — list/get/search; remaining seats from confirmed bookings
- `src/lib/bookings.ts` — `createBooking`, `listMyBookings`, `sendContact` behind `authMiddleware`

### Surfaces

- Home with Ha Long hero, chapter tiles, featured journeys, neighbour gates
- Tour / destination / stay / car indexes and details
- Search, contact, login (Google / X), My trips
- EN/VN toggle persisted in `localStorage`

### Standalone boot (this drop)

- `package.json`, `vite.config.ts`, `tsconfig.json`, generated `src/routeTree.gen.ts`
- Wired Better Auth (`src/lib/auth/server.ts`) with a `pg` pool + `tanstackStartCookies`
- Client session via `better-auth/react` (`authClient.useSession`)
- `.env.example` for Neon + Google + X
- `scripts/migrate.mjs` and `scripts/fetch-media.mjs`
- Editorial SVG plates in `public/media/` (Cover falls back from `.jpg` → `.svg`)

## What is not in v1

| Gap | Notes |
| --- | --- |
| Operator / desk admin | My trips is guest-facing only |
| Parse of `data_vietaustravel` | Seed invented to the old IA |
| Payments | Hold is a confirmed row, not a card charge |
| Email / WhatsApp tickets | Confirmation is on-site only |
| Licensed operator photography | SVG plates + optional Unsplash fetch until Phase 2 |
| Standalone Next.js repo | This React app *is* the rebuild |

## Implementation plan

### Phase 0 — done

Brand, stack, IA, schema, seed, chrome, public catalog, authenticated booking + contact. Preview UI source and the Vite / Start scaffold are on `main`.

### Phase 1 — desk

- Signed-in operator view of bookings and contact messages
- Status changes (`confirmed` / `cancelled`) that free departure seats

### Phase 2 — dump fidelity

- Map `data_vietaustravel` posts onto catalog tables
- Replace plates with licensed operator photography

### Phase 3 — commerce depth

- Stripe hold in AUD before `confirmed`
- Waitlist when a departure is full

### Phase 4 — packaging (optional)

- Port routes 1:1 to Next.js only if hosting requires it
- Keep Postgres + Better Auth. Do not reopen WordPress.

## Repo vs preview

| Surface | Role |
| --- | --- |
| `haibt163/cohai-travel` | Source of record |
| Grok App Builder preview | Running v1 with platform auth + PGLite/Neon |
| `haibt163/travel` | Frozen WordPress dump — do not overwrite |
