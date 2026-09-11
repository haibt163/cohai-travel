# CoHai Travel — P2 Canonical Record Plan

Last reviewed: 11 September 2026.

## Purpose

Turn the archaeology and seed-reconciliation findings into a controlled publication plan for canonical 2026 destinations and journeys.

This document is a decision ledger, not a claim that every record is already production-ready. A source-backed label means the historical subject is supported; publication still requires current factual, editorial, media and commercial checks.

## Destination reconstruction set

| Canonical id | Current state | Historical support | 2026 publication gate |
| --- | --- | --- | --- |
| `hanoi` | `source-backed` | `wp_posts:206` | Recheck destination copy, media provenance and current travel facts before publication. |
| `halong` | `source-backed` | `wp_posts:579,580,707` | Resolve Ha Long / Tuan Chau relationship; verify current access, product and media details. |
| `hoian` | `source-backed` | `wp_posts:223,719` | Resolve Hoi An / Da Nang relationship; verify current destination copy. |
| `hue` | `source-backed` | `wp_posts:718` | Verify current destination facts and media. |
| `sapa` | `source-backed` | `wp_posts:581,570` | Verify current trekking/travel claims and media. |
| `mekong` | `source-backed` | `wp_posts:221` | Confirm canonical wording for Mekong Delta and current travel information. |
| `phuquoc` | `source-backed` | `wp_posts:702` | Verify current coastal/facility claims and media. |
| `nhatrang` | `source-backed` | `wp_posts:700` | Verify current coastal/product framing and media. |
| `siemreap` | `modern-addition` | No direct legacy location mapping used in current provenance migration. | Keep only as an intentional 2026 addition; verify all current destination facts. |
| `bangkok` | `modern-addition` | No direct legacy location mapping used in current provenance migration. | Keep only as an intentional 2026 addition; verify all current destination facts. |

## Journey reconstruction set

| Canonical id | Current state | Historical support | 2026 publication gate |
| --- | --- | --- | --- |
| `junk-halong` | `source-backed` | `wp_posts:707` | Rebuild itinerary and commercial details from current evidence. |
| `hue-hoian` | `source-backed` | `wp_posts:718,719` | Preserve heritage arc; verify routing and current commercial facts. |
| `hanoi-heritage` | `source-backed` | `wp_posts:713` | Rebuild copy and current activity details. |
| `sapa-terraces` | `source-backed` | `wp_posts:570` | Verify trekking claims, route feasibility and seasonality before publication. |
| `mekong-slow` | `source-backed` | `wp_posts:221` | Rebuild itinerary and current operator/commercial details. |
| `phuquoc-drift` | `source-backed` | `wp_posts:702` | Verify accommodation, activity and availability claims. |
| `central-coast` | `source-backed` | `wp_posts:700,701,703,704,705,706,708,709,710,711,712,714` | Treat as a reconstructed concept, not a literal historical itinerary; verify every current stop and routing claim. |
| `angkor-dawn` | `modern-addition` | No direct legacy journey mapping used in current provenance migration. | Keep as an intentional 2026 addition; independently verify current facts. |
| `puluong` | `modern-addition` | No direct legacy journey mapping used in current provenance migration. | Keep as an intentional 2026 addition; independently verify current facts. |

## Runtime readiness checkpoint — 11 September 2026

The application migration/bootstrap blocker encountered during local P2 work is now closed. The final runtime behavior is supported by user-observed local execution evidence and independently passing CI.

The local database was an existing populated Neon database. The migration layer now adopts that catalog instead of replaying the seed, continues with the pending schema migrations, and verifies the provenance columns before the application serves traffic. The user's successful local startup logged adoption of existing catalog data and successful application of migrations `0004_inventory` through `0010_repair_provenance_schema`; the user then confirmed the previously blocking `provenance_state` page error was gone.

GitHub Actions run #251 on `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` passed domain tests, typecheck, lint, build and production smoke — **VERIFIED**.

This runtime incident is therefore **FIXED / VERIFIED**. Future fixes must follow the same evidence standard.

## Record acceptance gates

A record can move from reconstruction to publication only when all applicable gates are satisfied:

1. **Source gate** — historical subject or intentional 2026 addition is explicitly identified.
2. **Editorial gate** — English/Vietnamese copy is coherent, current and free of legacy implementation residue.
3. **Fact gate** — claims that may have changed since the historical project are independently checked.
4. **Commercial gate** — current prices, availability, departures, capacity and supplier/property claims are verified before being presented as live truth.
5. **Media gate** — image provenance/licensing, relevance, dimensions, loading behavior and alt text are checked.
6. **URL gate** — valuable historical paths are redirected only after their canonical target exists and passes the above gates.
7. **CI gate** — every implementation batch passes the complete repository CI chain.

## Synthetic seed boundary

Records that remain `synthetic-pending` are scaffolding, not migrated legacy content. They must not be described in the product or project documentation as historical imports merely because the subject looks plausible.

## Data-safety boundary

No historical customer PII, booking notes, credentials, passwords, secrets, auth tokens or raw customer booking records belong in canonical reconstruction fixtures or publication artifacts.

## Evidence discipline

A code change may be described as **fixed** only after the relevant execution evidence exists. For an interactive defect, include the relevant runtime/test result and user-observed confirmation when the assistant cannot directly inspect the user's local browser. Do not use model confidence, a plausible patch, or a static code review as a substitute for execution evidence.
