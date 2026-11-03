# Cô Hai Travel

Private journeys in Vietnam, Cambodia and Thailand. Booked in Australian dollars, with live seats.

This repository is the source of record for the **React rebuild** of the old VietAus WordPress site. The WordPress dump stays at `haibt163/travel` and is not the runtime.

## Engineering governance

Roles, review and merge rules are defined in `docs/ENGINEERING_GOVERNANCE.md`.

## Project documentation

1. `AGENTS.md` — universal agent contract.
2. `AGENTS.project.md` — project-specific identity, boundaries and verification rules.
3. `OriginalWordPress.md` — legacy archive findings and reconstruction boundary.
4. `ProjectStatus.md` — active audit/implementation ledger.
5. `docs/README_STATUS.md` — index of the current project documents.
6. `docs/ENGINEERING_GOVERNANCE.md` — AI engineering roles and approval boundary.
7. `docs/AI_ENGINEERING_WORKFLOW.md` — implementation, audit, evidence and handoff workflow.
8. `docs/CONTENT_ARCHAEOLOGY.md` — source-derived migration model and fidelity rules.
9. `docs/REPO_PREVIEW_PARITY.md` — current repository ↔ preview reproducibility audit.
10. `docs/P2_MIGRATION_EXECUTION.md` — legacy extraction, decision matrix and URL/media reconciliation workflow.
11. `docs/P1_NOTIFICATIONS.md` — production notification contract.

`docs/PARITY_AUDIT.md` is a superseded 9 September 2026 snapshot retained as historical evidence.

## Current status

`main` @ `1556e31` is green in GitHub Actions run #319. The displayed brand is **Cô Hai Travel**; production SEO is fixed to `https://cohaitravel.com`; the localized sitemap, preview-disallowing robots behavior and Google Search Console verification file are merged. Booking allocation remains transactional, stays/cars use finite date-aware inventory, contact is intentionally public with anti-spam/rate limiting, and bilingual canonical routing/metadata are implemented.

Still open: browser confirmation of the live Vercel preview, Google Search Console property verification, confirmation of the Owner's Vercel environment variables, optional notification-provider delivery, and the remaining P2 content/media/URL/departure work. Repository CI does not prove any of the live-environment items. The synthetic seed must not be represented as completed migration content.

## Standalone checkout

```bash
cp .env.example .env
# fill DATABASE_URL (Neon/Postgres), BETTER_AUTH_SECRET and BETTER_AUTH_URL
# set GROK_AUTH_ISSUER / GROK_AUTH_CLIENT_ID / GROK_AUTH_CLIENT_SECRET for broker sign-in
# optionally set COHAI_OPERATOR_USER_IDS to comma-separated Better Auth user ids

npm ci
npm run dev
```

`npm run dev` applies pending migrations before starting Vite. Without `DATABASE_URL` the app uses its in-process PGlite fallback and does not persist data. Google and X sign-in go through the Grok auth broker, not directly to Google or X; see `.env.example`.

## Product model

Guests browse three chapters (Nature, Coast, UNESCO), open a journey, pick a dated departure with remaining seats, and book it under a signed-in account. Stays and cars book by date. Chrome is English / Vietnamese. Prices are AUD. The catalog lives in Postgres, not in WordPress.

## Legacy migration

The frozen WordPress source contains both genuine historical content and generic/demo material. The committed migration audit tool is intentionally aggregate-first and does not export historical customer PII. Use it to build the source inventory before deciding what is migrated, rewritten, merged, archived or discarded.

## Stack

React 19 · TanStack Start · Vite · Tailwind v4 · Better Auth · Postgres (Neon).
