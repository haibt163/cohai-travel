# Repository ↔ preview parity audit

Last reviewed: 3 November 2026.

## Objective

`main` must be capable of reproducing the application represented by the Grok App Builder preview. Preview-only platform files must be either tracked or explicitly documented as platform-provided assets; application runtime modules must never be silently ignored.

## Evidence basis

This review checked the tracked tree at `main` @ `4874bbe` and GitHub Actions run #41772194781 (4 November 2026). PR #30 Preview deployments passed, but the lane still has no browser access to the live Vercel deployment or the Grok preview, so visual parity is not claimed.

## Current audit

| Area | Status | Finding |
| --- | --- | --- |
| Runtime server code | ✅ | `server/middleware/grok-pwa.ts` is tracked; the production build and smoke test pass in run #41772194781. |
| Build configuration | ✅ | `vite.config.ts` is tracked; `npm run build` completed in run #41772194781. |
| Migration planner module | ✅ | `scripts/migration-plan.mjs` is tracked and imported by `src/lib/db.ts`. |
| Migration planner test | ✅ RESOLVED | PR #30 added `scripts/migration-plan.test.mjs`; six tests pass and execute inside `npm run test:domain`. The earlier missing-file finding is historical. |
| Auth sign-out helper | ✅ | `scripts/sign-out-plan.mjs` is tracked so browser auth code is reproducible. |
| Preview bridge types | ✅ | `src/lib/app-data/types.ts` is tracked even though other `src/lib/app-data/` files are ignored. |
| Grok PWA plugin | ✅ | `scripts/grok-pwa-plugin.mjs` is tracked. |
| App env plugin | ✅ | `scripts/app-env-plugin.mjs` is tracked. |
| PWA middleware | ✅ | `server/middleware/grok-pwa.ts` is tracked as a compatibility hook. |
| Generated route tree | ✅ | `src/routeTree.gen.ts` is tracked; the checked-in build completes. |
| Dependencies | ✅ | `npm ci` passes with no root `.npmrc` and no `legacy-peer-deps` override (run #41772194781). |
| Preview-specific assets | 🟡 | `public/__grok/` is ignored; the tracked build and smoke do not depend on it. A live preview inspection is still required before claiming parity. |
| Preview ↔ production visual parity | 🟡 UNVERIFIED | No browser observation of the live Vercel or Grok preview exists in this review. A successful CI run is repository evidence, not visual proof. |

## Acceptance criteria

1. A clean checkout contains every non-generated source/runtime module imported by Vite, server, client or migration code — **VERIFIED** by the green build in run #41772194781.
2. `npm ci` succeeds without manually installing anything — **VERIFIED**.
3. `npm run typecheck` succeeds — **VERIFIED**.
4. `npm run lint` succeeds — **VERIFIED** (0 errors; 4 pre-existing warnings).
5. `npm run build` succeeds — **VERIFIED**.
6. `npm run test:smoke` succeeds against the production bundle — **VERIFIED**.
7. No application behavior depends on an ignored workspace-only file unless it is explicitly a documented platform-provided asset — **PARTIAL**; `public/__grok/` remains a preview-only asset and is not required by the tracked build.
8. The actual Grok/Vercel preview remains functional after any parity repair — **UNVERIFIED**; requires a browser check by the Project Owner or a lane with preview access.

## Do not close this audit on static inspection alone

The parity item is complete only after the full CI sequence passes on a clean GitHub checkout and the live preview is checked against the same source tree. Run #41772194781 satisfies the first condition; the second remains outstanding.

## Booking parity

Tour seat allocation is transactional. Stay/car availability is finite and date-overlap based. The current product deliberately consumes one stay/car inventory unit per booking; the old WordPress `room_count` field remains migration evidence rather than an unsupported UI promise.
