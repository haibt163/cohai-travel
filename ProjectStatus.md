# CoHai Travel — project status

Last updated: 9 September 2026.

## Executive status

The rebuild is in active engineering-hardening and reconstruction. Core booking atomicity and finite inventory are implemented. Public contact is intentional. SEO foundations exist. CI dependency installation and domain tests have passed historically, but the full CI gate remains open until a fresh commit passes typecheck, lint, build and production smoke.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟡 | Finish source/ignore parity and remove temporary npm peer workaround after lockfile normalization. |
| P0.2 Preview/repo parity | 🟡 | Fresh green CI + production smoke from GitHub checkout. |
| P0.3 Atomic tour booking | 🟢 | Protect with DB-backed concurrency tests. |
| P0.4 Stay/car finite inventory | 🟡 | Current product is one inventory unit per booking; only add quantity UI if multi-unit booking is explicitly required. |
| P0.5 CI | 🟡 | Clear source/type issues and obtain full green chain. |
| P1.6 EN/VN URL architecture | 🔴 | Implement crawlable locale-prefixed routes without duplicating the app. |
| P1.7 Locale-aware metadata | 🟡 | Extend SEO helper for canonical/hreflang after locale routing. |
| P1.8 Sitemap/robots | 🟡 | Finish TanStack server routes and include locale variants after routing. |
| P1.9 Images | 🟡 | Replace provisional media with licensed/authoritative assets. |
| P1.10 Booking tests | 🟡 | Add DB-backed concurrency/integration coverage; pure invariants now include concurrent admission cases. |
| P1.11 Booking state | 🟢 | Current phase uses confirmed/cancelled; true payment holds are later. |
| P1.12 Public contact | 🟢 | Public endpoint with honeypot/rate limit. |
| P1 operations/admin | 🔴 | Build operator booking/contact workflow. |
| P1 notifications | 🔴 | Define production email/WhatsApp confirmation. |
| P2.14 Full dump parse | 🔴 | Extract complete legacy content structures. |
| P2.15 Migration matrix | 🔴 | Record migrate/rewrite/merge/archive/discard per relevant legacy record. |
| P2.16 Legacy URL mapping | 🔴 | Map/redirect important historical paths. |
| P2.17 Seed reconciliation | 🔴 | Reconcile synthetic seed against verified legacy content. |
| P2.18 Fidelity report | 🔴 | Produce final preservation/change/discard report. |

## Current P0 work

TypeScript/runtime-source parity is the active blocker. The previous CI run failed on unsupported standalone Nitro-style sitemap/robots handlers, missing helper modules hidden by `.gitignore`, and stale route metadata property names. The repository now contains TanStack Start server-route implementations for the SEO endpoints and the affected catalog detail routes use the typed language-specific fields.

The `.gitignore` policy is being tightened so imported build/runtime helpers cannot disappear from a clean GitHub checkout. A parity ledger and CI policy are tracked under `docs/`.

The domain test suite now includes pure concurrency admission invariants. This is necessary but not sufficient; a DB-backed locking test remains required to prove the transaction semantics.

## Locked stay/car quantity decision for the current product phase

Each stay or car booking currently consumes exactly **one inventory unit**. A guest may book multiple guests for a stay/car, but that does not silently multiply inventory units. This keeps the server model honest until a dedicated multi-room/multi-vehicle UX is intentionally added.

That means the old WordPress `room_count` field is preserved as migration evidence, but not falsely represented as supported multi-room guest behavior in the current UI.

## Ordered execution

### P0 — engineering baseline

1. Green TypeScript.
2. Green lint/build/smoke.
3. Clean dependency lockfile and remove temporary peer workaround where feasible.
4. Close repository↔preview parity with runtime evidence.
5. Add DB-backed booking concurrency/integration tests.
6. Keep one-unit stay/car booking semantics unless product requirements change.

### P1 — production foundation

After P0 is green: URL-based EN/VN routing; locale-aware canonical metadata/hreflang; locale-aware sitemap/robots; production media/licensing; operator/admin; notification delivery; then payments/temporary holds.

### P2 — WordPress reconstruction

After the production foundation is stable: full dump extraction, migration matrix, legacy URL map, seed reconciliation, and final fidelity report.

## Locked product decisions

Brand: CoHai Travel.

Runtime: React 19 + TanStack Start/Router + Vite + Tailwind v4.

Commerce: live departure booking plus dated stays/cars.

Currency: AUD.

Languages: English + Vietnamese.

Auth: account-scoped booking data; public catalog; public contact.

Booking states: confirmed/cancelled in the current phase.

Legacy WordPress: source material only, not runtime CMS.

CI trigger note: the latest API-created main update corrected the invalid Radix Tooltip dependency range to the lockfile-compatible range; the next GitHub Actions run must revalidate the full dependency chain.
