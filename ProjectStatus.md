# CoHai Travel — project status

Last updated: 8 September 2026.

## Executive status

The rebuild has moved beyond the original v1 scaffold. The remaining work is now **verification, production hardening, multilingual SEO architecture, and full WordPress content fidelity**. Booking race-condition and finite-inventory safeguards have been implemented, public contact has been intentionally changed to a no-login form, and CI now installs dependencies and passes the domain booking tests. CI is **not yet green** because the current commit fails TypeScript checks.

## Source of record

- `haibt163/cohai-travel` — current rebuild and source of record.
- `haibt163/travel` — frozen legacy WordPress site and `data_vietaustravel` source. Do not overwrite it.
- Grok App Builder preview — historical build environment; it is not a substitute for the GitHub repository as the reproducible source.

## Initial audit → current status

| Audit area | Status | Current position / remaining work |
| --- | --- | --- |
| P0.1 Reproducible GitHub checkout | 🟡 In progress | `server/` is tracked and `.npmrc` pins legacy peer resolution. `npm ci` succeeds in CI, but the lockfile/dependency setup should still be normalized rather than relying indefinitely on the workaround. |
| P0.2 Repository ↔ preview parity | 🟡 In progress | Important runtime/server pieces that were previously ignored are now tracked. A final parity audit is still required against the actual playable preview/build output. |
| P0.3 Booking atomicity | ✅ Implemented | Tour booking locks the departure row and re-checks confirmed seats inside a DB transaction before inserting. |
| P0.4 Stay/car inventory semantics | 🟡 Implemented, needs product completion | Finite inventory and date-overlap enforcement are implemented. Stay counts were seeded from the strongest available source evidence; cars conservatively default to one concurrent unit. The UI does not yet expose multi-unit/room-count selection. |
| P0.5 CI | 🟡 Implemented, currently failing | Dependency installation and domain tests pass. Typecheck fails in sitemap/robots runtime files, missing script/type modules, and route metadata property mismatches. Lint/build/smoke are skipped because the workflow stops at typecheck. |
| P1.6 Multilingual SEO architecture | 🔴 Outstanding | EN/VN currently use client-side/localStorage locale state. Proper crawlable language-prefixed URLs, hreflang/canonical relationships and route-aware locale resolution are not yet implemented. |
| P1.7 Route-specific metadata | 🟡 Partially implemented | Shared SEO helpers and route metadata exist, but they are not production-ready until the route/locale architecture and typecheck are clean. |
| P1.8 Sitemap/robots/canonical/structured data | 🟡 Partially implemented | Sitemap, robots and structured-data work exists, but the current `server/routes/*.ts` implementation fails typecheck. Locale-aware sitemap output also remains outstanding. |
| P1.9 Image delivery | 🟡 Partially implemented | Image loading has been improved with lazy/eager handling, async decoding and fetch priority. Licensed/authoritative photography remains a later content pass. |
| P1.10 Booking/domain tests | 🟡 Started | Date-range and finite-inventory tests pass in CI. Integration/concurrency tests are still needed for tour, stay and car booking behavior against the real DB adapters. |
| P1.11 Confirmation/hold semantics | 🟡 Decided for current phase | Booking states are `confirmed` / `cancelled`; there is no temporary payment hold. Migration `0005_booking_status.sql` records the status constraint. A true payment hold remains future commerce work. |
| P1.12 Contact authentication | ✅ Implemented | Contact is intentionally public, with a honeypot and basic per-email hourly rate limit; messages are stored without requiring sign-in. |
| P2 Content archaeology / fidelity | 🔴 Outstanding | Legacy domain structures have been inspected, but a complete row-by-row migration matrix has not been produced. The next pass must cover posts, postmeta, taxonomies, media, slugs, relationships and explicit migration decisions. |

## Implemented hardening

### Booking atomicity

Tour departure seat allocation is transactional. The departure row is locked, confirmed-seat count is re-read while the lock is held, and the booking is inserted only if capacity remains.

### Finite inventory

`migrations/0004_inventory.sql` adds `inventory_unit_count` to stays/cars and `inventory_units` to bookings. Availability uses half-open date ranges and confirmed bookings, with the inventory row locked before the final capacity check.

Seeded stay counts currently represented: Maison Hanoi 12, Junk Suite 6, Hoi An River 4, Sapa Lodge 8, Phu Quoc Villa 4. Angkor Garden conservatively defaults to 1 because no authoritative count was found. Cars conservatively use one concurrently bookable unit because the seed contains no authoritative fleet count.

### Public contact

Contact no longer requires authentication. `0005_public_contact.sql` permits a nullable `user_id`, and the endpoint applies a honeypot plus basic per-email hourly rate limiting.

### SEO foundations

