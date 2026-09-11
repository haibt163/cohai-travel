# CoHai Travel — P2 Fidelity Report

Last reviewed: 11 September 2026.

## Executive result

P2 is now understood as **Legacy Product Archaeology & Modern Reconstruction**, not a blind WordPress migration. The 15+ year-old archive is a valuable source of original product/business/UX intent and durable travel subject matter, while obsolete implementation, contaminated/demo records, historical customer data and time-sensitive commercial values are excluded or independently revalidated.

Historical content parity is therefore **not claimed**. The target is faithful reconstruction of the useful original ideas in a modern 2026 product.

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

The audit/export pipeline excludes raw record samples and customer PII from generated artifacts. Historical booking/customer data remains source-only.

## Product-intent fidelity

The archive provides strong evidence for these durable concepts:

- destination-led travel discovery;
- connected tours, stays and car rental;
- date/location/guest/room-aware search;
- price and quality filtering;
- Nature, Beach/Coast and UNESCO discovery groupings;
- AUD-facing commerce;
- English/Vietnamese presentation;
- account and booking-history flows;
- Cambodia/Thailand as neighbouring destinations.

These should be preserved as **KEEP** concepts or **MODERNIZE** concepts in the 2026 product. The old WordPress implementation itself is **RETIRE**.

See `docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md` for the explicit 2026 requirement set.

## Content interpretation

Many destination, tour and travel-information subjects remain useful because the underlying travel concepts are durable. Old age alone is not a discard rule. The right question is whether the subject remains valuable and can be factually/editorially reconstructed for 2026.

Conversely, old prices, dates, property claims, ratings, operating statements and availability are not assumed current. They require verification before publication.

## Media fidelity

Twenty-two source media attachments were identified. Legacy media is now a legitimate migration candidate. The preferred policy is `preserve → inspect → verify provenance/licensing → optimize → map alt text → publish when appropriate → replace only when justified`.

The final media map should preserve source attachment/path identity and document any replacement reason. Binary transfer/optimization may require the user's local legacy folder because the GitHub connector is text-oriented.

## Migration dispositions

The current row-level working matrix remains a publication/traceability ledger. `rewrite` does not mean discard; it means preserve the subject while rebuilding content. A source row can move to `migrate` after it clears factual, editorial, media and provenance gates.

## URL fidelity

Legacy `/locations/...`, `/tours/...`, `/hotels/...`, taxonomy/search and regional navigation remain valuable source evidence. Preserve high-value URL intent through explicit canonical mappings only after the corresponding current target exists and is verified.

## Schedule fidelity

The source contains four historical schedule records while the current rebuild seed contains 23 synthetic departures. Historical schedules are useful product evidence but current dates/prices/capacities must be reconstructed intentionally and verified.

## Historical booking fidelity

Historical booking rows and their customer PII are not migration content. Their existence may explain old business flows, but no customer-level data enters the rebuild.

## Runtime reliability checkpoint — 11 September 2026

The major local runtime blocker encountered during P2 reconstruction is closed. The incident involved an existing populated Neon database whose migration ledger did not accurately describe the existing catalog. The application was incorrectly attempting to replay seed data, producing a duplicate `hanoi` primary-key error, and the earlier catalog queries then surfaced missing provenance columns.

The final migration/bootstrap design now adopts existing catalog data without reseeding, runs schema migrations deterministically, repairs stale provenance columns idempotently, and verifies the expected schema before application traffic is served.

User-provided Windows execution evidence shows `npm run dev` starting successfully and the bootstrap applying `0004_inventory`, `0005_booking_status`, `0005_public_contact`, `0006_provenance`, `0007_fact_checked_destinations`, `0008_fact_checked_coastal_destinations`, `0009_fact_checked_source_backed_journeys` and `0010_repair_provenance_schema`. The user confirmed the previously blocking page error was resolved.

GitHub Actions run #251 on `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` passed domain tests, typecheck, lint, build and production smoke — **VERIFIED**.

This runtime incident is therefore **FIXED / VERIFIED** under the project's evidence policy. The PostgreSQL SSL warning remains a separate non-blocking warning and is not part of this resolved incident.

## Unresolved gaps

1. Convert accepted destination/tour subjects into canonical 2026 records.
2. Resolve combined/locality subjects such as Hoi An–Da Nang and Ho Chi Minh City/Saigon.
3. Decide which travel-information subjects deserve dedicated current content surfaces.
4. Verify current commercial facts for stays/cars and determine which historical concepts are worth reviving.
5. Reconcile the four historical schedules with any current products intentionally revived from them.
6. Complete the legacy media map and migrate useful assets where legally and technically suitable.
7. Complete high-value legacy URL redirects after canonical targets exist.

## Fidelity standard for completion

P2 is complete when the surviving original product intent has been translated into the current architecture, accepted source-derived content has explicit provenance and disposition, useful media is preserved or intentionally replaced, high-value legacy URLs are mapped, current commercial facts are verified, and all implementation batches pass the repository CI gate. A defect is not called fixed merely because code review looks correct; the relevant execution evidence must exist first.
