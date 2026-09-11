# CoHai Travel — P2 Legacy URL Map

Last reviewed: 11 September 2026.

## Status

This is the **P2.16 URL mapping ledger** derived from the legacy route evidence and the row-level P2 migration matrix. The new application's canonical dynamic routes are verified from the current route files: destinations use `/{locale}/destinations/{slug}`, tours use `/{locale}/tours/{slug}`, stays use `/{locale}/stays/{slug}`, and cars use `/{locale}/cars/{slug}`.

The legacy documentation explicitly confirms high-value `/locations/...`, `/tours/...`, and `/hotels/...` families and states that the complete legacy route map was previously outstanding.

Legacy URL families for car rental, room types, and reviews are **not claimed as verified here**; those rows are flagged for source-routing verification rather than invented redirects.

## Action semantics

`redirect_301` = consolidate a duplicate/locality into its canonical replacement.

`canonical_replacement` = preserve the legacy subject by mapping it to a locale-prefixed canonical route after the target is actually created/verified.

`noindex_retirement` = do not create a public replacement; retire the legacy path from search visibility rather than inventing content.

`archive_410` = reserved for legacy content that should be explicitly gone; not currently assigned where evidence does not justify it.

## Row-level map

| Legacy ID | Type | Legacy path | Disposition | Canonical path | URL action | Notes |
| ---: | --- | --- | --- | --- | --- | --- |
| 170 | location | /locations/cu-chi-tunnel | rewrite | /{locale}/destinations/cu-chi-tunnel | canonical_replacement |  |
| 206 | location | /locations/hanoi | rewrite | /{locale}/destinations/hanoi | canonical_replacement |  |
| 221 | location | /locations/mekond-delta | rewrite | /{locale}/destinations/mekong | canonical_replacement |  |
| 223 | location | /locations/hoi-an-da-nang | rewrite | /{locale}/destinations/hoi-an | canonical_replacement |  |
| 507 | location | /locations/sai-gon | rewrite | /{locale}/destinations/ho-chi-minh-city | canonical_replacement |  |
| 536 | location | /locations/dong-hoi | rewrite | /{locale}/destinations/dong-hoi | canonical_replacement |  |
| 579 | location | /locations/halong-bay | merge | /{locale}/destinations/ha-long | redirect_301 |  |
| 580 | location | /locations/tuan-chau | merge | /{locale}/destinations/ha-long | redirect_301 |  |
| 581 | location | /locations/sapa | rewrite | /{locale}/destinations/sapa | canonical_replacement |  |
| 584 | location | /locations/cu-chi-tunnel-2 | merge | /{locale}/destinations/cu-chi-tunnel | redirect_301 |  |
| 605 | location | /locations/quang-binh | rewrite | /{locale}/destinations/quang-binh | canonical_replacement |  |
| 503 | tour | /tours/prague-to-belgrade | discard | — | noindex_retirement |  |
| 533 | tour | /tours/phong-nha-caves | merge | /{locale}/tours/phong-nha-cave | redirect_301 |  |
| 539 | tour | /tours/phong-nha-cave | rewrite | /{locale}/tours/phong-nha-cave | canonical_replacement |  |
| 544 | tour | /tours/tour-moi-cha-toure | discard | — | noindex_retirement |  |
| 570 | tour | /tours/northern-mountains | rewrite | /{locale}/tours/sapa-terraces | canonical_replacement |  |
| 566 | tour | /tours/thien-duong-cave | rewrite | /{locale}/tours/thien-duong-cave | canonical_replacement |  |
| 572 | tour | /tours/cuc-phuong-national-park | rewrite | /{locale}/tours/cuc-phuong-national-park | canonical_replacement |  |
| 574 | tour | /tours/cat-tien-national-park | rewrite | /{locale}/tours/cat-tien-national-park | canonical_replacement |  |
| 589 | tour | /tours/dien-bien-phu | rewrite | /{locale}/tours/dien-bien-phu | canonical_replacement |  |
| 607 | tour | /tours/tour1 | discard | — | noindex_retirement |  |
| 610 | tour | /tours/vinh-ha-long | discard | — | noindex_retirement |  |
| 611 | tour | /tours/ha-noi | discard | — | noindex_retirement |  |
| 630 | tour | /tours/tour-moi | discard | — | noindex_retirement |  |
| 700 | tour | /tours/nha-trang-beaches | rewrite | /{locale}/tours/nha-trang-beaches | canonical_replacement |  |
| 701 | tour | /tours/mui-ne-beach-phan-thiet | rewrite | /{locale}/tours/mui-ne-beach-phan-thiet | canonical_replacement |  |
| 702 | tour | /tours/phu-quoc-beaches-sao-beach-dai-beach | rewrite | /{locale}/tours/phuquoc-drift | canonical_replacement |  |
| 703 | tour | /tours/cua-dai-beach-hoi-an | rewrite | /{locale}/tours/cua-dai-beach-hoi-an | canonical_replacement |  |
| 704 | tour | /tours/my-khe-beach-da-nang | rewrite | /{locale}/tours/my-khe-beach-da-nang | canonical_replacement |  |
| 705 | tour | /tours/con-dao-beach | rewrite | /{locale}/tours/con-dao-beach | canonical_replacement |  |
| 706 | tour | /tours/cat-ba-beach-hai-phong | rewrite | /{locale}/tours/cat-ba-beach-hai-phong | canonical_replacement |  |
| 707 | tour | /tours/halong-tuan-chau-island | rewrite | /{locale}/tours/ha-long-overnight-junk | canonical_replacement |  |
| 708 | tour | /tours/vung-tau-beaches-ba-ria | rewrite | /{locale}/tours/vung-tau-beaches | canonical_replacement |  |
| 709 | tour | /tours/lang-co-beach-hue | rewrite | /{locale}/tours/lang-co-beach-hue | canonical_replacement |  |
| 710 | tour | /tours/nhat-le-beach-quang-binh | rewrite | /{locale}/tours/nhat-le-beach-quang-binh | canonical_replacement |  |
| 711 | tour | /tours/cua-tung-beach-quang-tri | rewrite | /{locale}/tours/cua-tung-beach-quang-tri | canonical_replacement |  |
| 712 | tour | /tours/cua-lo-beach-nghe-an | rewrite | /{locale}/tours/cua-lo-beach-nghe-an | canonical_replacement |  |
| 713 | tour | /tours/ha-noi-2 | rewrite | /{locale}/tours/hanoi-heritage | canonical_replacement |  |
| 714 | tour | /tours/khanh-hoa-beaches-doc-let-dai-lanh | rewrite | /{locale}/tours/khanh-hoa-beaches | canonical_replacement |  |
| 716 | tour | /tours/central-sector-of-the-imperial-citadel-of-thang-long-hanoi-2010 | rewrite | /{locale}/tours/thang-long-heritage | canonical_replacement |  |
| 717 | tour | /tours/citadel-of-ho-dynasty-2011 | rewrite | /{locale}/tours/ho-dynasty-citadel | canonical_replacement |  |
| 718 | tour | /tours/complex-of-hue-monuments-1993 | rewrite | /{locale}/tours/hue-heritage | canonical_replacement |  |
| 719 | tour | /tours/hoi-an-ancient-town-1999 | rewrite | /{locale}/tours/hoi-an-heritage | canonical_replacement |  |
| 720 | tour | /tours/my-son-sanctuary-1999 | rewrite | /{locale}/tours/my-son-sanctuary | canonical_replacement |  |
| 721 | tour | /tours/ha-long-1994 | rewrite | /{locale}/tours/ha-long-heritage | canonical_replacement |  |
| 722 | tour | /tours/phong-nha-ke-bang-national2003 | rewrite | /{locale}/tours/phong-nha-heritage | canonical_replacement |  |
| 723 | tour | /tours/ba-be-lake-1997 | rewrite | /{locale}/tours/ba-be-lake | canonical_replacement |  |
| 724 | tour | /tours/the-area-of-old-carved-stone-in-sapa-1997 | rewrite | /{locale}/tours/sapa-stone-carvings | canonical_replacement |  |
| 725 | tour | /tours/huong-son-complex-of-natural-beauty-and-historical-monuments-1991 | rewrite | /{locale}/tours/huong-son-heritage | canonical_replacement |  |
| 726 | tour | /tours/cat-tien-national-park-2006 | rewrite | /{locale}/tours/cat-tien-heritage | canonical_replacement |  |
| 727 | tour | /tours/con-moong-cave-2006 | rewrite | /{locale}/tours/con-moong-cave | canonical_replacement |  |
| 728 | tour | /tours/trang-an-scenic-landscape-complex-2011 | rewrite | /{locale}/tours/trang-an-heritage | canonical_replacement |  |
| 729 | tour | /tours/cat-ba-archipelago-2011 | rewrite | /{locale}/tours/cat-ba-archipelago | canonical_replacement |  |
| 175 | accommodation | /hotels/best-ipsum-hotel | discard | — | noindex_retirement |  |
| 205 | accommodation | /hotels/tropicana-hotel | archive | /{locale}/stays/tropicana_hotel | canonical_replacement |  |
| 214 | accommodation | /hotels/paradise-hotel | archive | /{locale}/stays/paradise_hotel | canonical_replacement |  |
| 227 | accommodation | /hotels/adriatic-hotel | archive | /{locale}/stays/adriatic_hotel | canonical_replacement |  |
| 252 | accommodation | /hotels/spa-resort-hotel | archive | /{locale}/stays/spa_resort_hotel | canonical_replacement |  |
| 254 | accommodation | /hotels/trend-hotel | archive | /{locale}/stays/trend_hotel | canonical_replacement |  |
| 256 | accommodation | /hotels/apartments-martha | archive | /{locale}/stays/apartments_martha | canonical_replacement |  |
| 470 | accommodation | /hotels/villa-julia | archive | /{locale}/stays/villa_julia | canonical_replacement |  |
| 477 | accommodation | /hotels/villa-jasmine | archive | /{locale}/stays/villa_jasmine | canonical_replacement |  |
| 172 | room_type | /room-types/superior-double-room | archive | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 173 | room_type | /room-types/deluxe-single-room | archive | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 174 | room_type | /room-types/standard-family-room | archive | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 229 | room_type | /room-types/adriatic-suite | archive | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 269 | room_type | /room-types/martha-suite | archive | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 231 | review | /reviews/review-by-admin-1-3 | discard | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 238 | review | /reviews/review-by-admin-1 | discard | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 468 | review | /reviews/review-by-admin-1-2 | discard | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 592 | review | /reviews/tour-review-by-admin-1 | discard | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 619 | review | /reviews/tour-review-by-admin-1-2 | discard | — | noindex_retirement | Legacy URL family not confirmed from source routing evidence; verify before applying redirects. |
| 485 | car_rental | /cars/vw-beetle | rewrite | /{locale}/cars/vw-beetle | canonical_replacement | Legacy URL family needs final source-routing verification. |
| 493 | car_rental | /cars/smart | rewrite | /{locale}/cars/smart | canonical_replacement | Legacy URL family needs final source-routing verification. |
| 494 | car_rental | /cars/audi-a7 | rewrite | /{locale}/cars/audi-a7 | canonical_replacement | Legacy URL family needs final source-routing verification. |
| 495 | car_rental | /cars/renault-twizy | rewrite | /{locale}/cars/renault-twizy | canonical_replacement | Legacy URL family needs final source-routing verification. |

## High-priority implementation order

1. Implement 301 mappings for duplicated destinations and tours first.
2. Add canonical replacements for retained/reconstructed destinations and tours.
3. Add lodging redirects only after stay provenance/geography decisions are complete.
4. Do not publish or redirect unverified car/room/review URL families until the legacy source routing evidence is confirmed.
