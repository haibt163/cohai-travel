# CoHai Travel — P2 Media Migration

Last reviewed: 11 September 2026.

## Policy

The 15+ year-old WordPress archive contains 22 media attachments identified by the reproducible source audit. Because the original project was a historical template-based build rather than a live customer-data system, legacy media is treated as **valuable source material and a migration candidate**, not as obsolete by default.

## Default decision path

`preserve → inspect → verify provenance/licensing → optimize → map alt text → publish where appropriate → replace only when justified`

A historical image should not be replaced merely because it is old.

## Preserve

For each candidate asset, retain:

- legacy attachment id when available;
- original source path/URL;
- source title/filename;
- associated legacy post/term id;
- target CoHai asset path;
- crop/transformation notes;
- intended destination/tour/stay association;
- alt-text requirement;
- provenance/licensing status;
- final decision and reason.

## Verification

Before a customer-facing asset is published, verify:

1. subject/geographic relevance;
2. visual quality and technical suitability;
3. provenance/licensing/permission status;
4. alt text and accessibility needs;
5. whether a newer asset materially improves accuracy or brand presentation.

## Replacement rules

Replace a legacy asset only where one or more of the following is true:

- quality/resolution is inadequate;
- provenance or licensing cannot be established for publication;
- the image is factually misleading or no longer depicts the relevant subject;
- the composition is unsuitable for the modern UI and cannot be acceptably transformed;
- a new asset is materially better for the product and there is no reason to preserve the old visual identity.

## Implementation boundary

The GitHub connector is text-oriented for repository files and cannot be relied upon as the binary transfer mechanism for the complete legacy media library. The actual binary copy/optimization step should use the user's local legacy folder or another explicit binary-capable workflow.

Do not add bulk legacy media to the public rebuild repository merely because it exists in the source. First create the media mapping and retain only assets that have a clear current product role.

## Completion standard

Media migration is complete when every retained source attachment has an explicit target or explicit retirement decision, provenance/licensing status, accessibility metadata, and a verified role in the current CoHai product.
