# Original WordPress archive — findings

Source: [`haibt163/travel`](https://github.com/haibt163/travel) (full site dump, not a theme-only export).

This note is the archaeology that the CoHai rebuild is based on. It is **not** a how-to for running the old site.

## What the dump is

A complete WordPress tree:

- Core PHP (`wp-admin`, `wp-includes`, `wp-login.php`, …)
- `wp-config.php` pointed at a live database named in the `funnyhou_tour` family
- `data_vietaustravel` — ~845 KB SQL/content dump
- Themes under `wp-content/themes/`:
  - `vietaustravel` — the live child/customisation
  - bundled defaults: Twenty Twelve / Thirteen / Fourteen
- `vietaustravel.rar` sitting next to the unpacked theme (~4.5 MB)

The site was a **ThemeForest BookYourTravel 3.5** booking portal, restyled and filled as VietAus / Vietnam-for-Australia inventory.

## Theme identity

From `wp-content/themes/vietaustravel/style.css`:

| Field | Value |
| --- | --- |
| Theme Name | BookYourTravel |
| Version | 3.5 |
| Author | kajag |
| Pitch | Responsive booking portal for agencies, stays, B&Bs, villas, travel blogs |

Skins shipped as `css/theme-{black,blue,navy,orange,pink,purple,strawberry,yellow}.css`. Fonts were Open Sans + Chunkfive. Home template: `byt_home.php`. Search: `custom-search-results.php`. Separate headers for accommodation and contact.

That chrome (gold skins, prettyPhoto, jQuery UI, patterned backgrounds) is **explicitly not** what CoHai copies. The rebuild keeps the *inventory shapes*, not the 2013 skin.

## Custom post types (the real IA)

`includes/theme_post_types.php` loads:

| CPT / object | Role on the old site | CoHai table |
| --- | --- |
| `location` | Destination / place | `destinations` |
| `tour` | Packaged journey + `tour_type` taxonomy | `tours` + `chapter` |
| `accommodation` + `room_type` | Stays, facilities taxonomy | `stays` (flattened) |
| `car_rental` + `car_type` | Cars with pickup / dropoff locations | `cars` |
| `review` | Reviews attached to a post | not in v1 |
| `sequence-slides` | Home slider | replaced by editorial hero |

Archive page sizes were Options Framework knobs (`tours_archive_posts_per_page`, etc.), default 12.

## BookYourTravel commerce model (old)

The plugin/theme created extra MySQL tables and booked through **vacancies**:

- Tour / accommodation availability rows per day
- `BYT_BOOKINGS_TABLE` joined to vacancy bookings
- `BYT_CURRENCIES_TABLE` seeded with a world list that already included **AUD**, VND, USD, THB, EUR, …
- `list_user_bookings($user_id)` — per-user booking list, accommodation-centric

CoHai does **not** import those vacancy tables. v1 sells named `tour_departures` (a start date, a price, a cap) and simple night/day holds for stays and cars.

## Information architecture we kept

From templates, options, and the VietAus positioning:

- **Places first** — locations carry country and act as hubs for tours / stays / cars
- **Three journey moods** — the old marketing grouped nature, coast, and heritage/UNESCO. CoHai stores that as `tours.chapter`: `nature` | `beach` | `unesco`
- **Stays and cars on the same site** as tours, not a later phase
- **Contact / desk** as a first-class page (`header-contact.php` existed for a reason)
- **Bilingual intent** — the operator is Vietnam-based, selling to Australia. The dump is English-primary; CoHai stores EN + VN on every catalog row
- **AUD as the selling currency** — present in BYT’s currency table; chosen as the only price the guest sees

## What we deliberately dropped

- ThemeForest skins, prettyPhoto, home slider CPT
- Hop-on / mystery inventory (vacancies with no honest remaining-seat number)
- Headless WordPress or WP REST as the runtime CMS
- Reusing the live DB credentials in `wp-config.php`

**Ops note:** the dump contains a production database password. Rotate that credential on the old host. It is not used by CoHai and must not be copied here.

## Content strategy for v1

The 845 KB dump was not parsed row-by-row inside the builder. The seed in `migrations/0003_seed.sql` is an **authentic Indochina catalog written to the old IA**:

- 10 places (Hanoi, Ha Long, Hoi An, Hue, Sapa, Mekong, Phu Quoc, Nha Trang, Siem Reap, Bangkok)
- 9 journeys across the three chapters
- 6 stays, 4 cars
- 23 dated departures from October 2026, priced in AUD

A later phase can map `data_vietaustravel` posts onto these tables if the original copy is still wanted. Until then the seed is the source of truth.
