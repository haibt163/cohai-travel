# P2 — legacy product archaeology and reconstruction

Last reviewed: 11 September 2026.

## Objective

Recover the useful product, business and UX intent from the 15+ year-old `haibt163/travel` WordPress archive and use it to build a modern CoHai Travel product. The archive is **not** treated as a production customer-data migration target. Historical customer/booking data remains source-only and is never migrated.

The working model is now:

`legacy archive → product/content archaeology → explicit KEEP / MODERNIZE / RETIRE decisions → source-backed canonical reconstruction → 2026 verification`

## Source audit — completed

The P2 audit is reproducible through `.github/workflows/p2-legacy-audit.yml`. It downloads the frozen legacy dump in the CI runner, generates sanitized aggregate/source-inventory artifacts, validates that raw samples/PII/credentials are not exported, and stores the generated artifacts temporarily in GitHub Actions.

Current source evidence:

- 30 tables; 19 populated tables.
- 207 total `wp_posts` rows.
- 76 domain-relevant published records: 11 locations, 42 tours, 9 accommodations, 5 room types, 5 reviews and 4 car-rental records.
- 22 media attachments.
- 48 taxonomy rows and 294 relationships.
- 4 tour schedules.
- 47 currency rows.
- Historical booking fields exist in the source but are excluded from migration fixtures because they contain customer data.

## Product archaeology interpretation

The owner has clarified that the legacy site was an old template-based project built more than 15 years ago around their own travel-product ideas, not a live customer-data system. Therefore, the archive's greatest value is its **original product intent, travel subject matter, information architecture, taxonomy, workflow concepts, and media references**.

`docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md` is the primary bridge between that historical intent and the 2026 implementation.

## Evidence of original UX/business intent

The legacy theme shows a destination list, tour/accommodation/car search, date/location/guest/room filtering, pricing/rating filters, account/login/register, AUD display, English/Vietnamese switching, site search, and a homepage organized around Nature, Beach and UNESCO sections. These are treated as historical product signals, not as instructions to reproduce the old WordPress UI.

## Canonical mapping

| Legacy source | Canonical target | Rule |
| --- | --- | --- |
| `wp_posts` with `post_type=location` | `destinations` | Preserve useful subject matter, source id, slug/title/content/media references; reconstruct current facts/editorial copy. |
| `wp_posts` with `post_type=tour` | `tours` | Preserve useful travel concepts and supporting source relationships; rewrite contaminated/dated fields. |
| `wp_byt_tour_schedule` | `tour_departures` | Preserve source schedule id, date, price and capacity when intentionally reused; independently verify current commercial validity. |
| accommodation posts/room data | current stay model | Reuse useful property concepts only after geographic/provenance verification; do not migrate historical customer bookings. |
| car rental records | current car model | Reuse useful vehicle/product concepts as modern content only when commercially appropriate; current booking model remains authoritative. |
| `postmeta` / theme options | normalized fields + archaeology ledger | Use as evidence of product/content intent; never copy secrets or old runtime configuration blindly. |
| legacy media attachments | `public/media` or future media store | Preserve source asset when useful and legally usable; optimize and remap rather than automatically replacing everything. |

## Decision vocabulary

### Product intent

- `KEEP` — the underlying idea remains valuable in 2026.
- `MODERNIZE` — the idea remains valuable but implementation/UX must be redesigned.
- `RETIRE` — the old implementation or idea should not influence the modern product.

### Content records

Continue using the precise record dispositions in `docs/P2_MIGRATION_MATRIX.md`:

- `migrate` — preserve substantially after factual/editorial approval.
- `rewrite` — preserve subject/intent but rewrite the content into the current product voice.
- `merge` — combine duplicate/locality records into one canonical entity.
- `archive` — retain as historical evidence but do not publish.
- `discard` — intentionally exclude with a reason.

## Media policy

Legacy media is **eligible for migration**. For each retained asset, preserve source path/attachment id when available, create a target mapping, inspect quality, verify provenance/licensing, optimize dimensions/file size, define alt text, and replace only where quality, legality or relevance requires it. A replacement is not assumed merely because the file is old.

Because the current GitHub connector is text-oriented, binary media transfer should be handled from the user's local legacy folder or another explicit binary-capable workflow when implementation time arrives. The archaeology ledger should therefore be created before bulk asset copying.

## Sensitive data

Do not migrate or publish historic customer names, email addresses, phone numbers, addresses, booking notes, passwords, secrets or auth tokens. The old archive may contain such fields as historical artifacts, but they are never product content.

## Implementation order

1. Legacy Product Archaeology — explicit original product/business/UX intent.
2. Source-backed destinations and tours — prioritize historically useful subjects and retain source provenance.
3. Travel-information/content surfaces — preserve durable subject matter and refresh current facts.
4. Stays and cars — selectively reconstruct useful historical concepts with current commercial verification.
5. Departures — map the small source schedule set only when dates/prices/capacity are intentionally current; otherwise preserve historical schedules as evidence.
6. Legacy media — migrate useful assets, optimize, verify and replace selectively.
7. Legacy URLs — implement only after canonical targets exist and source routing evidence is sufficient.
8. Final fidelity report — quantify what was kept, modernized, merged, archived and retired.

## Verification gate

Every implementation batch must pass the repository CI chain before being marked verified. No model reasoning may substitute for execution evidence. Use the engineering workflow's stop rule: diagnose until evidence is sufficient, make the smallest safe change, verify, then stop rather than entering a redundant diagnostic loop.
