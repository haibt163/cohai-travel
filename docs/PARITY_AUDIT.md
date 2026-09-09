# Repository ↔ Preview parity audit

Last reviewed: 9 September 2026.

## Gate

GitHub is the source of record. Parity closes only when a clean checkout can install, test, typecheck, lint, build, start, and serve the same application contract without relying on hidden Grok workspace files.

## Current findings

| Area | Status | Notes |
| --- | --- | --- |
| Core application source | 🟢 | Route tree and server functions are tracked. |
| Imported helper source | 🟡 | Helper modules previously hidden by `.gitignore` are being restored/tracked. |
| SEO server routes | 🟡 | Sitemap/robots are now authored as TanStack Start server routes under `src/routes`; fresh runtime certification still required. |
| Dependencies | 🟡 | `npm ci` has passed historically with the temporary peer-resolution bridge; lockfile normalization remains. |
| Domain tests | 🟢 | Existing inventory/date tests plus pure concurrency invariants are covered. |
| Typecheck | 🟡 | Current source repair is aimed at clearing the prior failure set. |
| Lint/build/smoke | 🔴 | Must be freshly certified after typecheck. |
| Preview ↔ production parity | 🟡 | Source parity materially improved; runtime closure depends on a green CI run from GitHub. |

## Clean-checkout closure test

1. `npm ci`
2. `npm run test:domain`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. `npm run test:smoke`
7. Verify `/robots.txt`, `/sitemap.xml`, auth routes and catalog routes from the same build.

## Booking parity

Tour seat allocation is transactional. Stay/car availability is finite and date-overlap based. The current product deliberately consumes one stay/car inventory unit per booking; the old WordPress `room_count` field remains migration evidence rather than an unsupported UI promise.

## Closure rule

Do not mark parity complete from source inspection alone. The final evidence must be a fresh successful CI run from the exact GitHub commit being audited.
