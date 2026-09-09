# Repository ↔ Preview parity audit

Last reviewed: 9 September 2026.

## Goal

The GitHub repository must be a reproducible source of record for the application that actually runs in the preview. A clean checkout must contain every application/runtime source file and every declared dependency required to install, typecheck, build and run the app.

## Current findings

| Area | Status | Evidence / action |
| --- | --- | --- |
| Application source | 🟢 | Core `src/` route tree and server functions are tracked. |
| Database/runtime source | 🟡 | Runtime pieces are being reconciled with the TanStack Start/Nitro build setup. |
| Build helper scripts | 🟡 | Several helper `.mjs` files were referenced by tracked code while ignored; required helpers are being restored and the ignore policy is being tightened. |
| Platform-only files | 🟢 | Grok preview/PWA assets remain intentionally platform-owned and are not treated as product source. |
| Dependencies | 🟡 | `npm ci` passes after the peer-resolution pin; clean lockfile normalization remains outstanding. |
| Generated route tree | 🟡 | Route tree is tracked. It must be regenerated/verified as part of the final build rather than treated as hand-maintained source. |
| CI | 🔴 | The latest verified historical run stopped at TypeScript errors. A fresh post-repair green run is required before this audit can close. |

## Required clean-checkout test

The parity gate is satisfied only when a clean checkout can:

1. install with `npm ci`;
2. run domain tests;
3. pass TypeScript checks;
4. pass lint;
5. produce the production build;
6. start the production server with the documented environment and pass the smoke test;
7. expose SEO endpoints and auth routes through the same tracked source tree.

## Ignore-list rule

`.gitignore` must not hide application/runtime files that are imported by tracked source, required by the build, or required by a deployed server. Platform-specific files may remain ignored only when they are deliberately generated/injected by the hosting environment and there is a documented equivalent contract.

## Current remediation

- `src/lib/app-data/types.ts` is tracked because `src/lib/preview-host-bridge.ts` imports it.
- `scripts/migration-plan.mjs` and `scripts/sign-out-plan.mjs` are tracked because production TypeScript compilation imports them.
- Sitemap and robots are being moved from unsupported standalone Nitro-style handlers into TanStack Start server routes, matching the framework's documented `createFileRoute(...).server.handlers` contract.
- Route metadata fields were corrected to use typed `*_en` values rather than stale `title` / `excerpt` properties.
- Root-level duplicate social/canonical tags are being reduced so route metadata can own URL-specific SEO.

## Outstanding parity tasks

- run a fresh CI build after the current source repairs;
- verify the production bundle contains all required runtime middleware/assets;
- confirm clean checkout behavior without Grok workspace state;
- remove any remaining accidental dependence on ignored source files;
- normalize the lockfile/peer-resolution setup;
- complete a preview-vs-production route/SEO behavior check once CI is green.

## Decision

Do not declare repository/preview parity complete until the full CI chain is green and the production smoke test succeeds from the GitHub checkout alone.
