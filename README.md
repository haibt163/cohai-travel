# CoHai Travel

Private journeys in Vietnam, Cambodia and Thailand. Booked in Australian dollars, with live seats.

This repository is the source of record for the **React rebuild** of the old VietAus WordPress site. The WordPress dump stays at `haibt163/travel` and is not the runtime.

## Project documentation

1. `AGENTS.md` — App Builder/platform contract.
2. `OriginalWordPress.md` — legacy archive findings and reconstruction boundary.
3. `ProjectStatus.md` — active audit/implementation ledger.
4. `docs/CONTENT_ARCHAEOLOGY.md` — source-derived migration model and fidelity rules.
5. `docs/PARITY_AUDIT.md` — repository ↔ preview reproducibility audit.

## Current status

The core booking safety work is implemented: tour departure allocation is transactional, and stays/cars use finite inventory with date-overlap checks. Contact is intentionally public with basic anti-spam/rate limiting. SEO foundations and CI have also been added.

**The project is not yet production-ready.** The immediate gate is a fully green CI run. Dependency installation and the current domain booking tests pass; remaining failures have been in TypeScript/runtime-source parity and must be cleared before the build and smoke stages can certify the repository.

The major remaining tracks are tracked in `ProjectStatus.md`, with P0 engineering baseline before the P1 bilingual SEO/operations work and P2 WordPress reconstruction.

## Standalone checkout

```bash
cp .env.example .env
# fill DATABASE_URL (Neon), BETTER_AUTH_SECRET, BETTER_AUTH_URL
# add Google / X client ids when you want live sign-in

npm ci
npm run db:migrate
npm run dev
```

## Product model

Guests browse three chapters (Nature, Coast, UNESCO), open a journey, pick a dated departure with remaining seats, and book it under a signed-in account. Stays and cars book by date. Chrome is English / Vietnamese. Prices are AUD. The catalog lives in Postgres, not in WordPress.

## Stack

React 19 · TanStack Start · Vite · Tailwind v4 · Better Auth · Postgres (Neon).

The playable preview was built in the Grok App Builder sandbox, which is why this is TanStack Start rather than Next.js App Router. The GitHub repository is the source of record; the preview must not become a hidden second implementation.
