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

## Content strategy

### Preserve aggressively where appropriate

Durable Vietnam travel subjects, destination knowledge, tour concepts and travel-information ideas from the historical project may be retained as source-backed reconstruction inputs. The owner's historical context establishes that the project was a template-based product concept rather than a genuine customer-data archive.

### Verify before publication

Current factual details, pricing, departures, capacity, accommodation availability, media provenance/licensing and any claim that could have changed since the original project require current verification before being represented as live production truth.

### Media

Legacy media is an eligible migration candidate. Preserve first when useful and legally usable; optimize and remap; replace only when quality, provenance, factual accuracy or brand requirements justify replacement.

## Implementation order

1. Destination-led connected catalog UX — current batch.
2. Source-backed canonical destinations — retain durable historical subjects and establish provenance.
3. Source-backed canonical tours — reconstruct the strongest historical tour/product ideas.
4. Travel-information surfaces — rebuild durable subject matter with current facts.
5. Stays/cars — selectively reconstruct and verify useful historical products.
6. Departures — reconcile the historical schedule model with current availability rules.
7. Media and URL preservation — implement alongside the canonical entities they support.
8. Final fidelity review — quantify what was kept, modernized, merged, archived or retired.

## Verification rule

Every implementation batch must pass the full repository CI chain. A feature is not considered verified merely because its code looks correct or a local development server starts.
