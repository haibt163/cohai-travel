# P2 migration execution

Last reviewed: 11 September 2026.

## Objective

Turn the legacy `haibt163/travel` WordPress archive into a traceable migration dataset without treating the current synthetic seed as source truth. The source archive is the frozen `data_vietaustravel` MySQL dump plus the legacy WordPress tree.

## Execution discipline

P2 work must follow the repository AI engineering workflow in `docs/AI_ENGINEERING_WORKFLOW.md`. Establish the live repository state before editing; use the frozen legacy dump as source evidence; prefer the smallest traceable change; and do not claim extraction, migration parity, URL coverage, seed reconciliation or fidelity until the relevant artifacts have been actually generated and reviewed.

For each execution step, distinguish `VERIFIED`, `UNVERIFIED` and `FAILED`. Do not generate repeated speculative migration fixes when an actual source artifact, parser output or validation result is available. Diagnose only until the evidence is sufficient to choose a safe action, then execute and verify.

## Extraction

Run the repository audit tool against a local copy of `data_vietaustravel`:

```text
node scripts/audit-legacy-dump.mjs --input /path/to/data_vietaustravel --output docs/generated/legacy-audit.json
```

The audit intentionally emits schema/row-count and aggregate histograms rather than raw customer records. Historical booking/contact PII is not a migration fixture.

## Canonical mapping

| Legacy source | Canonical target | Rule |
| --- | --- | --- |
| `wp_posts` with `post_type=location` | `destinations` | Preserve legacy id, slug/title/content/media references; resolve destination taxonomy. |
| `wp_posts` with `post_type=tour` | `tours` | Preserve subject and source relationships; classify into the current Nature/Coast/UNESCO taxonomy only when supported by evidence. |
| `wp_byt_tour_schedule` | `tour_departures` | Preserve source schedule id, start date, price and capacity; never infer capacity from prose. |
| `wp_byt_bookings` + vacancy tables | current stay booking/inventory model | Preserve historical linkage as migration evidence; do not invent multi-room UI semantics. |
| `wp_byt_car_rental_bookings` + booking days | current car booking model | Normalize day rows into date-range semantics. |
| `postmeta` / theme options | normalized fields + media map | Classify each customer-facing field; keep raw evidence outside published content. |

## Decision matrix

Every retained candidate receives exactly one disposition:

- `migrate` — substantially preserve source content.
- `rewrite` — preserve intent while replacing obsolete/copy-poor language.
- `merge` — combine duplicates into one canonical record and retain all source ids.
- `archive` — keep source evidence but do not publish.
- `discard` — exclude with a recorded reason (demo, spam, broken, unsafe, obsolete, duplicate, etc.).

Required columns:

`legacy_table, legacy_id, post_type, legacy_slug, legacy_title, canonical_type, canonical_id, disposition, canonical_slug, source_media, target_media, license_status, url_action, reason, reviewer_notes`

## URL preservation

The legacy archive exposes `/locations/...`, `/tours/...`, `/hotels/...`, facility/taxonomy, category/tag/search, Southern/Northern/Mekong/Cruise and other regional groupings. For each high-value path, record one of:

`redirect_301`, `canonical_same`, `canonical_replacement`, `archive_410`, `noindex_retirement`.

The canonical destination must always be a locale-prefixed `/en/...` or `/vn/...` route in the new application where a live replacement exists.

## Media

For each customer-facing legacy image, retain source URL/path, attachment id when available, target asset, crop/transformation notes, alt-text requirement and licensing status. Provisional rebuild imagery must remain marked provisional until provenance is verified.

## Seed reconciliation

Compare the current synthetic seed (approximately 10 destinations, 9 journeys, 6 stays, 4 cars and 23 departures) against the extracted legacy inventory. Every seed record must receive `source-backed`, `rewrite`, `replacement`, or `synthetic-pending` status. A seed record is not allowed to masquerade as a migrated legacy record merely because its subject resembles a source row.

## Phase-entry checkpoint

P2 is ready for execution planning but remains paused until the user explicitly authorizes the next phase. The 11 September 2026 repository checkpoint is clean and synchronized with local `main`; `npm run dev` is USER-REPORTED working, while the full CI gate remains UNVERIFIED pending fresh execution evidence. Do not infer content parity or migration completeness from the current synthetic seed.

## Sensitive data

Do not migrate or publish historic customer email addresses, phone numbers, addresses, booking notes, passwords, secrets or auth tokens. The legacy dump contains historical booking data, but the migration map should retain only the non-sensitive linkage necessary to explain disposition.
