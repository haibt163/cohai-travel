# CoHai Travel — P2 Seed Reconciliation

Last reviewed: 11 September 2026.

## Objective

Reconcile the current synthetic catalog seed against the frozen `haibt163/travel:data_vietaustravel` source inventory without allowing a plausible subject match to masquerade as a historical migration.

## Source evidence

The P2 audit reports 30 source tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules and 47 currency rows. The domain-relevant published posts are 11 locations, 42 tours, 9 accommodations, 5 room types, 5 reviews and 4 car-rental records. The audit workflow stores the sanitized report as a temporary GitHub Actions artifact; raw booking/customer records are not exported.

## Decision vocabulary

- `source-backed` — current seed subject is directly supported by a retained legacy record or an explicit source relationship.
- `rewrite` — source evidence exists, but current seed copy must be rebuilt from verified source facts.
- `replacement` — the current seed is retained as a product placeholder while a different source record/subject becomes the canonical future target.
- `synthetic-pending` — no sufficiently direct source record has been established yet; keep the current seed, but do not represent it as migrated.

## Destinations

| Current seed | Status | Source evidence | Decision |
| --- | --- | --- | --- |
| hanoi | direct location 206 | HANOI | rewrite |
| halong | duplicate locations 579 + 580 | HALONG BAY + Tuần Châu | rewrite/merge |
| hoian | combined location 223 | HOI AN - DA NANG | rewrite |
| hue | no direct location record identified | tour 718 is Hue-related | synthetic-pending |
| sapa | direct location 581 | SAPA | rewrite |
| mekong | direct location 221 | MEKOND DELTA | rewrite |
| phuquoc | no direct location record identified | tour 702 is Phu Quoc-related | replacement |
| nhatrang | no direct location record identified | tour 700 is Nha Trang-related | replacement |
| siemreap | no direct location record identified in published location set | no sufficiently direct retained location source | synthetic-pending |
| bangkok | no direct location record identified in published location set | no sufficiently direct retained source | synthetic-pending |

## Journeys / tours

| Current seed | Status | Source evidence | Decision |
| --- | --- | --- | --- |
| junk-halong | direct supporting tour | 707 Halong & Tuan Chau Island | rewrite |
| hue-hoian | multiple supporting subjects | 718 Hue + 719 Hoi An + location 223 | rewrite |
| angkor-dawn | no direct retained tour identified | no sufficiently direct Angkor tour in published set | synthetic-pending |
| hanoi-heritage | direct/related source tours | 713 Hanoi + 716 Thang Long | rewrite |
| sapa-terraces | direct supporting tour | 570 Northern Mountains + location 581 | rewrite |
| mekong-slow | location source only | 221 Mekong Delta | replacement |
| puluong | no direct retained tour identified | no sufficiently direct source | synthetic-pending |
| phuquoc-drift | direct supporting tour | 702 Phu Quoc Beaches | rewrite |
| central-coast | multiple coastal source tours | 703–715 coastal/central Vietnam subjects | rewrite |

## Stays

The current seed has six stays. The legacy source has nine accommodation posts, but most are generic/foreign-location or Booking-style content with unresolved provenance and are therefore archived rather than treated as source-backed customer-facing inventory.

| Current seed | Decision | Reason |
| --- | --- | --- |
| maison-hanoi | synthetic-pending | no direct matching legacy accommodation record |
| junk-suite | synthetic-pending | no direct legacy accommodation record for this product concept |
| hoian-river | replacement | legacy accommodation records require provenance/geography review before reuse |
| sapa-lodge | synthetic-pending | no direct matching legacy accommodation record |
| phuquoc-villa | synthetic-pending | no direct matching legacy accommodation record |
| angkor-garden | synthetic-pending | no direct matching legacy accommodation record |

## Cars

The current seed has four cars: Innova Hanoi, City Sedan Hanoi, Coastal SUV Da Nang/Hoi An, and Group Van Hanoi. The legacy source has four different vehicle records: VW Beetle (485), Smart (493), Audi A7 (494), and Renault Twizy (495). None of the current four seed vehicle records is therefore a direct historical migration.

Decision: keep the current four as `synthetic-pending` product fixtures until source-backed vehicle inventory is intentionally reconstructed.

## Departures

The current seed contains 23 dated departures. The legacy dump contains 4 `wp_byt_tour_schedule` records. These counts are not equivalent and the 23 seeded departures must not be described as migrated historical schedules.

Decision: keep current departures as `synthetic-pending` until the four source schedules are mapped by source id, tour relationship, start date, price and capacity. Never infer capacity from prose.

## Required next actions

1. Create an explicit source-id map for each source-backed canonical destination/tour candidate.
2. Resolve whether combined subjects such as HOI AN - DA NANG require one canonical destination or separate records.
3. Reconcile the four source tour schedules against current 23 seeded departures.
4. Decide whether any current synthetic stay/car records should remain only as product placeholders or be replaced with source-backed records.
5. Feed the resolved source-backed/rewrite/merge/archive/discard decisions into the P2 fidelity report.

## Safety boundary

No historical customer names, emails, phones, addresses, booking notes, passwords, secrets, auth tokens or other raw customer booking content is part of this reconciliation document. The source dump contains historical booking PII; it remains source evidence only.
