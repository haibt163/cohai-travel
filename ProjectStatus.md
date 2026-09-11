# CoHai Travel — project status

Last updated: 11 September 2026.

## Executive status

The engineering baseline, full-site visual modernization, and repository synchronization checkpoint are green. P1 includes crawlable bilingual routing, locale-aware metadata, operational visibility for allowlisted staff and a provider-neutral notification contract. P2 source archaeology is now executed through a reproducible CI audit, with migration dispositions, legacy URL mapping, seed reconciliation and a fidelity report recorded as explicit artifacts. Historical content parity is still not claimed.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟢 | GitHub `main` remains source of record; pull the latest P2 commits locally at the next checkpoint. |
| P0.2 Preview/repo parity | 🟢 | Retain fresh CI/runtime evidence on subsequent changes; `npm run dev` remains USER-REPORTED working locally. |
| P0.3 Atomic tour booking | 🟢 | Preserve DB-backed transaction/locking semantics. |
| P0.4 Stay/car finite inventory | 🟢 | Keep one-unit booking semantics until multi-unit UX is explicitly required. |
| P0.5 CI | 🟢 | Latest full gate passed on the prior stable P2 mapping commit; require fresh CI after subsequent commits. |
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
| P2.17 Seed reconciliation | 🟢 | Current synthetic seed is explicitly classified against source evidence; next step is approved source-backed catalog reconstruction. |
| P2.18 Fidelity report | 🟡 | Report is created; resolve remaining media, content, URL, schedule and synthetic-product gaps before claiming parity. |

## Current verified checkpoint — 11 September 2026

- Latest clean application checkpoint before P2 writes: local `main` and GitHub `origin/main` resolved to `882979e892fd66875d00f0756e4581634e5de20f` and the local working tree was clean after safely restoring a false-positive `src/routeTree.gen.ts` modification.
- GitHub Actions CI run #159 on commit `84d89e329c4a006df582a6cc68a4692a04f4c1a1` passed domain tests, typecheck, lint, build and production smoke — **VERIFIED by GitHub Actions**.
- The P2 source-audit workflow produced a sanitized source inventory from `haibt163/travel:data_vietaustravel`. It reports 30 tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules and 47 currency rows; the domain-relevant published set is 76 records. Raw booking/customer records are not exported.
- `docs/P2_MIGRATION_MATRIX.md`, `docs/P2_LEGACY_URL_MAP.md`, `docs/P2_SEED_RECONCILIATION.md`, and `docs/P2_FIDELITY_REPORT.md` are now committed as the working P2 traceability artifacts.
- The latest P2 documentation/code commits have advanced GitHub `main` beyond the prior local checkpoint; the user's local checkout is therefore expected to be behind until the next explicit sync.
- `npm run dev` works locally — **USER-REPORTED**, not assistant-verified.
- `npm run test:domain`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:smoke` are **VERIFIED** for the latest stable CI commit #159 before the subsequent P2 documentation-only commits. Fresh CI is required to close the current checkpoint.

## Engineering execution rule

Use the workflow contract in `docs/AI_ENGINEERING_WORKFLOW.md`. In particular: inspect actual code/error first; make the smallest safe change; execute validation; inspect the actual result; then stop once the expected state is verified. Diagnose only until the evidence is sufficient to choose a safe intervention. Avoid repeated diagnostic loops once the evidence is sufficient; do not keep requesting marginal diagnostics or generate speculative patches. Never present predicted behavior as a passing build, lint, test, deployment, or integration result.

## Product boundaries

The current catalog seed remains synthetic until accepted P2 source reconstruction is implemented. Legacy credentials and historical customer PII must never be copied into the public application or migration fixtures.

The current stay/car product consumes one inventory unit per booking. The legacy `room_count` evidence is retained for migration mapping but is not represented as unsupported multi-room guest behavior.

## Ordered execution

### P1 — production foundation

Bilingual canonical routes and metadata are implemented. Operator visibility is now available to an explicit allowlist via `COHAI_OPERATOR_USER_IDS`. Notification behavior is specified but intentionally not faked without a production provider. Media provenance remains the principal P1 content-quality item.

### P2 — WordPress reconstruction

P2 source archaeology is complete enough to support implementation planning: the frozen dump is parsed into a sanitized inventory, each domain-relevant published source record has a working disposition, identified legacy URLs have a mapping ledger, the current synthetic seed has been reconciled against source evidence, and the fidelity gap report is documented. The next implementation step is source-backed canonical catalog reconstruction, beginning with destinations and tours, then stays/cars, then departures, with media and URL redirects verified alongside each accepted record.

The WordPress repository remains source material only, not runtime CMS.
