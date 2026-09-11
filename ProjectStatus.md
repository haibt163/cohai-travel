# CoHai Travel — project status

Last updated: 11 September 2026.

## Executive status

The engineering baseline, full-site visual modernization, and repository synchronization checkpoint are green. P1 includes crawlable bilingual routing, locale-aware metadata, operational visibility for allowlisted staff and a provider-neutral notification contract. P2 is now explicitly **Legacy Product Archaeology & Modern Reconstruction**: the 15+ year-old WordPress project is treated as a historical product/content source, not a customer-data migration target.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟢 | GitHub `main` remains source of record; keep local checkout synchronized at implementation checkpoints. |
| P0.2 Preview/repo parity | 🟢 | Local `npm run dev` has now been successfully exercised after the runtime migration fix; retain fresh evidence at future checkpoints. |
| P0.3 Atomic tour booking | 🟢 | Preserve DB-backed transaction/locking semantics. |
| P0.4 Stay/car finite inventory | 🟢 | Keep current finite-inventory model until a broader UX requirement is explicit. |
| P0.5 CI | 🟢 | Latest full gate is VERIFIED by GitHub Actions on commit `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` (run #251). |
| P0.6 Runtime migration bootstrap | 🟢 | Existing populated databases are adopted without reseeding; bundled migrations run deterministically and schema verification is enforced. |
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
| P2.22 2026 destination fact refresh | 🟢 | First source-backed destination and journey fact refresh is implemented with a current source ledger. |

## Current verified checkpoint — 11 September 2026

- GitHub Actions run #251 on commit `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` passed `npm ci`, domain tests, typecheck, lint, build and production smoke — **VERIFIED**.
- The local Windows checkout pulled `main` successfully to `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` and then started `npm run dev` successfully.
- The local runtime log shows the database bootstrap adopting existing catalog data instead of replaying the seed, then applying migrations `0004_inventory`, `0005_booking_status`, `0005_public_contact`, `0006_provenance`, `0007_fact_checked_destinations`, `0008_fact_checked_coastal_destinations`, `0009_fact_checked_source_backed_journeys` and `0010_repair_provenance_schema` successfully.
- The user confirmed the previously blocking `column t.provenance_state does not exist` failure is now resolved in the local application.
- The runtime incident was caused by migration/bootstrap behavior, not user database edits. No manual SQL or database deletion was required.
- The final local startup still emits the PostgreSQL `sslmode` deprecation/security warning; this is separate from the migration/schema failure and is not currently treated as the blocking runtime defect.
- The frozen legacy source audit produced 30 tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules, 47 currency rows and 76 domain-relevant published records. Raw customer booking records are not exported.
- The owner has clarified that the old WordPress project was a template-based project built more than 15 years ago around their own travel ideas, not a live customer-data system. Many destination, tour and travel-information subjects remain broadly relevant and should be treated as valuable source material rather than obsolete by default.
- Legacy media is a migration candidate: preserve/inspect/verify/optimize first, replace only when quality, licensing, factual relevance or visual needs justify replacement.

## Evidence rule for completion claims

A change is called **fixed** only after the relevant execution evidence exists. Code review or model confidence is insufficient. For an interactive defect, the evidence must include the relevant runtime/test result and, where the assistant cannot directly access the user's machine, the user's observed confirmation. Use `VERIFIED`, `UNVERIFIED`, or `FAILED` explicitly.

## Engineering execution rule

Use `docs/AI_ENGINEERING_WORKFLOW.md`. Inspect actual code/error first; make the smallest safe change; execute validation; inspect the actual result; then stop once verified. Diagnose only until evidence is sufficient. Do not enter redundant diagnostic loops or present predicted behavior as a passing build, lint, test, deployment or integration result.

## Product boundaries

The legacy WordPress tree is source material, not runtime CMS. Historical customer PII, passwords, secrets, credentials and auth tokens never enter the rebuild. Old commercial values remain historical until revalidated.

## Ordered execution

### P1 — production foundation

Bilingual canonical routes and metadata are implemented. Operator visibility is available to an explicit allowlist via `COHAI_OPERATOR_USER_IDS`. Notification behavior is specified but intentionally not faked without a production provider.

### P2 — Legacy Product Archaeology & Modern Reconstruction

The archaeology and traceability foundation is complete, and the local runtime migration/bootstrap incident is now closed. Connected destination hubs, provenance controls, canonical publication planning and the first fact-checked destination/journey refresh are implemented and verified. Next: continue source-backed canonical reconstruction, build travel-information surfaces, selectively verify stays/cars, reconcile departures, migrate useful legacy media, and implement verified legacy redirects. Every future fix must meet the explicit evidence rule above before being described as fixed.
