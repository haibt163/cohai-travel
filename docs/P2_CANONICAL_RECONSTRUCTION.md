# CoHai Travel — P2 Canonical Reconstruction

Last reviewed: 11 September 2026.

## Purpose

This is the implementation ledger for rebuilding the durable product ideas found in the old WordPress archive as a modern CoHai Travel experience. It sits between `P2_LEGACY_PRODUCT_ARCHAEOLOGY.md` and production code.

## First implementation principle

A destination is a **connected travel hub**, not merely an editorial page. A canonical destination should connect the customer to relevant journeys, stays and transport while preserving the destination as the primary discovery context.

This directly modernizes the old site's connected catalog/search concept without reproducing its WordPress templates or query-string mechanics.

## Implemented in this batch

- Added destination-scoped stay retrieval in `src/lib/destination-products.ts`.
- Added destination-scoped car retrieval in `src/lib/destination-products.ts`.
- Updated `src/routes/$locale/destinations/$slug.tsx` to load tours, stays and cars in parallel.
- Added destination-page cross-navigation for stays and cars while retaining the existing journey grid.
- Kept the current normalized catalog schema and server-function boundary; no legacy WordPress runtime behavior was copied.
- Added a public-catalog provenance guard so `synthetic-pending` destinations and journeys do not leak into catalog retrieval, search or the sitemap.
- Refreshed the first source-backed destination records — Hanoi, Ha Long, Hoi An, Hue and Sapa — with independently checked 2026 factual copy while preserving canonical ids/slugs and existing media.
- Recorded the current evidence used for those refreshes in `docs/P2_2026_FACT_SOURCES.md`.

## Provenance contract

Canonical destination and journey records now carry reconstruction provenance in migration `migrations/0006_provenance.sql`.

- `source_ref` records the historical source subject(s) that informed a canonical record.
- `provenance_state = source-backed` means the record has an explicit historical source reference.
- `provenance_state = modern-addition` marks intentional 2026 product additions that are not claimed as legacy-derived.
- `provenance_state = synthetic-pending` is reserved for temporary seed/fixture records that still need a source-backed or intentional-product decision.

The provenance field is traceability metadata, not a publication-readiness claim. Current factual, editorial, media/licensing and commercial verification gates remain separate.

`npm run test:domain` includes `scripts/provenance.test.mjs`, which guards the state vocabulary, requires explicit source references for the accepted source-backed destination/journey set, and ensures intentional modern additions are not assigned legacy source references.

## Content strategy

### Preserve aggressively where appropriate

Durable Vietnam travel subjects, destination knowledge, tour concepts and travel-information ideas from the historical project may be retained as source-backed reconstruction inputs. The owner's historical context establishes that the project was a template-based product concept rather than a genuine customer-data archive.

### Verify before publication

Current factual details, pricing, departures, capacity, accommodation availability, media provenance/licensing and any claim that could have changed since the original project require current verification before being represented as live production truth.

### Media

Legacy media is an eligible migration candidate. Preserve first when useful and legally usable; optimize and remap; replace only when quality, provenance, factual accuracy or brand requirements justify replacement.

## Current reconstruction progress

### Fact-checked destination refresh — completed

The first five source-backed destination subjects have refreshed current copy in `migrations/0007_fact_checked_destinations.sql`:

- Hanoi — current Vietnam Tourism evidence for history, Old Quarter and present-day city life.
- Ha Long — current Vietnam Tourism evidence for the karst seascape, cruising/caves and the wider Ha Long–Cat Ba World Heritage landscape.
- Hoi An — current Vietnam Tourism evidence for the trading-port history, walkable Old Town and cultural influences.
- Hue — current Vietnam Tourism evidence for the Nguyen Dynasty legacy, 143-year reign and Perfume River setting.
- Sapa — current Vietnam Tourism evidence for terrace farming, trekking, Fansipan and practical gateways through Lao Cai/Hanoi.

This is a factual-copy refresh, not a final commercial or media approval.

## Implementation order

1. Destination-led connected catalog UX — implemented.
2. Source-backed canonical destinations — provenance established; first five destination records fact-refreshed.
3. Source-backed canonical tours — next major reconstruction batch.
4. Travel-information surfaces — rebuild durable subject matter with current facts.
5. Stays/cars — selectively reconstruct and verify useful historical products.
6. Departures — reconcile the historical schedule model with current availability rules.
7. Media and URL preservation — implement alongside the canonical entities they support.
8. Final fidelity review — quantify what was kept, modernized, merged, archived or retired.

## Verification rule

Every implementation batch must pass the full repository CI chain. A feature is not considered verified merely because its code looks correct or a local development server starts.
