# Content archaeology and migration map

Last reviewed: 11 September 2026.

## Purpose

This document is the source-fidelity ledger for reconstructing the legacy VietAus WordPress site without silently inventing or losing content. It records source-derived findings and migration rules. It does **not** claim that all legacy records have already been migrated.

## Source of truth reviewed

The legacy source repository is `haibt163/travel`. Its root contains the `data_vietaustravel` MySQL/content dump and the old `vietaustravel` WordPress tree. The rebuild repository is `haibt163/cohai-travel`; the legacy repository remains frozen/source-only.

## Legacy domain model found

| Legacy structure | Observed meaning | Current model | Migration status |
| --- | --- | --- | --- |
| `wp_posts` (`post_type=location`) | destination/location content | `destinations` | Source inventory + working row-level dispositions complete; accepted canonical reconstruction remains. |
| `wp_posts` (`post_type=tour`) | tour/content records | `tours` | Source inventory + working row-level dispositions complete; accepted canonical reconstruction remains. |
| `wp_byt_tour_schedule` | scheduled departures, price, duration, capacity | `tour_departures` | Four source schedules identified; reconciliation against the synthetic departure seed remains. |
| `wp_byt_tour_booking` | tour bookings linked to schedule | shared `bookings` | Historical rows identified; customer PII remains source-only and is not migrated. |
| `wp_byt_bookings` | accommodation bookings; includes `room_count` | stay bookings + `inventory_units` | Inventory semantics implemented; historical records remain source evidence only. |
| `wp_byt_vacancies` | per-day accommodation vacancy with `room_count` | finite stay inventory | Source schema retained as evidence; no unsupported multi-room guest UX. |
| `wp_byt_vacancy_bookings` | rooms consumed by a booking/vacancy | booking inventory | Source relationship retained in migration rules; no customer rows exported. |
| `wp_byt_car_rental_bookings` | car rental booking | shared `bookings`, `kind='car'` | Source vehicle inventory identified; current synthetic fleet is not claimed as migrated. |
| `wp_byt_car_rental_booking_days` | individual rental days | car date-range semantics | Current enforcement implemented; historical booking rows remain source-only. |
| currency tables | supported currency catalogue | AUD presentation | 47 legacy currency rows identified; product decision remains AUD. |
| WordPress `postmeta` / theme options | custom fields, relationships, images and display settings | normalized schema + UI | Sanitized customer-facing evidence captured; provenance/licensing still requires final review. |

## Inventory evidence — completed

The reproducible P2 audit reports:

- 30 tables, 19 populated;
- 207 total `wp_posts` rows;
- 76 domain-relevant published records: 11 locations, 42 tours, 9 accommodations, 5 room types, 5 reviews and 4 car-rental records;
- 22 media attachments;
- 48 taxonomy rows and 294 term relationships;
- 4 tour schedules;
- 47 currency rows.

The generated inventory retains titles, slugs, IDs, content hashes, safe customer-facing meta, taxonomy/media references and structured counts while explicitly excluding raw record samples, customer PII and credentials.

## Inventory interpretation

The source is mixed-quality. Some records are legitimate Vietnam travel subjects; others are duplicates, placeholders, test records or contaminated/copied content. Examples include:

- valid subjects: Hanoi, Saigon, Sapa, Ha Long Bay, Tuần Châu, Đồng Hới and Hoi An–Da Nang;
- valid later tour subjects: Nha Trang Beaches, Mui Ne Beach–Phan Thiet, Phu Quoc Beaches, Cua Dai Beach–Hoi An, My Khe Beach–Da Nang, Con Dao Beach and multiple heritage/nature entries;
- clear junk/template examples: `prague-to-belgrade` with title `Nha trang`, `Tour1`, `Tour mới`, and `Best ipsum hotel`.

Nothing should be bulk-imported simply because it exists in `wp_posts`.

## Migration decision artifacts

The row-level working disposition matrix is now in `docs/P2_MIGRATION_MATRIX.md` and covers all 76 domain-relevant published records. Current working counts are 47 `rewrite`, 4 `merge`, 13 `archive`, 12 `discard`, and 0 direct `migrate` decisions. Zero direct `migrate` decisions are intentional because publish-ready parity requires factual/editorial/provenance review.

The legacy URL ledger is in `docs/P2_LEGACY_URL_MAP.md`.

The synthetic-seed reconciliation is in `docs/P2_SEED_RECONCILIATION.md`.

The fidelity gap report is in `docs/P2_FIDELITY_REPORT.md`.

## URL and taxonomy evidence

The dump contains rewrite/navigation evidence for `/locations/...`, `/tours/...`, `/hotels/...`, facility/taxonomy routes, category/tag/search routes and regional navigation groups. The P2 URL ledger maps the identified source rows to locale-prefixed canonical routes where the target is sufficiently established, while deliberately refusing to invent legacy routes that are not yet evidenced.

## Media evidence

Twenty-two source attachments were identified. Each retained media candidate still requires source path/attachment id, target asset, crop/transformation, alt-text and licensing status. Existing rebuild imagery must not be described as historically faithful until that provenance review is complete.

## Schedule evidence

The legacy dump contains four tour-schedule records, while the current rebuild seed contains 23 synthetic departures. They must remain separate until source ids, tour relationships, start dates, prices and capacities are reconciled. Capacity must never be inferred from prose.

## Sensitive data boundary

The source archive contains historical booking PII and an old production database password. Neither is a migration fixture. Historical customer names, emails, phone numbers, addresses, booking notes, passwords, secrets and auth tokens must never be copied into the public rebuild.

## Current status

**P2 archaeology and traceability foundation: complete. Canonical content migration/fidelity pass: not complete.**

The next implementation step is to reconstruct accepted canonical destinations and tours from the working matrix, then reconcile stays/cars and departures, while implementing the approved URL/media mappings alongside the content that they target. Every implementation batch must clear the repository CI gate before it is marked verified.

See `ProjectStatus.md` for the current engineering/product execution order.
