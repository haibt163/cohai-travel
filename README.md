# CoHai Travel

Private journeys in Vietnam, Cambodia and Thailand. Booked in Australian dollars, with live seats.

This repository is the source of record for the **React rebuild** of the old VietAus WordPress site. The WordPress dump stays at [`haibt163/travel`](https://github.com/haibt163/travel) and is not the runtime.

Start here:

1. [`AGENTS.md`](./AGENTS.md) — product rules and stack
2. [`OriginalWordPress.md`](./OriginalWordPress.md) — what the archive contained
3. [`ProjectStatus.md`](./ProjectStatus.md) — what shipped and what is next

## v1 in one paragraph

Guests browse three chapters (Nature, Coast, UNESCO), open a journey, pick a dated departure with remaining seats, and hold it under a signed-in account. Stays and cars book by date. Chrome is English / Vietnamese. Prices are AUD. The catalog lives in Postgres, not in WordPress.

## Stack

React 19 · TanStack Start · Vite · Tailwind v4 · Better Auth · Postgres.

The playable preview was built in the Grok App Builder sandbox, which is why this is TanStack Start rather than Next.js App Router. See `ProjectStatus.md` for the rationale.

## What is in the repo now

- `src/routes/` — home, journeys, places, stays, cars, search, contact, login, My trips
- `src/components/` — shell, cards, booking form, cover, search box
- `src/lib/` — catalog + bookings server functions, locale, tokens helpers, auth adapters
- `migrations/` — catalog schema and seed

A standalone `npm run dev` still needs the TanStack Start scaffold (`package.json`, Vite config, generated route tree), Better Auth credentials, and `public/media/` images from the preview.

## Status

v1 catalog + booking UI source is on `main`. Operator admin, payments, and a row-level import of `data_vietaustravel` are later phases.
