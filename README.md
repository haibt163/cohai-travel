# CoHai Travel

Private journeys in Vietnam, Cambodia and Thailand. Booked in Australian dollars, with live seats.

This repository is the source of record for the **React rebuild** of the old VietAus WordPress site. The WordPress dump stays at `haibt163/travel` and is not the runtime.

## Project documentation

1. `AGENTS.md` — App Builder/platform contract.
2. `OriginalWordPress.md` — legacy archive findings and reconstruction boundary.
3. `ProjectStatus.md` — active audit/implementation ledger.
4. `docs/CONTENT_ARCHAEOLOGY.md` — source-derived migration model and fidelity rules.
5. `docs/PARITY_AUDIT.md` — repository ↔ preview reproducibility audit.
6. `docs/P2_MIGRATION_EXECUTION.md` — concrete legacy extraction, decision matrix and URL/media reconciliation workflow.
7. `docs/P1_NOTIFICATIONS.md` — production notification contract.

## Current status

The engineering baseline is green and the full-site visual modernization is now part of `main`. Booking allocation remains transactional, stays/cars use finite date-aware inventory, contact is intentionally public with anti-spam/rate limiting, and bilingual canonical routing/metadata are implemented.

The remaining production/content work is operational configuration and legacy reconstruction: notification provider delivery, final media provenance, the authoritative WordPress dump inventory, row-level migration decisions, legacy URL mapping, seed reconciliation and the final fidelity report. The synthetic seed must not be represented as completed migration content.

## Standalone checkout

```bash
cp .env.example .env
# fill DATABASE_URL (Neon), BETTER_AUTH_SECRET, BETTER_AUTH_URL
# add Google / X client ids when you want live sign-in
# optionally set COHAI_OPERATOR_USER_IDS to comma-separated Better Auth user ids

npm ci
npm run db:migrate
npm run dev
```

## Product model

Guests browse three chapters (Nature, Coast, UNESCO), open a journey, pick a dated departure with remaining seats, and book it under a signed-in account. Stays and cars book by date. Chrome is English / Vietnamese. Prices are AUD. The catalog lives in Postgres, not in WordPress.

## Legacy migration

The frozen WordPress source contains both genuine historical content and generic/demo material. The committed migration audit tool is intentionally aggregate-first and does not export historical customer PII. Use it to build the source inventory before deciding what is migrated, rewritten, merged, archived or discarded.

## Stack

React 19 · TanStack Start · Vite · Tailwind v4 · Better Auth · Postgres (Neon).
