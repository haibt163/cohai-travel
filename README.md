# CoHai Travel

Private journeys in Vietnam, Cambodia and Thailand. Booked in Australian dollars, with live seats.

This repository is the source of record for the **React rebuild** of the old VietAus WordPress site. The WordPress dump stays at `haibt163/travel` and is not the runtime.

## Project documentation

1. `AGENTS.md` — App Builder/platform contract; keep this intact unless the platform contract itself changes.
2. `OriginalWordPress.md` — legacy archive findings and deliberate reconstruction boundaries.
3. `ProjectStatus.md` — active audit/implementation ledger and outstanding work.
4. `docs/CONTENT_ARCHAEOLOGY.md` — source-derived migration model and fidelity rules.

## Current status

The core booking safety work is implemented: tour departure allocation is transactional, and stays/cars use finite inventory with date-overlap checks. Contact is intentionally public with basic anti-spam/rate limiting. SEO foundations and CI have also been added.

**The project is not yet production-ready.** The immediate blocker is a failing TypeScript check. Dependency installation and the current four domain booking tests pass, but typecheck fails in the sitemap/robots runtime files, several missing script/type imports, and route metadata field usage. Lint, build and production smoke tests therefore have not yet run successfully on the latest commit.

The major remaining product/engineering tracks are:

- make CI fully green and complete the repository-vs-preview parity audit;
- normalize the dependency lockfile/peer-resolution setup;
- strengthen real booking concurrency/integration tests;
- complete multi-room/multi-unit stay semantics if the product requires them;
- implement crawlable URL-based English/Vietnamese architecture with locale-aware metadata, canonical and hreflang;
- make sitemap/robots runtime-correct and locale-aware;
- add operator administration and production notifications;
- complete the WordPress content archaeology and migration/fidelity matrix;
- replace provisional imagery with licensed/authoritative photography;
- add payments/true holds only after the inventory and booking model is stable.

See `ProjectStatus.md` for the authoritative sequence and status of each item.

## Standalone checkout

```bash
cp .env.example .env
# fill DATABASE_URL (Neon), BETTER_AUTH_SECRET, BETTER_AUTH_URL
# add Google / X client ids when you want live sign-in

npm install
npm run db:migrate
npm run media          # optional media fetch
npm run dev            # http://localhost:3000
```

## v1 product model

Guests browse three chapters (Nature, Coast, UNESCO), open a journey, pick a dated departure with remaining seats, and book it under a signed-in account. Stays and cars book by date. Chrome is English / Vietnamese. Prices are AUD. The catalog lives in Postgres, not in WordPress.

## Stack

React 19 · TanStack Start · Vite · Tailwind v4 · Better Auth · Postgres (Neon).

The playable preview was built in the Grok App Builder sandbox, which is why this is TanStack Start rather than Next.js App Router. The GitHub repository is now treated as the source of record; the preview must not become a hidden second implementation.
