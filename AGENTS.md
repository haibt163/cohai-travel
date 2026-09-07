# CoHai Travel — agent and contributor notes

This repository is the **product source** for CoHai Travel, a modern React rebuild of the old VietAus / BookYourTravel WordPress site (`haibt163/travel`). Read this file before changing information architecture, commerce rules, or the visual system.

Companion docs:

- `OriginalWordPress.md` — what the 2013-era dump actually contained
- `ProjectStatus.md` — current stack, what shipped, what is next

The live preview that was built in the App Builder sandbox is the running v1. This repo is the durable record of that product, not a pixel clone of ThemeForest chrome.

## Product decisions (do not silently reverse)

1. **Brand:** CoHai Travel. Desk in Hanoi, sales posture toward Australia. Currency is **AUD**.
2. **Commerce v1:** live **tour departures** with remaining seats. Stays and cars book by date + nights/days. Guest checkout is off — bookings and contact messages require a signed-in user.
3. **CMS:** Postgres catalog + thin operator desk later. **Not** headless WordPress. Do not reconnect `wp-config.php` from the dump.
4. **IA on day one:** Journeys (tours), Places (destinations), Stays, Cars, Search, Contact, My trips.
5. **Languages:** English and Vietnamese in the chrome and catalog fields (`*_en` / `*_vn`). Locale is a client preference, not a URL prefix in v1.
6. **Tone:** editorial atlas, not a 2013 booking portal. Nature / Coast / UNESCO are the three journey chapters inherited from the old site’s mental model, not from ThemeForest gold skins.

## Stack that is actually running

The preview environment is **not Next.js App Router**. The shipped app is:

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Router / SSR | TanStack Start + TanStack Router (file routes under `src/routes/`) |
| Bundler | Vite 7+ |
| Styles | Tailwind CSS v4, tokens in `src/styles.css` `@theme` |
| Auth | Better Auth (Google + X). Email/password stays off. |
| Data | Postgres (Neon when deployed, PGLite in the sandbox preview) |
| Validation | Zod on booking and contact writes |
| i18n | `LocaleProvider` in `src/lib/locale.tsx` — not `next-intl` |

If a later phase moves this onto Next.js, keep the same IA, schema, tokens, and booking rules. Do not introduce a second visual language or a second catalog.

## Visual system

Tokens live in `src/styles.css`. Compose from them.

- Paper `#f3eee4`, ink `#1c1914`, muted `#6f6a62`, accent teal `#1f6f6d`
- Display: Fraunces. Body: IBM Plex Sans
- One accent. No gold, no purple, no Inter-as-brand, no gradient-blob heroes
- Touch targets ≥ 44px. Mobile 390px is a first-class layout
- Icons: Lucide. No emoji in chrome

## Data rules

- Catalog tables (`destinations`, `tours`, `tour_departures`, `stays`, `cars`) are **public / unowned**.
- `bookings` and `contact_messages` carry `user_id text not null`. Every read and write is scoped to the verified session user on the server. Never trust a client-sent user id.
- Tour capacity = `max_people - sum(confirmed guests on that departure)`.
- Prices in the seed and UI are AUD. Do not display VND as the selling currency.
- Migrations are ordered SQL: `0001_auth.sql` (Better Auth), `0002_catalog.sql`, `0003_seed.sql`. Do not edit an already-applied file; add `0004_*.sql`.

## Routes that exist today

```
/                     home — chapters + featured journeys
/tours                chapter filter: nature | beach | unesco
/tours/$slug          itinerary + departure booking
/destinations         place index
/destinations/$slug   place + journeys from that place
/stays  /stays/$slug
/cars   /cars/$slug
/search?q=
/contact              signed-in message to the desk
/login                Google / X
/account              My trips
/api/auth/$           Better Auth handler
```

## What not to do

- Do not push the WordPress dump, `wp-config.php`, or the live DB password into this repo.
- Do not revive BookYourTravel vacancy tables as the source of truth.
- Do not add a second CMS (Sanity, WP REST) beside Postgres unless the product decision changes in writing.
- Do not hide “Created with Grok” chrome in the sandbox preview — that is a platform setting, not an app change.
- Do not commit `.env`. Keep secrets in Neon / the host.

## Working on this repo

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run media        # optional
npm run dev          # Vite on :3000
npm run typecheck
npm run build
```

Standalone checkout needs `DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and Google / X OAuth credentials for live sign-in.
