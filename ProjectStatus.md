# CoHai Travel — project status

Last updated: 10 September 2026.

## Executive status

The engineering baseline and full-site visual modernization are green. P1 now includes crawlable bilingual routing, locale-aware metadata, operational visibility for allowlisted staff and a provider-neutral notification contract. P2 migration tooling and source-fidelity rules are in place, but the legacy dump still requires the actual extraction, record decisions, URL map, seed reconciliation and final fidelity review before content parity can be claimed.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟢 | Keep the clean GitHub checkout as source of record. |
| P0.2 Preview/repo parity | 🟢 | Retain fresh CI/runtime evidence on subsequent changes. |
| P0.3 Atomic tour booking | 🟢 | Preserve DB-backed transaction/locking semantics. |
| P0.4 Stay/car finite inventory | 🟢 | Keep one-unit booking semantics until multi-unit UX is explicitly required. |
| P0.5 CI | 🟢 | Required gate remains npm ci → domain tests → typecheck → lint → build → smoke. |
| P1.6 EN/VN URL architecture | 🟢 | Locale-prefixed application routes are canonical. |
| P1.7 Locale-aware metadata | 🟢 | Titles/descriptions now use locale-specific copy on public routes. |
| P1.8 Sitemap/robots | 🟢 | Locale-aware SEO endpoints remain under TanStack Start. |
| P1.9 Images | 🟡 | Verify provenance/licensing of final customer-facing assets. |
| P1.10 Booking tests | 🟡 | Add a real DB-backed concurrency/integration harness when production DB test infrastructure is available. |
| P1.11 Booking state | 🟢 | Current confirmed/cancelled model remains locked. |
| P1.12 Public contact | 🟢 | Public endpoint with anti-spam/rate-limit protections. |
| P1 operations/admin | 🟢 | Allowlisted users get an operator desk section in My trips; extend to dedicated workflow only when needed. |
| P1 notifications | 🟡 | Contract documented; provider credentials, delivery worker and monitoring remain to be configured. |
| P2.14 Full dump parse | 🟡 | Audit/parser tooling is committed; run against the frozen legacy dump for the authoritative inventory. |
| P2.15 Migration matrix | 🟡 | Decision template/rules are committed; complete row-level dispositions from extracted source inventory. |
| P2.16 Legacy URL mapping | 🟡 | Map important legacy paths to canonical replacements or explicit retirement decisions. |
| P2.17 Seed reconciliation | 🟡 | Compare current synthetic seed against source-backed legacy records. |
| P2.18 Fidelity report | 🟡 | Produce preservation/rewrite/merge/archive/discard counts and unresolved gaps. |

## Product boundaries

The current catalog seed remains synthetic until P2 is completed. Legacy credentials and historical customer PII must never be copied into the public application or migration fixtures.

The current stay/car product consumes one inventory unit per booking. The legacy `room_count` evidence is retained for migration mapping but is not represented as unsupported multi-room guest behavior.

## Ordered execution

### P1 — production foundation

Bilingual canonical routes and metadata are implemented. Operator visibility is now available to an explicit allowlist via `COHAI_OPERATOR_USER_IDS`. Notification behavior is specified but intentionally not faked without a production provider. Media provenance remains the principal P1 content-quality item.

### P2 — WordPress reconstruction

Use `scripts/audit-legacy-dump.mjs` to generate a machine-readable source inventory. Then complete `docs/P2_MIGRATION_EXECUTION.md`, the legacy URL map, source-backed seed reconciliation and the fidelity report. The WordPress repository remains source material only, not runtime CMS.
