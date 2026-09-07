# Original WordPress archive — findings and reconstruction boundary

Source: `haibt163/travel` (full site dump, not a theme-only export).

This note records what the legacy site contained and what the rebuild deliberately does or does not preserve. It is **not** a how-to for running the old site.

## What the dump is

A complete WordPress tree containing core PHP, the custom `vietaustravel` theme, bundled default themes, and the `data_vietaustravel` SQL/content dump. The site was a ThemeForest BookYourTravel 3.5 booking portal, restyled and populated as VietAus / Vietnam-for-Australia inventory.

## Theme identity

From `wp-content/themes/vietaustravel/style.css`:

| Field | Value |
| --- | --- |
| Theme Name | BookYourTravel |
| Version | 3.5 |
| Author | kajag |
| Pitch | Responsive booking portal for agencies, stays, B&Bs, villas, travel blogs |

Skins shipped as `css/theme-{black,blue,navy,orange,pink,purple,strawberry,yellow}.css`; the site used Open Sans + Chunkfive, `byt_home.php`, `custom-search-results.php`, and separate accommodation/contact headers.

The old chrome (gold skins, prettyPhoto, jQuery UI, patterned backgrounds) is **not** a visual target. The rebuild preserves useful inventory/domain concepts rather than the 2013 skin.

## Legacy domain model

| Legacy structure | Observed meaning | Rebuild direction |
| --- | --- | --- |
| `wp_posts` (`post_type=location`) | destination/location content | `destinations` |
| `wp_posts` (`post_type=tour`) | tour/content records | `tours` + chapter |
| `wp_byt_tour_schedule` | scheduled departures, price, duration, capacity | `tour_departures` |
| `wp_byt_tour_booking` | tour bookings linked to schedule | shared `bookings`, `kind='tour'` |
| `wp_byt_bookings` | accommodation-style bookings, including `room_count` | shared stay bookings + `inventory_units` |
| `wp_byt_vacancies` | per-day accommodation vacancy, including `room_count` | finite stay inventory/date availability |
| `wp_byt_vacancy_bookings` | rooms consumed by booking/vacancy | normalized booking inventory |
| `wp_byt_car_rental_bookings` | car rental bookings | shared `bookings`, `kind='car'` |
| `wp_byt_car_rental_booking_days` | individual rental days | current date-range overlap model |
| `wp_byt_currencies` | currency catalogue including AUD | current product intentionally presents AUD |
| `postmeta` / theme options | relationships, images, display settings and custom fields | migration evidence, not runtime configuration |

## Inventory evidence and current interpretation

The legacy accommodation model explicitly contains `room_count`, and vacancy rows model room counts by day. This is strong evidence that accommodation inventory was finite and date-based. The rebuild therefore implements `inventory_unit_count` on stays and `inventory_units` on bookings, with overlap checks and transactional locking.

The legacy car model stores individual booking days. The rebuild intentionally collapses this into date-range overlap semantics because the new product uses `start_date` + duration.

The current rebuild is conservative where the source does not establish a fleet/room quantity: Angkor Garden defaults to one inventory unit and cars default to one concurrently bookable vehicle. Multi-room selection is not yet exposed in the guest UI.

## Information architecture retained

- Places/destinations act as hubs for tours, stays and cars.
- Three journey moods are represented as `nature`, `beach`, and `unesco`.
- Stays and cars remain first-class surfaces, not deferred add-ons.
- Contact/desk remains a first-class page.
- English + Vietnamese is retained as the product language set.
- AUD is the guest-facing selling currency.

## Legacy routes and taxonomy

The dump contains rewrite/navigation evidence for `/locations/...`, `/tours/...`, `/hotels/...`, facility/taxonomy routes, category/tag/search routes, and navigation groupings such as Southern Tours, Northern Tours, Mekong Tours, Cruise tours, and special regional tours.

**These routes are not yet fully mapped into the rebuild.** Preserving or deliberately redirecting valuable legacy URLs is part of the outstanding content/SEO fidelity work and must not be assumed complete merely because equivalent UI pages exist.

## What was deliberately dropped

- ThemeForest skins, prettyPhoto, home-slider CPT and other obsolete presentation chrome.
- Vacancy behaviour that cannot produce an honest remaining-availability figure.
- Headless WordPress/WP REST as the runtime CMS.
- Reuse of the legacy production database credentials.

**Security note:** the archive contains a production database password. Rotate that credential on the old host. It must never be copied into the rebuild.

## Current content position

The initial rebuild used a synthetic but plausible Indochina seed aligned to the old IA: 10 places, 9 journeys, 6 stays, 4 cars and 23 dated departures from October 2026.

That seed is useful as an application fixture, but it is **not the completed historical content migration**. The next content pass must parse the legacy dump row-by-row, classify genuine vs generic/demo records, preserve source IDs and relationships, map media, and explicitly mark every record as `migrate`, `rewrite`, `merge`, `archive` or `discard`.

See `docs/CONTENT_ARCHAEOLOGY.md` for the detailed migration/fidelity ledger and `ProjectStatus.md` for the active implementation roadmap.
