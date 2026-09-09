# CoHai Travel — project status

Last updated: 9 September 2026.

## Executive status

The rebuild is in active engineering-hardening and reconstruction. Core booking atomicity and finite inventory are implemented. Public contact is intentional. SEO foundations exist. CI dependency installation and domain tests pass, but the full CI gate remains open until a fresh commit passes typecheck, lint, build and production smoke.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟡 | Finish source/ignore parity and normalize lockfile policy. |
| P0.2 Preview/repo parity | 🟡 | Fresh green CI + production smoke from GitHub checkout. |
| P0.3 Atomic tour booking | 🟢 | Keep protected by integration tests. |
| P0.4 Stay/car finite inventory | 🟡 | Add quantity semantics only if multiple units per booking are a product requirement. |
| P0.5 CI | 🟡 | Clear current TypeScript/runtime issues and obtain full green chain. |
| P1.6 EN/VN URL architecture | 🔴 | Implement crawlable locale-prefixed routes without duplicating the app. |
| P1.7 Locale-aware metadata | 🟡 | Extend SEO helper for canonical/hreflang per locale after routing. |
| P1.8 Sitemap/robots | 🟡 | Complete TanStack server routes and include canonical locale variants. |
| P1.9 Images | 🟡 | Replace provisional imagery with licensed/authoritative assets. |
| P1.10 Booking tests | 🟡 | Add DB-backed concurrency/integration coverage. |
| P1.11 Booking state | 🟢 | Current phase uses confirmed/cancelled; payment hold is later. |
| P1.12 Public contact | 🟢 | Public endpoint with honeypot/rate limit is implemented. |
| P1 operations/admin | 🔴 | Build operator booking/contact workflow. |
| P1 notifications | 🔴 | Define and implement production email/WhatsApp confirmation. |
| P2.14 Full dump parse | 🔴 | Extract complete legacy content structures. |
| P2.15 Migration matrix | 🔴 | Record migrate/rewrite/merge/archive/discard per legacy record. |
| P2.16 Legacy URL mapping | 🔴 | Map/redirect important historical paths. |
| P2.17 Seed reconciliation | 🔴 | Reconcile synthetic seed against verified legacy content. |
| P2.18 Fidelity report | 🔴 | Produce final preservation/change/discard report. |

## Current CI/runtime blocker

The previous verified CI run failed at TypeScript after `npm ci` and all four domain tests passed. The affected areas were unsupported standalone Nitro sitemap/robots handlers, missing helper modules that were hidden by `.gitignore`, and stale `title`/`excerpt` route metadata references. Those source discrepancies are being repaired directly in the repository.

## P0 execution order

1. Repair TypeScript/runtime-source parity.
2. Obtain full green CI: domain tests → typecheck → lint → build → production smoke.
3. Replace the temporary npm peer-resolution workaround with a clean lock/package configuration where possible.
4. Close the repo↔preview parity audit using green CI as runtime evidence.
5. Add DB-backed concurrency/integration tests for tours, stays and cars.
6. Add multi-room/multi-unit selection only if the product requires one booking to consume more than one inventory unit.

## P1 execution order

After P0 is green:

1. URL-based EN/VN architecture.
2. Locale-aware canonical metadata + hreflang.
3. Locale-aware sitemap/robots.
4. Production media/licensing pass.
5. Operator/admin surfaces.
6. Notification policy and delivery.
7. Payments and temporary holds only after inventory/state semantics are stable.

## P2 execution order

After the production foundation is stable, perform the actual WordPress reconstruction: full dump extraction, migration matrix, URL map, seed reconciliation, and final fidelity report. The current seeded catalog must not be described as a historical migration.

## Locked product decisions

Brand: CoHai Travel.

Runtime: React 19 + TanStack Start/Router + Vite + Tailwind v4.

Commerce: live departure booking plus dated stays/cars.

Currency: AUD.

Languages: English + Vietnamese.

Auth: account-scoped booking data; public catalog; public contact.

Booking states: confirmed/cancelled in the current phase.

Legacy WordPress: source material only, not runtime CMS.