A shared SEO helper, route metadata, root TravelAgency structured data, sitemap and robots endpoints, and `VITE_SITE_URL` configuration have been added. These are foundations, not a completed multilingual SEO implementation.

### CI foundations

`.github/workflows/ci.yml` runs dependency installation, domain tests, typecheck, lint, build and production smoke testing in sequence. `npm ci` and the four current domain tests pass. The latest run stops at typecheck.

## Current CI blocker

Latest checked commit: `9cd8e6f25aab698e299f9cfbc846b3ba47c0ad2c`.

Dependency installation: **pass**. Domain tests: **4/4 pass**. Typecheck: **fail**.

The TypeScript failures are in four groups:

1. `server/routes/robots.txt.ts` and `server/routes/sitemap.xml.ts` use Nitro-style helpers that are not typed/available in the current TanStack runtime.
2. `src/lib/auth/client.ts`, `src/lib/db.ts`, and `src/lib/preview-host-bridge.ts` reference missing `.mjs` / type modules.
3. Destination/tour/stay/car route metadata reads `title` / `excerpt` properties although the catalog types expose language-specific fields.
4. Because typecheck exits non-zero, lint, build and production smoke tests do not currently execute.

**This is the immediate P0 blocker.**

## Outstanding work — ordered execution plan

### P0 — finish engineering baseline

1. Make CI green; then run the complete lint → build → smoke sequence.
2. Normalize dependency reproducibility. Keep successful `npm ci` behavior, but replace the `.npmrc` workaround with a clean lock/package configuration if possible.
3. Complete repository/preview parity audit: every runtime file tracked, every build dependency declared, no preview-only implementation silently absent from GitHub.
4. Strengthen booking integration tests, including concurrent/near-concurrent attempts and both Postgres/PGLite paths where practical.
5. Complete stay/car commerce semantics: decide and implement whether guests can reserve multiple rooms/units in one booking; expose quantity in the UI if supported.

### P1 — production SEO and operations

6. Implement URL-based bilingual architecture with crawlable EN/VN route variants and server-side URL locale resolution.
7. Make metadata locale-aware: titles, descriptions, canonical URLs, Open Graph and hreflang must match the language URL.
8. Make sitemap/robots production-correct and generated by the actual TanStack runtime; enumerate canonical language variants.
9. Finish image strategy: replace provisional/stock imagery with licensed or authoritative operator photography and verify dimensions, loading and alt text.
10. Decide production email/notification behavior; current confirmation is on-site only.
11. Add operational admin for bookings/contact messages and cancellation/status management.
12. Keep payments out until inventory/hold semantics are stable; then implement Stripe/payment collection if required.

### P2 — source fidelity / reconstruction

13. Parse the complete `data_vietaustravel` dump into a machine-readable inventory of published posts, postmeta, taxonomies, media references, slugs and booking-related structured data.
14. Build the migration matrix with explicit `migrate`, `rewrite`, `merge`, `archive` or `discard` decisions and retained legacy IDs.
15. Map important legacy `/locations/...`, `/tours/...`, `/hotels/...` and taxonomy routes to preserve or deliberately redirect them.
16. Reconcile catalog content, replacing synthetic seed content where appropriate with verified legacy content while preserving deliberate editorial improvements.
17. Produce a fidelity report documenting what was preserved, rewritten, merged, archived and intentionally dropped.

## Product decisions locked

| Decision | Current choice |
| --- | --- |
| Brand | CoHai Travel |
| Commerce | Live departure booking; stays/cars by date |
| CMS | Postgres + migrations/seed; operator admin later |
| Currency | AUD |
| Languages | English + Vietnamese |
| Runtime | React 19 + TanStack Start/Router + Vite + Tailwind v4 |
| Auth | Better Auth for account-scoped booking data; public catalog; public contact form |
| Booking status | `confirmed` / `cancelled` for current phase; no temporary payment hold |
| Legacy WordPress | Source material only; not the runtime CMS |
| Next.js | Optional future packaging/hosting migration only; do not maintain a second app |

## Phase map

### Phase 0 — engineering baseline

**Mostly complete; CI/typecheck remains the blocker.**

### Phase 1 — production foundation

SEO locale architecture, complete metadata/sitemap/robots, stronger tests, operational admin and final inventory UX.

### Phase 2 — content fidelity

Full WordPress dump archaeology, migration mapping, route preservation and authoritative media.

### Phase 3 — commerce depth

Payment integration, true temporary holds if required, waitlist, notifications and related operational workflows.

### Phase 4 — optional packaging

Port to Next.js only if a future hosting decision requires it. Keep the domain model and database; do not revive WordPress as the runtime.

## Documentation rule

This file is the active implementation ledger. When a major item changes state, update it and the relevant archaeology/readme document in the same commit.
