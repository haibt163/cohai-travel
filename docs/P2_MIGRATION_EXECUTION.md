# P2 migration execution

Last reviewed: 11 September 2026.

## Objective

Turn the legacy `haibt163/travel` WordPress archive into a traceable migration dataset without treating the current synthetic seed as source truth. The source archive is the frozen `data_vietaustravel` MySQL dump plus the legacy WordPress tree.

## Source audit — completed

The P2 audit is reproducible through `.github/workflows/p2-legacy-audit.yml`. It downloads the frozen legacy dump in the CI runner, generates a sanitized aggregate audit and a sanitized source inventory, validates that raw samples/PII/credentials are not exported, and stores the generated artifacts temporarily in GitHub Actions.

Current source evidence:

- 30 tables; 19 populated tables.
- 207 total `wp_posts` rows.
- 76 domain-relevant published records: 11 locations, 42 tours, 9 accommodations, 5 room types, 5 reviews and 4 car-rental records.
- 22 media attachments.
- 48 taxonomy rows and 294 relationships.
- 4 tour schedules.
- 47 currency rows.
- 2 historical tour-booking rows exist in the source; they contain customer PII and are not exported or migrated.

The frozen dump contains a production-era database password and customer booking fields. They remain source-only evidence and must never enter rebuild fixtures.

## Canonical mapping

| Legacy source | Canonical target | Rule |
| --- | --- | --- |
| `wp_posts` with `post_type=location` | `destinations` | Preserve legacy id, slug/title/content/media references; resolve destination taxonomy. |
| `wp_posts` with `post_type=tour` | `tours` | Preserve subject and source relationships; classify into the current Nature/Coast/UNESCO taxonomy only when supported by evidence. |
| `wp_byt_tour_schedule` | `tour_departures` | Preserve source schedule id, start date, price and capacity; never infer capacity from prose. |
| `wp_byt_bookings` + vacancy tables | current stay booking/inventory model | Preserve historical linkage as migration evidence; do not invent multi-room UI semantics. |
| `wp_byt_car_rental_bookings` + booking days | current car booking model | Normalize day rows into date-range semantics. |
| `postmeta` / theme options | normalized fields + media map | Classify each customer-facing field; keep raw evidence outside published content. |

## Decision matrix — completed working pass

Every relevant published legacy record has a working disposition in `docs/P2_MIGRATION_MATRIX.md`:

- `migrate` — substantially preserve source content.
- `rewrite` — preserve intent while replacing obsolete/copy-poor language.
- `merge` — combine duplicates into one canonical record and retain source ids.
- `archive` — keep source evidence but do not publish.
- `discard` — exclude with a recorded reason.

Current working counts: 47 `rewrite`, 4 `merge`, 13 `archive`, 12 `discard`, 0 direct `migrate` decisions. The absence of direct `migrate` decisions is deliberate because none of the source records has yet cleared every publication-quality gate.

## URL preservation — completed working ledger

`docs/P2_LEGACY_URL_MAP.md` records the identified `/locations/...`, `/tours/...` and `/hotels/...` mappings and intentionally leaves unverified car/room/review route families without invented redirects. Canonical targets use locale-prefixed routes where the target is established.

## Seed reconciliation — completed working ledger

`docs/P2_SEED_RECONCILIATION.md` distinguishes direct source-backed subjects, rewrite/replacement candidates and genuinely synthetic records. The existing 10-destination/9-tour/6-stay/4-car/23-departure seed is not called migrated content merely because it resembles the legacy subject matter.

## Fidelity report — completed working baseline

`docs/P2_FIDELITY_REPORT.md` quantifies the source inventory and current disposition coverage and lists the remaining factual, media, URL, schedule and synthetic-product gaps. Historical content parity remains explicitly unclaimed.

## Media

For each customer-facing legacy image, retain source URL/path, attachment id when available, target asset, crop/transformation notes, alt-text requirement and licensing status. Provisional rebuild imagery must remain marked provisional until provenance is verified.

## Sensitive data

Do not migrate or publish historic customer email addresses, phone numbers, addresses, booking notes, passwords, secrets or auth tokens. The legacy dump contains historical booking data, but the migration map should retain only the non-sensitive linkage necessary to explain disposition.

## Implementation gate

P2 archaeology is complete enough to support implementation. The next implementation batch is source-backed canonical catalog reconstruction, beginning with destinations and tours. Each accepted source record must have an explicit source id/disposition and must pass the repository CI gate before it is considered verified.
