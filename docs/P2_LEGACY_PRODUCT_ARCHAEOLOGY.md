# CoHai Travel — Legacy Product Archaeology

Last reviewed: 11 September 2026.

## Purpose

The original `haibt163/travel` WordPress project is a 15+ year-old product/design archive created before modern React/Next.js tooling and before today's AI-assisted development workflow. It must **not** be treated as a production customer-data migration target.

The objective is to recover the original product, business and UX intent that still has value in 2026, separate that intent from obsolete implementation/data, and convert the surviving ideas into explicit modern requirements for CoHai Travel.

## Source interpretation

The legacy repository contains a full WordPress tree, the custom `vietaustravel` theme and the `data_vietaustravel` MySQL dump. The dump contains historical booking fields and other production-style structures, but the current project owner confirms the site was an old template-based project rather than a real customer-data system. Historical customer/booking fields therefore remain source-only evidence and are never treated as migration content.

The source archive is valuable primarily for **product intent, information architecture, taxonomy, workflow concepts, destination/tour knowledge and original media references**.

## Strong evidence of original product intent

### 1. Travel products were a connected catalog

The old site treated locations/destinations, tours, accommodation and car rental as connected parts of one travel product rather than unrelated pages. The custom search template accepts separate search modes for accommodation, car rental and tours and passes dates/location/guest information into type-specific search functions. `archive-location.php` provides a dedicated location list. This supports a 2026 model in which destinations remain hubs connected to multiple products. [Source: `wp-content/themes/vietaustravel/archive-location.php`, `custom-search-results.php`]

### 2. Booking/search was intended to be transactional, not merely editorial

The legacy search UX exposes dates, locations, guests, rooms, price ranges, ratings/stars, accommodation types, car types, sorting and tour searches. That indicates an original goal of helping the user move from inspiration to availability/filtering rather than browsing static brochures. [Source: `custom-search-results.php`]

### 3. The homepage organized journeys by travel mood/theme

`byt_home.php` separates prominent home content into Natural, Beach and UNESCO groupings, alongside neighbouring-country imagery for Thailand and Cambodia. The current rebuild's `nature`, `beach` and `unesco` chapters are therefore strongly rooted in the original information architecture rather than invented solely for the modern scaffold. [Source: `byt_home.php`]

### 4. Account and language switching were first-class concerns

The legacy header exposes AUD currency, My Account, login/register/logout, English/Vietnamese switching and site search. This is strong evidence that the original audience/product model included Australian customers, bilingual presentation and account-aware booking behaviour. [Source: `header.php`]

### 5. Australia-to-Vietnam positioning is part of the product identity

The current rebuild's Australia-facing/AUD positioning is consistent with the legacy header's AUD default and Australian/Vietnamese language controls. This should be retained as product intent, while technical implementation is modernized.

## What should be retained

| Legacy idea | 2026 treatment | Priority |
| --- | --- | --- |
| Destinations as first-class entities | KEEP; make destinations hubs for related tours/stays/cars | P0 |
| Rich tour catalogue | KEEP; migrate/source-reconstruct valid subjects and editorial concepts | P0 |
| Dated departures | KEEP; use current DB-backed availability/capacity model | P0 |
| Accommodation as first-class product | KEEP; rebuild with verified properties and finite inventory | P1 |
| Car rental as first-class product | KEEP; current date-range overlap model is the modern successor | P1 |
| Search and filtering | KEEP; modernize around actual catalog/search needs | P1 |
| Nature / Beach / UNESCO grouping | KEEP; preserve as meaningful discovery taxonomy | P0 |
| Vietnam + Cambodia + Thailand scope | KEEP where commercially appropriate; do not let old template chrome dictate modern IA | P1 |
| AUD-facing commerce | KEEP | P0 |
| English + Vietnamese | KEEP | P0 |
| Account / booking history | KEEP; current auth and My Trips model is the successor | P1 |
| Travel information/content pages | KEEP where still relevant; refresh factual details | P1 |
| Legacy media | KEEP as source material and migration candidates; optimize/relicense/replace where needed | P1 |
| Legacy URLs | KEEP as SEO/history input; map valuable routes deliberately | P1 |

## What should be modernized

### Product architecture

Replace the WordPress/ThemeForest dependency graph with the current TanStack Start + PostgreSQL/PGLite + normalized catalog/booking model. The old theme is implementation history, not a design constraint.

### Search

Do not reproduce the old query-string mechanics or UI. Preserve the underlying intent: users should be able to discover products by destination, date, product type and useful commercial attributes. The 2026 implementation should use canonical typed routes and a maintainable query layer.

