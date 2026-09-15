# Implementation Handoff — P2 Travel Notes

## Task
Advance P2 Legacy Product Archaeology & Modern Reconstruction by implementing a high-value, source-led travel-information surface without changing protected booking, inventory, authentication, canonical-routing, or provenance contracts.

## Scope
- Add bilingual (`/en` and `/vn`) travel notes that connect five source-backed destination subjects to their canonical destination hubs.
- Preserve source transparency using the official tourism references already recorded in the P2 fact-source ledger.
- Keep every date-, weather-, access-, operator-, and activity-dependent statement explicitly non-promissory.
- Include the new canonical URLs in the sitemap and in smoke coverage.

## Design
The new route uses typed, repository-local editorial records rather than a database migration. This is deliberate: the notes are static source-led planning content, not catalog inventory or commercial data. Each card includes a source link, a canonical destination link, a planning caveat, and EN/VN copy. The route’s head declares canonical and alternate locale URLs.

## Changes
- Added `src/lib/travel-notes.ts` with five bilingual destination notes: Hanoi, Ha Long, Hoi An, Sapa and Mekong.
- Added `src/routes/$locale/travel-notes.tsx`, including locale-aware metadata and source attribution.
- Added the surface to shared navigation and the locale-aware sitemap.
- Extended the local smoke script to exercise both locale routes and assert both sitemap entries.
- Updated the P2 reconstruction ledger and project status to record the bounded progress and remaining production-preview issue.

## Tests / Verification
### REPORTED BY CODEX CLOUD — NOT YET REPRODUCED LOCALLY
- `npm run test:smoke` passed: PGLite migration bootstrap, `/en/travel-notes`, `/vn/travel-notes`, and both sitemap URLs returned expected content.
- `npm run test:domain` passed: 15 domain/provenance/inventory tests passed.
- `npm run typecheck` passed.
- `npm run lint` completed with 0 errors and 4 pre-existing warnings in `src/lib/auth/use-current-user.ts` and `src/lib/locale.tsx`.
- `npm run build` passed and emitted the production `travel-notes` route bundle.
- `git diff --check` passed before the Cloud export.

### UNVERIFIED
- Visual screenshot/browser-console inspection was unavailable in the Cloud workspace.
- Production-preview rendering remains unverified because the built PGLite fallback could not locate its packaged `pglite.data` asset.

## Evidence
- The travel notes source links correspond to the current official references listed in `docs/P2_2026_FACT_SOURCES.md`.
- The implementation intentionally follows the canonical record plan’s distinction between source/editing facts and commercial/media/publication gates.

## Remaining Risks
- Production preview with `DATABASE_URL` unset cannot currently initialize PGLite from the built Vercel output because the packaged data asset is absent. This needs separate runtime/deployment investigation before a production-preview verdict can be claimed.
- The five notes do not close media provenance, current commercial verification, schedule reconciliation, or legacy redirect gaps.

## Unverified
- Current media licensing/provenance for the linked destination images.
- Current commercial/departure/operator details, intentionally excluded from the planning notes.
- Browser visual and console verification, blocked by absent browser tooling in this workspace.

## Git
Source: Codex Cloud workspace export.
Target branch: `feat/p2-travel-notes-chief-review`.
Cloud implementation/handoff SHAs are retained only as historical session references; they are not asserted as commits in this repository.
PR: this GitHub review branch.