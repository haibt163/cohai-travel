# CoHai Travel — project status

Last updated: 11 September 2026.

## Executive status

The engineering baseline, full-site visual modernization, and repository synchronization checkpoint are green. P1 includes crawlable bilingual routing, locale-aware metadata, operational visibility for allowlisted staff and a provider-neutral notification contract. P2 source archaeology is now executed through a reproducible CI audit, with migration dispositions, legacy URL mapping, seed reconciliation and a fidelity report recorded as explicit artifacts. Historical content parity is still not claimed.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟢 | GitHub `main` remains source of record; sync the latest P2 commits locally at the next checkpoint. |
| P0.2 Preview/repo parity | 🟢 | Retain fresh CI/runtime evidence on subsequent changes; `npm run dev` remains USER-REPORTED working locally. |
| P0.3 Atomic tour booking | 🟢 | Preserve DB-backed transaction/locking semantics. |
| P0.4 Stay/car finite inventory | 🟢 | Keep one-unit booking semantics until multi-unit UX is explicitly required. |
| P0.5 CI | 🟢 | Latest full gate is VERIFIED by GitHub Actions on commit `4bae9dadfbe338ab8b38214ca1e4ba50e626fe29` (run #163). |
| P1.6 EN/VN URL architecture | 🟢 | Locale-prefixed application routes are canonical. |
| P1.7 Locale-aware metadata | 🟢 | Titles/descriptions use locale-specific copy on public routes. |
| P1.8 Sitemap/robots | 🟢 | Locale-aware SEO endpoints remain under TanStack Start. |
| P1.9 Images | 🟡 | Verify provenance/licensing of final customer-facing assets. |
| P1.10 Booking tests | 🟡 | Add a real DB-backed concurrency/integration harness when production DB test infrastructure is available. |
| P1.11 Booking state | 🟢 | Current confirmed/cancelled model remains locked. |
| P1.12 Public contact | 🟢 | Public endpoint with anti-spam/rate-limit protections. |
| P1 operations/admin | 🟢 | Allowlisted users get an operator desk section in My trips; extend to dedicated workflow only when needed. |
| P1 notifications | 🟡 | Contract documented; provider credentials, delivery worker and monitoring remain to be configured. |
| P2.14 Full dump parse | 🟢 | Reproducible audit and sanitized source inventory are generated from the frozen legacy dump in CI. |
| P2.15 Migration matrix | 🟢 | Row-level working dispositions are recorded; final editorial/source review remains before publication. |
| P2.16 Legacy URL mapping | 🟢 | Identified location/tour/hotel mappings are recorded; implement/verify redirects only after canonical targets exist. |
| P2.17 Seed reconciliation | 🟢 | Current synthetic seed is explicitly classified against source evidence; next step is source-backed canonical catalog reconstruction. |
| P2.18 Fidelity report | 🟡 | Report is created; resolve remaining media, content, URL, schedule and synthetic-product gaps before claiming parity. |

## Current verified checkpoint — 11 September 2026

- Clean application checkpoint before P2 writes: local `main` and GitHub `origin/main` resolved to `882979e892fd66875d00f0756e4581634e5de20f0`; local working tree was clean after safely restoring a false-positive `src/routeTree.gen.ts` modification.
- GitHub Actions CI run #163 on commit `4bae9dadfbe338ab8b38214ca1e4ba50e626fe29` passed `npm ci`, domain tests, typecheck, lint, build and production smoke — **VERIFIED**.
- The frozen source `haibt163/travel:data_vietaustravel` was audited into a sanitized inventory: 30 tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules, 47 currency rows, and 76 domain-relevant published records. Raw booking/customer records are not exported.
- `docs/P2_MIGRATION_MATRIX.md` covers the 76 domain-relevant source records with working dispositions: 47 rewrite, 4 merge, 13 archive, 12 discard, 0 direct migrate.
- `docs/P2_LEGACY_URL_MAP.md` records the identified legacy location/tour/hotel mappings and leaves unverified route families without invented redirects.
- `docs/P2_SEED_RECONCILIATION.md` distinguishes source-backed/rewrite/replacement candidates from synthetic records; the existing 10-destination/9-tour/6-stay/4-car/23-departure seed is not described as migrated content.
- `docs/P2_FIDELITY_REPORT.md` records the current gaps: final factual/editorial rewrites, media provenance/licensing, remaining URL verification, four source schedule reconciliation, synthetic-product decisions and destination normalization.
- The latest GitHub commits contain P2 documentation/tooling changes after the user's earlier local checkpoint; the user's local checkout is therefore behind until the next sync.
- `npm run dev` works locally — **USER-REPORTED**, not assistant-verified.

## Engineering execution rule

Use the workflow contract in `docs/AI_ENGINEERING_WORKFLOW.md`. Inspect actual code/error first; make the smallest safe change; execute validation; inspect the actual result; then stop once the expected state is verified. Diagnose only until the evidence is sufficient to choose a safe intervention. Avoid repeated diagnostic loops once the evidence is sufficient; do not keep requesting marginal diagnostics or generate speculative patches. Never present predicted behavior as a passing build, lint, test, deployment, or integration result.

## Product boundaries

The current catalog seed remains synthetic until accepted P2 source reconstruction is implemented. Legacy credentials and historical customer PII must never be copied into the public application or migration fixtures.

The current stay/car product consumes one inventory unit per booking. The legacy `room_count` evidence is retained for migration mapping but is not represented as unsupported multi-room guest behavior.

## Ordered execution

### P1 — production foundation

Bilingual canonical routes and metadata are implemented. Operator visibility is now available to an explicit allowlist via `COHAI_OPERATOR_USER_IDS`. Notification behavior is specified but intentionally not faked without a production provider. Media provenance remains the principal P1 content-quality item.

### P2 — WordPress reconstruction

P2 source archaeology and traceability foundation are complete: the frozen dump is parsed into a sanitized inventory, each domain-relevant published source record has a working disposition, identified legacy URLs have a mapping ledger, the current synthetic seed has been reconciled against source evidence, and the fidelity gap report is documented. The next implementation step is source-backed canonical catalog reconstruction, beginning with destinations and tours, then stays/cars, then departures, with media and URL redirects verified alongside each accepted record.

The WordPress repository remains source material only, not runtime CMS.
