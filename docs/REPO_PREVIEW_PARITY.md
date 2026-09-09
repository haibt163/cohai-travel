# Repository ↔ preview parity audit

Last reviewed: 8 September 2026.

## Objective

`main` must be capable of reproducing the application represented by the Grok App Builder preview. Preview-only platform files must be either tracked or explicitly documented as platform-provided assets; application runtime modules must never be silently ignored.

## Current audit

| Area | Status | Finding |
| --- | --- | --- |
| Runtime server code | 🟡 | `server/` is no longer ignored, but parity verification is still required after restoring missing modules. |
| Build configuration | 🟡 | `vite.config.ts` references platform modules that were missing from GitHub and have now been restored. Final build verification is still required. |
| Migration planner | ✅ restored | `scripts/migration-plan.mjs` is now tracked so `src/lib/db.ts` has a reproducible import. |
| Auth sign-out helper | ✅ restored | `scripts/sign-out-plan.mjs` is now tracked so browser auth code is reproducible. |
| Preview bridge types | ✅ restored | `src/lib/app-data/types.ts` now exists with the connector event contract used by the bridge. |
| Grok PWA plugin | ✅ restored | `scripts/grok-pwa-plugin.mjs` is now tracked. |
| App env plugin | ✅ restored | `scripts/app-env-plugin.mjs` is now tracked. |
| PWA middleware | ✅ restored | `server/middleware/grok-pwa.ts` is now tracked as a compatibility hook. |
| Generated route tree | 🟡 | `src/routeTree.gen.ts` is tracked; it must be regenerated/validated by the actual build after route changes. |
| Dependencies | 🟡 | `npm ci` now passes using `.npmrc` legacy peer resolution; lockfile normalization remains outstanding. |
| Preview-specific assets | 🟡 | `public/__grok` / platform assets must be checked against the current build contract without replacing or inventing platform functionality. |

## Acceptance criteria

1. A clean checkout contains every non-generated source/runtime module imported by Vite, server, client or migration code.
2. `npm ci` succeeds without manually installing anything.
3. `npm run typecheck` succeeds.
4. `npm run lint` succeeds.
5. `npm run build` succeeds.
6. `npm run test:smoke` succeeds against the built production server.
7. No application behavior depends on an ignored workspace-only file unless it is explicitly a documented platform-provided asset.
8. The actual Grok preview remains functional after any parity repair.

## Do not close this audit on static inspection alone

The parity item is complete only after the full CI sequence passes on a clean GitHub checkout and the live preview is smoke-tested against the same source tree.
