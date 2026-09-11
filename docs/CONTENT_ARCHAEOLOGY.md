# Content archaeology and migration map

Last reviewed: 11 September 2026.

## Purpose

This document is the source-fidelity ledger for reconstructing the legacy VietAus WordPress project without silently inventing or losing useful product knowledge. The legacy project is a 15+ year-old template-based site built around the owner's travel ideas; it is **not** being treated as a live customer-data archive.

The objective is to preserve valuable travel/product intent and historically useful subject matter while retiring obsolete WordPress implementation, contaminated/demo records, outdated commercial values and sensitive customer data.

## Source of truth reviewed

The legacy source repository is `haibt163/travel`. Its root contains the `data_vietaustravel` MySQL/content dump and the old `vietaustravel` WordPress tree. The rebuild repository is `haibt163/cohai-travel`; the legacy repository remains frozen/source-only.

## Legacy domain model found

| Legacy structure | Observed meaning | Current model | Migration status |
| --- | --- | --- | --- |
| `wp_posts` (`post_type=location`) | destination/location content | `destinations` | Valuable subject matter can be retained; row-level source/fact/editorial review remains required. |
| `wp_posts` (`post_type=tour`) | tour/content records | `tours` | Many travel subjects remain useful; reconstruct rather than blindly import. |
| `wp_byt_tour_schedule` | scheduled departures, price, duration, capacity | `tour_departures` | Historical evidence and optional source for current schedules; current dates/prices must be verified. |
| `wp_byt_tour_booking` | historical tour bookings | shared `bookings` | Historical customer data is never migrated. |
| `wp_byt_bookings` | accommodation bookings; includes `room_count` | stay bookings + `inventory_units` | Historical records are source-only; inventory semantics remain useful. |
| `wp_byt_vacancies` | per-day accommodation vacancy with `room_count` | finite stay inventory | Date-range concept retained; historical rows are not customer-facing data. |
| `wp_byt_vacancy_bookings` | rooms consumed by a booking/vacancy | booking inventory | Structural evidence retained; historical customer linkage excluded. |
| `wp_byt_car_rental_bookings` | car rental booking | shared `bookings`, `kind='car'` | Business concept retained; historical customer records excluded. |
| `wp_byt_car_rental_booking_days` | individual rental days | car date-range semantics | Concept retained; current model is the modern implementation. |
| currency tables | supported currency catalogue | AUD presentation | Historical evidence only; current product intentionally presents AUD. |
| WordPress `postmeta` / theme options | custom fields, relationships, images and display settings | normalized schema + archaeology map | Use as evidence of original intent; do not clone old runtime configuration. |
| media attachments | destination/product imagery | `public/media` or future media store | Eligible for migration, optimization and selective replacement. |

## Original product/UX intent

The old theme provides strong evidence of a coherent travel-commerce concept:

- destinations/locations were a first-class browsing surface;
- tours, accommodation and car rental were searched as connected products;
- search accepted dates, locations, guests, rooms and product-specific filters;
- prices were central to discovery;
- ratings/stars and accommodation/car types were filter dimensions;
- the homepage grouped travel content into Nature, Beach and UNESCO sections;
- AUD was visible as the active/default currency;
- account registration/login/logout and My Account were first-class flows;
- English/Vietnamese switching and site search were visible site-wide;
- Thailand and Cambodia were treated as neighbouring destinations within the broader product proposition.

These patterns are historical product signals. CoHai Travel should preserve the useful intent while redesigning the implementation and UX for 2026.

## Information architecture retained

- Places/destinations act as hubs for tours, stays and cars.
- Three discovery chapters remain `nature`, `beach`/`coast`, and `unesco`.
- Stays and cars remain first-class product types.
- Contact/desk remains a first-class service surface.
- English + Vietnamese remain the product languages.
- AUD remains the guest-facing selling currency.
- Search/discovery should connect inspiration to dates, availability and booking intent.

## Content interpretation

The owner's historical clarification materially changes the migration posture: many destinations, tours, departures and travel-information subjects were authored as product/content ideas and remain broadly relevant because the underlying places and travel concepts have not materially changed. They should therefore be treated as **high-value source material**, not as obsolete by default.

However, the following still require independent review before publication: current prices, departure dates, operating claims, opening/access information, hotel/property facts, ratings, licensing/provenance, and any location details that conflict with current geography.

## Legacy URL and taxonomy evidence

The dump contains rewrite/navigation evidence for `/locations/...`, `/tours/...`, `/hotels/...`, facility/taxonomy routes, category/tag/search routes, and regional groupings including Southern Tours, Northern Tours, Mekong Tours, Cruise tours and special regional tours.

Legacy URLs remain valuable historical SEO/product evidence. They should be preserved through deliberate redirects only where a verified canonical target exists. Equivalent UI pages alone are not proof that URL equity has been preserved.

## Media policy

The 22 legacy media attachments are legitimate migration candidates. The default sequence is:

`preserve → inspect → verify provenance/licensing → optimize → map alt text → publish when appropriate → replace only when justified`

Replacement is appropriate where the historical asset is low quality, legally unusable, inaccurate, visually inconsistent with the modern product, or materially outdated. Otherwise, retaining the original image can preserve the site's historical visual/content identity.

## What should be deliberately retired

- WordPress, ThemeForest and plugin-specific runtime architecture.
- Old jQuery/UI dependencies and browser-compatibility hacks.
- Decorative template skins and obsolete visual chrome.
- Placeholder/test/demo records.
- Historical customer records and PII.
- Legacy passwords, secrets, credentials and auth tokens.
- Old commercial values when not independently current.
- Any factual content that cannot survive modern verification.

## Required migration artifacts

1. Machine-readable source inventory with source ids, types, titles, slugs, dates/status, relevant metadata, taxonomy relationships and media references.
2. Product archaeology ledger using `KEEP`, `MODERNIZE`, `RETIRE`.
3. Record-level migration matrix using `migrate`, `rewrite`, `merge`, `archive`, `discard`.
4. Legacy URL mapping to canonical targets or explicit retirement decisions.
5. Media mapping with source path/id, target asset, provenance/licensing, optimization and alt text.
6. Seed reconciliation showing which current records are source-backed, rewritten, replacements or intentionally modern additions.
7. Fidelity report quantifying retained, modernized, merged, archived and retired content.

## Fidelity rules

1. Preserve original subject/slug/title/media references before rewriting.
2. Distinguish product intent from obsolete implementation.
3. Prefer keeping useful destination/tour/travel-information ideas when the subject remains relevant.
4. Treat current prices/dates/availability as time-sensitive data requiring verification.
5. Keep legacy IDs in the migration mapping even when canonical IDs change.
6. Migrate legacy media when useful and legally usable; do not replace by age alone.
7. Record every intentional omission.
8. Never expose legacy credentials, customer PII or production secrets in the rebuild.
9. Never call the synthetic seed a completed historical migration.

## Current status

**Legacy archaeology: complete enough to guide implementation. Source-backed reconstruction: next.**

The archive is now classified as a valuable historical product/content source rather than a database to clone. The next implementation work should use the recovered original intent to reconstruct destinations, tours and travel information first, then selectively reconstruct stays/cars/departures and migrate useful media, while maintaining current CoHai standards for facts, availability, security and editorial quality.

See `docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md`, `docs/P2_MIGRATION_EXECUTION.md` and `ProjectStatus.md` for the implementation order.
