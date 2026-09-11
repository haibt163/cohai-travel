# Original WordPress archive — findings and reconstruction boundary

Source: `haibt163/travel` (full site dump, not a theme-only export).

This document records what the legacy project contained and what CoHai Travel should preserve, modernize or retire. The project owner has clarified that it was a template-based project created more than 15 years ago around their own travel ideas, not a live customer-data system. It is therefore treated as a **historical product/content archive**, not a customer database migration target.

## What the archive is

A complete WordPress tree containing core PHP, the custom `vietaustravel` theme, bundled default themes, and the `data_vietaustravel` SQL/content dump. The site was based on ThemeForest BookYourTravel 3.5 and adapted to a VietAus / Australia-facing travel concept.

## Theme identity

From `wp-content/themes/vietaustravel/style.css`:

| Field | Value |
| --- | --- |
| Theme Name | BookYourTravel |
| Version | 3.5 |
| Author | kajag |
| Pitch | Responsive booking portal for agencies, stays, B&Bs, villas, travel blogs |

The old theme used Open Sans + Chunkfive, `byt_home.php`, `custom-search-results.php`, dedicated accommodation/contact headers and multiple decorative skins.

The old visual chrome (gold skins, prettyPhoto, jQuery UI, patterned backgrounds and browser-era compatibility code) is **not** a visual target. The rebuild preserves useful product/domain ideas instead.

## Original product intent

The legacy implementation shows a coherent travel-commerce concept rather than a static brochure:

- destinations/locations had their own archive and detail surfaces;
- tours, accommodation and car rental were treated as connected products;
- the search system accepted destination/location, date ranges and product-specific filters;
- accommodation search supported rooms, guests, price, rating/stars and accommodation types;
- car search supported origin/destination dates, price and car types;
- tour search supported location, date, price and guests;
- the homepage organized discovery around Nature, Beach and UNESCO groupings and referenced Cambodia/Thailand as neighbours;
- AUD was exposed as the active/default currency;
- My Account, login/register/logout and English/Vietnamese switching were first-class site controls;
- site-wide search and breadcrumbs were part of navigation/discovery.

These are valuable historical product signals for CoHai Travel 2026.

## Legacy domain model

| Legacy structure | Observed meaning | Rebuild direction |
| --- | --- | --- |
| `wp_posts` (`post_type=location`) | destination/location content | `destinations`; preserve durable subject matter and source provenance, rewrite current copy as needed |
| `wp_posts` (`post_type=tour`) | tour/content records | `tours`; preserve useful travel concepts and reconstruct editorially |
| `wp_byt_tour_schedule` | scheduled departures, price, duration, capacity | `tour_departures`; reuse only after current commercial verification |
| historical booking tables | booking records | source-only evidence; never migrate customer PII |
| accommodation/vacancy structures | lodging inventory and dates | current finite-inventory model |
| car rental structures | vehicle products and booking days | current car/date-range model |
| `wp_byt_currencies` | currency catalogue including AUD | product remains AUD-facing |
| `postmeta` / theme options | relationships, display settings, custom fields | archaeology evidence, not runtime configuration |
| media attachments | product/location imagery | eligible for migration, optimization and selective replacement |

## Information architecture retained

- Places/destinations as hubs.
- Journeys/tours as the principal travel product.
- Stays and cars as first-class products.
- Nature / Beach(or Coast) / UNESCO discovery chapters.
- Contact/desk as a service surface.
- English + Vietnamese.
- AUD-facing commerce.
- Search and date/availability-driven discovery.

## What remains historically useful

The owner notes that much of the destination, tour, departure and travel-information subject matter remains relevant because the underlying places and concepts have changed little over 15 years. Therefore, age alone is **not** a discard rule.

Old factual fields that are time-sensitive — prices, departure dates, availability, hotel/property facts, opening/access details, ratings and operating claims — still require current verification.

## Media policy

Legacy media is a legitimate migration candidate. Preserve first where useful and legally usable, inspect quality, verify provenance/licensing, optimize the asset, map alt text, and replace only when the historical image is poor, unusable, inaccurate, legally unclear or inconsistent with the 2026 product.

## What should be retired

- WordPress/ThemeForest/plugin runtime architecture.
- Old jQuery/UI dependencies and IE-era compatibility code.
- Decorative skin system and obsolete presentation chrome.
- Placeholder/test/demo records.
- Historical customer records, PII and booking notes.
- Passwords, production credentials, secrets and auth tokens.
- Historical prices/dates when not independently current.

## Security note

The archive contains a historical production-style database password and customer fields. These are preserved only as evidence in the frozen source and must never be copied into CoHai Travel, fixtures, public content or documentation extracts.

## Current content position

The initial rebuild used a synthetic but plausible Indochina seed aligned to the old information architecture: 10 places, 9 journeys, 6 stays, 4 cars and 23 dated departures.

The synthetic seed remains useful as scaffolding but is not the historical source of truth. Accepted legacy subjects will be reconstructed into the current schema; intentionally new 2026 products may also remain when they improve the product and are labelled as modern additions rather than historical migrations.

See `docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md`, `docs/CONTENT_ARCHAEOLOGY.md` and `ProjectStatus.md` for the current reconstruction approach.
