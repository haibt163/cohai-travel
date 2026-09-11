# CoHai Travel — P2 Fidelity Report

Last reviewed: 11 September 2026.

## Executive result

P2 source archaeology has produced a traceable, sanitized legacy inventory and three working reconciliation ledgers: migration dispositions, legacy URLs, and current seed reconciliation. **Historical content parity is not claimed.** The source contains a mixture of useful Vietnam travel subjects, duplicates, placeholder/test records, scraped lodging copy, and contaminated metadata. The rebuild must preserve source identity and relationships while rewriting or replacing unsafe/unreliable content.

## Evidence baseline

| Evidence | Result |
| --- | ---: |
| Legacy SQL tables | 30 |
| Populated tables | 19 |
| `wp_posts` rows | 207 |
| Domain-relevant published posts | 76 |
| Location posts | 11 |
| Tour posts | 42 |
| Accommodation posts | 9 |
| Room-type posts | 5 |
| Review posts | 5 |
| Car-rental posts | 4 |
| Media attachments | 22 |
| Taxonomy rows | 48 |
| Term relationships | 294 |
| Tour schedules | 4 |
| Currency rows | 47 |

The audit/export pipeline explicitly excludes raw record samples and customer PII from generated artifacts. The frozen dump itself contains historical booking data and must remain source evidence only.

## Disposition coverage

The current P2.15 working matrix covers all 76 domain-relevant published posts:

| Disposition | Rows |
| --- | ---: |
| migrate | 0 |
| rewrite | 47 |
| merge | 4 |
| archive | 13 |
| discard | 12 |

Zero `migrate` decisions are intentional: the source evidence is not yet clean enough to claim direct publish-ready parity.

## Seed reconciliation

### Direct/source-supported or rewrite candidates

Current seed subjects with explicit source support include Hanoi (location 206), Ha Long/Tuần Châu (locations 579/580), Hoi An / Da Nang combined source (223), Sapa (581), Mekong Delta (221), Ha Long overnight (tour 707), Hanoi heritage (713/716), Sapa / northern mountains (570), Phu Quoc beaches (702), and the central/coastal tour set (703–715).

### Synthetic or replacement candidates

The current seed includes subjects that do not have direct matching legacy records in the published source set, including Hue as a destination record, Siem Reap, Bangkok, several current stays, all four current cars, and most of the current 23 departure rows. These remain synthetic/replacement candidates until explicit source-backed records are created or the decision is made to retain them as modern editorial additions.

## URL fidelity

The legacy archive documents `/locations/...`, `/tours/...`, `/hotels/...`, taxonomy/category/tag/search and regional navigation. The P2.16 ledger now maps the identified location/tour/hotel records to locale-prefixed canonical routes where appropriate, while deliberately leaving car/room/review legacy route families unverified rather than inventing redirects.

## Media fidelity

Twenty-two source media attachments were identified. The rebuild's current customer-facing media remains provisional where source provenance/licensing is unresolved. A final media map must record source path/attachment id, target asset, crop/transformation, alt text and licensing status before parity is claimed.

## Schedule fidelity

The source contains four tour-schedule records. The current rebuild contains 23 synthetic departures. These must not be conflated. Final reconciliation must map each retained source schedule by source id, tour relationship, date, price and capacity. Capacity must never be inferred from prose.

## Historical booking fidelity

The source contains two historical tour-booking rows and sensitive customer data in booking schemas. None of that customer-level content is a migration fixture. The rebuild keeps only non-sensitive linkage necessary to document source disposition.

## Unresolved gaps

1. Final factual/editorial rewrite of retained locations and tours.
2. Geographic/source verification for legacy accommodation records.
3. Media provenance and licensing verification.
4. Complete high-value legacy URL verification, including route families not yet evidenced by source routing code.
5. Source schedule reconciliation against the current departure model.
6. Decision on which synthetic stay/car/departure records remain intentionally modern additions versus replacements.
7. Final destination normalization where the source combines localities (for example Hoi An - Da Nang).

## Next execution priority

P2.17/P2.18 now provide the evidence and decision framework. The next implementation step is to build the source-backed canonical catalog from the accepted matrix, starting with destinations and tours, then reconcile stays/cars and finally departures/URLs/media. Each change must pass the repository CI gate before being considered verified.