### Inventory

Use the current transaction-safe tour capacity and finite stay/car inventory rules rather than legacy table shapes. Legacy `room_count` and booking-day tables remain evidence for date-based inventory semantics, not UI requirements.

### Editorial model

Preserve the destination/tour subjects that remain relevant, but rewrite contaminated, thin or demo copy. The owner's clarification means that many destination/tour/travel-information subjects can be treated as historically useful and still relevant, but publication still requires modern factual and editorial review.

### Media

Legacy media can be migrated. The working rule is now **preserve first, optimize/verify second, replace only when needed**. For each retained asset, preserve source path/attachment id where available, create a target asset mapping, verify licensing/provenance, optimize dimensions/file size, add alt text, and replace only where quality, legality or relevance requires it.

## What should be retired

- WordPress, ThemeForest and plugin-specific runtime architecture.
- Old jQuery/UI dependencies and browser-compatibility hacks.
- Visual skin assumptions, patterned backgrounds and template-specific chrome.
- Placeholder/test/demo records.
- Historical customer records and PII.
- Legacy credentials, passwords, secrets and auth tokens.
- Old pricing/schedules when not independently revalidated for current commercial use.
- Any legacy factual field that conflicts with verified current geography or product facts.

## 2026 product requirements derived from the archive

### PR-01 — Destination-led discovery

Every meaningful destination should have a canonical bilingual page that can act as a hub for relevant tours, stays and transport products.

### PR-02 — Journey products remain core

Tours/journeys are the primary commercial content object and must support editorial content, duration, chapter/taxonomy, media and dated departures.

### PR-03 — Availability is real

Published departures must expose real dates, capacity and remaining seats. Accommodation and car availability must be finite/date-aware where the source/product model requires it.

### PR-04 — Discovery supports commercial intent

Search/filtering should support the user's likely intent: destination, date, product type and meaningful pricing/capacity attributes. Avoid reproducing legacy filter complexity unless it improves current customer outcomes.

### PR-05 — Preserve the three discovery chapters

Nature, Beach/Coast and UNESCO remain first-class discovery groupings unless later product research demonstrates a stronger taxonomy.

### PR-06 — Australia-facing commerce

AUD remains the guest-facing selling currency and Australian-origin positioning remains part of the product proposition.

### PR-07 — Bilingual canonical experience

English and Vietnamese remain first-class languages with canonical locale-prefixed URLs and locale-aware metadata.

### PR-08 — Account-aware bookings

Users can authenticate, hold/book products and review their own trips. Operator visibility is separate from guest presentation.

### PR-09 — Travel information is a product surface

Destination/travel-information knowledge should not be discarded merely because it originated in WordPress. Reuse strong historical subject matter, then refresh facts and presentation for 2026.

### PR-10 — Media migration is allowed

Historical images are eligible for migration when useful and legally usable. Media migration is not restricted to replacement-only; the default should be preservation/optimization with replacement where justified.

### PR-11 — Traceable reconstruction

Every source-derived record used in the new site should retain enough provenance to answer: where did this subject come from, what was kept, what changed, and why?

### PR-12 — No blind import

The old archive is not a bulk-import source. Source records must be classified and then reconstructed using current schemas, current facts and current product standards.

## 2026 disposition model

Use three high-level labels when discussing the legacy archive with product/design stakeholders:

- **KEEP** — the original idea remains sound and should survive in the modern product.
- **MODERNIZE** — the original idea is valuable but the implementation or UX should be redesigned.
- **RETIRE** — the old implementation/data should not influence the modern product.

For actual content records, continue using the more precise migration dispositions in `docs/P2_MIGRATION_MATRIX.md`: `migrate`, `rewrite`, `merge`, `archive`, `discard`.

## Immediate implementation consequence

The next engineering work should no longer be described as a blind WordPress migration. It is **source-backed canonical reconstruction** guided by the recovered original product intent. Destinations and tours are the first implementation surfaces; stays, cars, departures, media, travel-information content and legacy URL preservation follow according to product priority.

## Evidence boundary

This document separates three things deliberately:

1. **Source-derived evidence** — observable structures and behaviours in the legacy repository/theme/dump.
2. **Owner-provided historical context** — the original project was created as a template-based site more than 15 years ago and is not being treated as a genuine customer-data archive.
3. **2026 requirements** — product decisions derived from the combination of source evidence and the current CoHai Travel architecture.

No point in this document should be interpreted as proof that every old fact is currently true, every old image is licensed, or every old product should be published unchanged.
