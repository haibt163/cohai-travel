# CoHai Travel — project status

Last updated: 11 September 2026.

## Executive status

The engineering baseline, full-site visual modernization, and repository synchronization checkpoint are green. P1 includes crawlable bilingual routing, locale-aware metadata, operational visibility for allowlisted staff and a provider-neutral notification contract. P2 is now explicitly **Legacy Product Archaeology & Modern Reconstruction**: the 15+ year-old WordPress project is treated as a historical product/content source, not a customer-data migration target.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟢 | GitHub `main` remains source of record; sync the latest P2 commits locally at the next local checkpoint. |
| P0.2 Preview/repo parity | 🟢 | Retain fresh CI/runtime evidence; `npm run dev` remains USER-REPORTED working locally. |
| P0.3 Atomic tour booking | 🟢 | Preserve DB-backed transaction/locking semantics. |
| P0.4 Stay/car finite inventory | 🟢 | Keep one-unit booking semantics until multi-unit UX is explicitly required. |
| P0.5 CI | 🟢 | Latest full gate is VERIFIED by GitHub Actions on commit `ff436a1d79d70b43c4f477c304413684acdee87d` (run #215). |
| P1.6 EN/VN URL architecture | 🟢 | Locale-prefixed application routes are canonical. |
| P1.7 Locale-aware metadata | 🟢 | Titles/descriptions use locale-specific copy on public routes. |
| P1.8 Sitemap/robots | 🟢 | Locale-aware SEO endpoints remain under TanStack Start. |
| P1.9 Images | 🟡 | Verify final asset provenance/licensing; legacy media may now be migrated when useful. |
| P1.10 Booking tests | 🟡 | Add real DB-backed concurrency/integration harness when production DB test infrastructure is available. |
| P1.11 Booking state | 🟢 | Current confirmed/cancelled model remains locked. |
| P1.12 Public contact | 🟢 | Public endpoint with anti-spam/rate-limit protections. |
| P1 operations/admin | 🟢 | Allowlisted users get an operator desk section in My trips, including current P2 provenance coverage. |
| P1 notifications | 🟡 | Contract documented; provider credentials, delivery worker and monitoring remain to be configured. |
| P2.14 Legacy product archaeology | 🟢 | Original product/business/UX intent is documented in `docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md`. |
| P2.15 Source migration matrix | 🟢 | Working record dispositions remain traceability tools; accepted records can move to `migrate` after publication gates. |
| P2.16 Legacy URL mapping | 🟢 | Preserve valuable legacy paths through verified canonical replacements. |
| P2.17 Seed reconciliation | 🟢 | Use source-backed subjects to reconstruct the modern catalog; retain intentional modern additions separately. |
| P2.18 Fidelity report | 🟡 | Close factual, editorial, media, URL, schedule and source-coverage gaps during reconstruction. |
| P2.19 Connected destination hub | 🟢 | Destination-scoped journeys/stays/cars and cross-navigation are implemented and full CI verified. |
| P2.20 Provenance guard | 🟢 | Canonical provenance schema, regression coverage and operator-only reconstruction metrics are implemented and full CI verified. |
| P2.21 Canonical record plan | 🟢 | Publication-gate checklist and current destination/journey reconstruction set are documented in `docs/P2_CANONICAL_RECORD_PLAN.md`. |

## Current verified checkpoint — 11 September 2026

- Before P2 writes, local `main` and GitHub `origin/main` matched at `882979e892fd66875d00f0756e4581634e5de20f` and the local working tree was clean after safely resolving the false-positive `src/routeTree.gen.ts` modification.
- GitHub Actions run #215 passed `npm ci`, domain tests, typecheck, lint, build and production smoke — **VERIFIED**.
- The frozen legacy source audit produced 30 tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules, 47 currency rows and 76 domain-relevant published records. Raw customer booking records are not exported.
- The owner has clarified that the old WordPress project was a template-based project built more than 15 years ago around their own travel ideas, not a live customer-data system. Many destination, tour and travel-information subjects remain broadly relevant and should be treated as valuable source material rather than obsolete by default.
- Legacy media is now a migration candidate: preserve/inspect/verify/optimize first, replace only when quality, licensing, factual relevance or visual needs justify replacement.
- `docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md` defines the surviving 2026 product requirements. `docs/P2_CANONICAL_RECONSTRUCTION.md` records the implementation ledger, and `docs/P2_CANONICAL_RECORD_PLAN.md` now records the controlled destination/journey publication plan.
- The provenance layer distinguishes `source-backed`, `modern-addition` and `synthetic-pending`; its mappings are regression-tested and current coverage is visible only to allowlisted operators.
- `npm run dev` works locally — **USER-REPORTED**, not assistant-verified.
- The latest P2 commits update the repository after the earlier local checkpoint; the user should pull once before the next local development checkpoint.

## Engineering execution rule

Use `docs/AI_ENGINEERING_WORKFLOW.md`. Inspect actual code/error first; make the smallest safe change; execute validation; inspect the actual result; then stop once verified. Diagnose only until evidence is sufficient. Do not enter redundant diagnostic loops or present predicted behavior as a passing build, lint, test, deployment or integration result.

## Product boundaries

The legacy WordPress tree is source material, not runtime CMS. Historical customer PII, passwords, secrets, credentials and auth tokens never enter the rebuild. Old commercial values remain historical until revalidated.

## Ordered execution

### P1 — production foundation

Bilingual canonical routes and metadata are implemented. Operator visibility is available to an explicit allowlist via `COHAI_OPERATOR_USER_IDS`. Notification behavior is specified but intentionally not faked without a production provider.

### P2 — Legacy Product Archaeology & Modern Reconstruction

The archaeology and traceability foundation is complete. Connected destination hubs, provenance controls and a canonical record publication plan are now implemented and verified. Next: reconstruct and fact-check the accepted canonical destination/journey records, then build travel-information surfaces, selectively verify stays/cars, reconcile departures, migrate useful legacy media, and implement verified legacy redirects. The goal is to preserve the strong ideas from the original project while modernizing technology, UX, facts, availability and operations for 2026.
