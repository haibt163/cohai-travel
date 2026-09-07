# Content archaeology and migration map

## Source of truth reviewed

The legacy source repository is `haibt163/travel`. Its root contains a WordPress/MySQL dump named `data_vietaustravel`; the dump is a 5.5-era MySQL export of the old `vietaustravel` site. The legacy configuration identifies the Book Your Travel theme and the site-specific `vietaustravel` settings.

This document records source-derived findings only. It is intentionally not a claim that every legacy record has already been migrated.

## Legacy domain model found in the dump

| Legacy structure | Observed meaning | Current model | Migration decision |
| --- | --- | --- | --- |
| `wp_posts` (`post_type=location`) | destination/location content | `destinations` | Map published location records to canonical destinations after editorial review. |
| `wp_posts` (`post_type=tour`) | tour/content records | `tours` | Map published tour records to canonical tours; preserve slug where safe. |
| `wp_byt_tour_schedule` | scheduled tour departures, price, duration, capacity | `tour_departures` | Direct conceptual mapping; current model should retain date, price and max people. |
| `wp_byt_tour_booking` | tour bookings linked to schedule | `bookings` with `kind='tour'` | Normalize into one booking table; preserve departure relationship. |
| `wp_byt_bookings` | accommodation-style bookings; includes `room_count` | `bookings` with `kind='stay'` | Current `inventory_units` is the normalized successor of the legacy room-count concept. |
| `wp_byt_vacancies` | per-day accommodation vacancy with `room_count` | stay inventory model | Legacy evidence supports date-based room inventory; current implementation uses finite inventory plus overlap checks. |
| `wp_byt_vacancy_bookings` | rooms consumed by a booking/vacancy | `bookings.inventory_units` | Normalize into the booking row rather than retaining a separate junction table. |
| `wp_byt_car_rental_bookings` | car rental booking | `bookings` with `kind='car'` | Normalize into the shared booking table. |
| `wp_byt_car_rental_booking_days` | individual booked rental dates | stay/car date-range semantics | Current car overlap checks replace the legacy day rows for availability enforcement. |
| `wp_byt_currencies` | currency catalogue | current AUD presentation | Do not blindly migrate all currencies; retain only currencies intentionally supported by the rebuilt product. |
| WordPress `postmeta` / theme options | relationships, images, display settings, custom fields | normalized catalog schema + UI | Treat as evidence for migration mapping, not as runtime application configuration. |

## Important legacy inventory evidence

The legacy booking table explicitly contains `room_count`, and the vacancy tables model `room_count` by day. This is stronger evidence for finite accommodation inventory than the current UI alone provides. The rebuilt model therefore uses `inventory_unit_count` on stays and `inventory_units` on bookings rather than treating every stay as infinitely available.

The legacy car model also stores booking days separately. The rebuilt model intentionally collapses this into a date-range overlap check because the new booking domain uses `start_date + nights`.

## Legacy URL and taxonomy evidence

The dump contains WordPress rewrite rules for:

- `/locations/...`
- `/tours/...`
- `/hotels/...`
- facility/taxonomy routes
- category/tag/search routes

It also contains navigation entries such as Southern Tours, Northern Tours, Mekong Tours, Cruise tours, and special Thailand/Cambodia/Lao/Singapore tours. These are evidence that the old site had more editorial/navigation taxonomy than the current normalized catalog necessarily exposes.

The rebuilt site must therefore treat route preservation as a migration decision, not merely a UI routing exercise.

## Known legacy content examples

The dump contains published location records including Hanoi, Saigon, Sapa, Ha Long Bay, Tuần Châu, Đồng Hới and Hoi An–Da Nang, as well as many older/general-purpose records. It also contains later tour records such as Nha Trang Beaches, Mui Ne Beach–Phan Thiet, Phu Quoc Beaches, Cua Dai Beach–Hoi An, My Khe Beach–Da Nang, Con Dao Beach and multiple UNESCO/nature entries.

Some legacy records are clearly generic/demo/template material, while others are genuine Vietnamese destination content. They must not be bulk-imported without editorial classification.

## Fidelity rules going forward

1. Preserve original slug/title/content/media references before rewriting.
2. Separate `migrate`, `rewrite`, `merge`, `archive`, and `discard` decisions.
3. Never infer a booking/inventory rule from prose when the legacy database contains a structured field.
4. Keep legacy IDs in the migration mapping even when the new canonical IDs are different.
5. Do not treat WordPress plugin/theme settings as product requirements unless they correspond to an observed customer-facing behavior.
6. Record every intentional omission so the rebuilt site can be audited against the original.

## Current status

The inventory and booking work now reflects the strongest structured legacy evidence: finite rooms, date-based availability, scheduled tours and capacity. A complete content-by-content fidelity matrix still requires parsing all published `wp_posts`, `wp_postmeta`, taxonomy relationships and media references into a machine-readable migration report. That remains a separate content migration pass rather than an assumption hidden inside the UI rebuild.
