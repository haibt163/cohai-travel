# Content archaeology and migration map

Last reviewed: 8 September 2026.

## Purpose

This document is the source-fidelity ledger for reconstructing the legacy VietAus WordPress site without silently inventing or losing content. It records source-derived findings and the migration rules. It does **not** claim that the legacy records have already been migrated.

## Source of truth reviewed

The legacy source repository is `haibt163/travel`. Its root contains the `data_vietaustravel` MySQL/content dump and the old `vietaustravel` WordPress tree. The rebuild repository is `haibt163/cohai-travel`; the legacy repository remains frozen.

## Legacy domain model found

| Legacy structure | Observed meaning | Current model | Migration status |
| --- | --- | --- | --- |
| `wp_posts` (`post_type=location`) | destination/location content | `destinations` | Mapping rule established; row-by-row migration outstanding. |
| `wp_posts` (`post_type=tour`) | tour/content records | `tours` | Mapping rule established; row-by-row migration outstanding. |
| `wp_byt_tour_schedule` | scheduled departures, price, duration, capacity | `tour_departures` | Conceptual mapping established; source reconciliation outstanding. |
| `wp_byt_tour_booking` | tour bookings linked to schedule | shared `bookings` | Conceptual mapping established; historical booking migration not yet performed. |
| `wp_byt_bookings` | accommodation bookings; includes `room_count` | stay bookings + `inventory_units` | Inventory semantics implemented; historical records not migrated. |
| `wp_byt_vacancies` | per-day accommodation vacancy with `room_count` | finite stay inventory | Date-range enforcement implemented; source-by-source migration outstanding. |
| `wp_byt_vacancy_bookings` | rooms consumed by a booking/vacancy | booking inventory | Normalized successor implemented; historical mapping outstanding. |
| `wp_byt_car_rental_bookings` | car rental booking | shared `bookings`, `kind='car'` | Conceptual mapping established; historical migration outstanding. |
| `wp_byt_car_rental_booking_days` | individual rental days | car date-range semantics | Current enforcement implemented; historical mapping outstanding. |
| currency tables | supported currency catalogue | AUD presentation | Product decision is AUD; full legacy currency catalogue is not being blindly imported. |
| WordPress `postmeta` / theme options | custom fields, relationships, images and display settings | normalized schema + UI | Evidence captured; complete extraction/classification outstanding. |

## Inventory evidence

The legacy accommodation structures explicitly contain `room_count`, including in vacancy records. This is the strongest structured evidence for finite, date-based room inventory. The rebuild therefore uses `inventory_unit_count` on stays and `inventory_units` on bookings, with half-open date ranges and transactional locking.

The legacy car model stores booking days separately. The rebuild intentionally uses date-range overlap semantics instead of retaining one row per day.

Current conservative defaults where the source does not establish an authoritative quantity:

- Angkor Garden: 1 unit.
- Cars: 1 concurrently bookable vehicle per car listing.

The guest UI does not yet expose multiple-room/multiple-unit quantity selection. That remains a product-completion item in the engineering roadmap.

## Legacy URL and taxonomy evidence

The dump contains rewrite/navigation evidence for:

- `/locations/...`
- `/tours/...`
- `/hotels/...`
- facility/taxonomy routes
- category/tag/search routes
- navigation groupings including Southern Tours, Northern Tours, Mekong Tours, Cruise tours and special regional tours

**Migration status: outstanding.** Equivalent UI routes in the rebuild are not sufficient evidence that legacy URL equity has been preserved. The final migration must produce an explicit legacy URL → canonical URL/redirect decision.

## Known legacy content examples

The dump includes genuine destination records such as Hanoi, Saigon, Sapa, Ha Long Bay, Tuần Châu, Đồng Hới and Hoi An–Da Nang, as well as later tour records such as Nha Trang Beaches, Mui Ne Beach–Phan Thiet, Phu Quoc Beaches, Cua Dai Beach–Hoi An, My Khe Beach–Da Nang, Con Dao Beach and multiple UNESCO/nature entries.

It also contains generic/demo/template material. Nothing should be bulk-imported solely because it exists in `wp_posts`.

## Required migration artifacts — still outstanding

### 1. Machine-readable source inventory

Extract, at minimum:

- published posts and post types;
- titles, slugs, dates and status;
- `postmeta` relevant to customer-facing content and booking fields;
- taxonomies and term relationships;
- media/attachment references and URLs;
- destination/tour/stay/car relationships;
- structured booking/departure/inventory records;
- legacy IDs for every retained source record.

### 2. Migration decision matrix

Every relevant legacy record must receive one explicit disposition:

- `migrate` — preserve substantially as canonical content;
- `rewrite` — retain subject/content intent but rewrite editorially;
- `merge` — combine with another canonical record;
- `archive` — retain for historical/reference purposes but do not publish;
- `discard` — intentionally exclude, with a reason.

### 3. URL mapping

For each important legacy URL, record the canonical replacement, redirect target, or intentional retirement. Pay particular attention to locations, tours, accommodation and taxonomy routes.

### 4. Media mapping

For each retained image/media reference, record its source, licensing/ownership status, target asset and alt-text requirement. Provisional SVG/stock imagery in the rebuild must not be mistaken for historical media fidelity.

### 5. Fidelity report

The completed pass must quantify and explain what was preserved, rewritten, merged, archived and discarded, including any gaps where the source is ambiguous.

## Fidelity rules

1. Preserve original slug/title/content/media references before rewriting.
2. Separate `migrate`, `rewrite`, `merge`, `archive` and `discard` decisions.
3. Never infer a booking/inventory rule from prose when the legacy database contains a structured field.
4. Keep legacy IDs in the migration mapping even when canonical IDs change.
5. Treat theme/plugin settings as evidence, not automatic product requirements.
6. Record every intentional omission.
7. Do not expose legacy credentials or production secrets in the rebuild.
8. Do not call the synthetic seed a completed migration.

## Current status

**Archaeology foundation: complete. Content migration/fidelity pass: not complete.**

The dump has established the legacy domain model, inventory evidence, major URL/taxonomy families and representative content. The next substantive pass is the actual machine-readable extraction and migration matrix. That work should occur before declaring content parity or SEO URL preservation complete.

See `ProjectStatus.md` for the engineering/product execution order.
