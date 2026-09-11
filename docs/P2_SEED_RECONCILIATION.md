# CoHai Travel — P2 Seed Reconciliation

Last reviewed: 11 September 2026.

## Objective

Reconcile the current synthetic catalog seed against the frozen `haibt163/travel:data_vietaustravel` source inventory while respecting the new interpretation of the archive: the old site is a 15+ year-old template-based project built around the owner's travel ideas, so durable destination/tour/travel-information subjects are valuable source material even when the original technical implementation is obsolete.

The current seed remains a fixture until a source-backed reconstruction decision is made. Similarity alone is never treated as proof of historical migration.

## Source evidence

The P2 audit reports 30 source tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules and 47 currency rows. The domain-relevant published posts are 11 locations, 42 tours, 9 accommodations, 5 room types, 5 reviews and 4 car-rental records. Raw booking/customer records are not exported.

## Decision vocabulary

- `source-backed` — current/future product subject is directly supported by a retained legacy subject or explicit source relationship.
- `rewrite` — source evidence exists and the subject should be retained, but copy/facts need a modern rewrite.
- `replacement` — source subject should become the canonical target instead of the current synthetic placeholder.
- `synthetic-pending` — no sufficiently direct source record has been established yet; keep the current seed but do not call it migrated.
- `modern-addition` — intentionally new 2026 product content with no requirement to mirror the old site.

## Interpretation of the current seed

The synthetic seed was useful as application scaffolding. It is now treated as a temporary implementation fixture. The historical archive should inform the content plan more strongly than the original scaffold did, particularly for destinations, tours, travel-information subjects and the Nature/Beach/UNESCO discovery structure.

## Destinations

The current seed destinations with direct or strong historical support should be retained and reconstructed from source evidence: Hanoi, Ha Long/Tuần Châu, Hoi An/Da Nang, Sapa and Mekong Delta. Historical records for Saigon/Ho Chi Minh City, Đồng Hới/Quảng Bình and additional destination subjects should be considered canonical candidates where they fit the current product architecture.

Hue, Phu Quoc, Nha Trang, Siem Reap and Bangkok should not be removed merely because there was no exact location-post match. They can remain either source-supported through related tour evidence or as intentional 2026 additions. The important requirement is to label provenance correctly.

## Journeys / tours

The source archive contains a substantial set of valid Vietnam travel subjects. These should be treated as high-value reconstruction candidates, especially the northern mountains, Phong Nha/Paradise Cave, national parks, major coastal destinations and UNESCO/heritage subjects. Valid subjects should normally be `rewrite` or eventually `migrate` after factual/editorial/media approval rather than discarded because old copy is weak.

Current seed journeys such as Ha Long overnight, Hanoi heritage, Sapa terraces, Phu Quoc and the central-coast cluster have useful historical support and should be reconstructed around those source concepts. Other current journeys such as Angkor dawn and Pu Luong may remain as `modern-addition` or `synthetic-pending` where the archive does not provide direct evidence.

## Stays

The source has nine accommodation posts and five room-type posts, but these are mixed-quality and require stronger geographic/provenance checks. The modern product should not automatically inherit the old named properties or ratings. Useful accommodation concepts can be reconstructed when a current, verifiable property is identified; otherwise the current synthetic stay can remain a `modern-addition` rather than being falsely presented as historical.

## Cars

The source identifies four historical vehicle records: VW Beetle, Smart, Audi A7 and Renault Twizy. The current four seed vehicle listings are different. This is not a problem: the old vehicle records are product-history evidence, while the 2026 fleet should reflect commercially appropriate vehicles. Keep provenance explicit.

## Departures

The source contains only four historical tour schedules, while the current rebuild contains 23 synthetic departures. These should not be conflated. Historical schedules can be preserved as source evidence and used as templates for schedule/product intent, but current dates, prices and capacities must be intentionally reconstructed and verified before publication.

## Media

Legacy media is a legitimate migration candidate. The preferred path is preserve/inspect/verify/optimize, then replace selectively. The current seed's replacement image does not automatically outrank a useful historical asset. The media map should preserve source attachment/path information and legal/provenance status.

## Required next actions

1. Build the canonical destination/tour reconstruction set from the archaeology document and row-level source matrix.
2. Promote genuinely durable source subjects from `rewrite` toward `migrate` after factual/editorial review.
3. Keep intentionally new 2026 products labelled as `modern-addition` rather than pretending they are historical migrations.
4. Reconcile the four historical schedules with any current product that intentionally revives them.
5. Build the media map and migrate useful historical assets where legally and technically suitable.
6. Feed final outcomes into the fidelity report and URL map.

## Safety boundary

No historical customer names, emails, phones, addresses, booking notes, passwords, secrets, auth tokens or other raw customer booking content is part of this reconciliation document. The source dump contains historical booking PII; it remains source evidence only.
