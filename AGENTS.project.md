# CoHai Travel — Project Instructions

## 1. Project Identity

**CoHai Travel**

Repository:

`haibt163/cohai-travel`

Canonical integration branch:

`main`

`main` is the protected repository source of record.

Normal implementation work should use a dedicated feature branch or worktree.

---

## 2. Product

CoHai Travel is a bilingual travel booking application for private journeys
in Vietnam, Cambodia, and Thailand.

The product includes:

- journey discovery;
- dated departures;
- seat allocation;
- stays;
- cars;
- account-based booking;
- English / Vietnamese presentation;
- AUD pricing.

The current React rebuild is the runtime source of record.

The legacy WordPress repository is historical source material, not the runtime.

---

## 3. Technology Stack

The current stack includes:

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS v4
- Better Auth
- Postgres / Neon
- Kysely
- Zustand
- Radix UI
- React Hook Form
- Zod
- Recharts
- Nitro / Vercel integration

Canonical dependencies and scripts are defined by `package.json`.

Do not introduce a replacement framework or parallel application architecture
to solve a local problem.

---

## 4. Application Boundaries

Preserve the existing separation between:

- route and UI behavior;
- server functionality;
- authentication;
- database access;
- domain/business rules;
- migration tooling;
- operational scripts;
- source/provenance documentation.

Inspect the current implementation before introducing a new abstraction or
parallel mechanism.

---

## 5. Database

Production data uses Postgres hosted through Neon.

Database changes must:

- use the established Kysely/Postgres architecture;
- preserve migration ordering;
- be explicit and reviewable;
- avoid destructive changes unless explicitly authorized;
- include appropriate verification where practical.

Never commit production credentials or secrets.

---

## 6. Authentication and Authorization

Better Auth is the authentication system.

Protected operations must verify authenticated identity on the server.

Do not trust client-supplied identity for authorization decisions.

Do not introduce demo or mock authorization paths that could reach production.

Changes to authentication or authorization require security-focused review.

---

## 7. Booking and Inventory

Booking and inventory are critical domain boundaries.

The system must preserve:

- finite inventory;
- date-aware availability;
- seat allocation rules;
- consistency between availability and booking;
- protection against conflicting allocations;
- server-side validation of booking operations.

A UI availability check is not sufficient protection against concurrent or
invalid booking.

For changes to booking or inventory:

1. identify the affected invariant;
2. inspect the existing domain implementation;
3. update executable tests;
4. verify valid and invalid cases;
5. inspect database/runtime implications.

---

## 8. Stays and Cars

Stays and cars use finite, date-aware inventory.

Preserve the distinction between:

- catalog information;
- date-specific availability;
- confirmed allocation.

Do not replace transactional inventory behavior with static UI state.

---

## 9. Notifications

Notification work must distinguish between:

- application-level event creation;
- provider delivery;
- delivery configuration;
- failure/retry behavior.

Do not treat execution of an application function as proof that a notification
was delivered.

See `docs/P1_NOTIFICATIONS.md` for the current notification contract.

---

## 10. Legacy Migration and Provenance

Legacy WordPress material is source evidence for reconstruction, drawn from
a template-based personal project built more than 15 years ago — not a
live customer-data system. Treat destination, tour, and travel-information
subjects as potentially valuable source material rather than obsolete by
default, while still keeping the disposition categories below strict.

Migration work must distinguish between:

- source evidence;
- proposed migration;
- rewritten content;
- archived content;
- discarded/demo content;
- synthetic seed data.

Synthetic seed data must not be represented as completed historical migration
content.

Relevant documentation includes:

- `OriginalWordPress.md`
- `docs/CONTENT_ARCHAEOLOGY.md`
- `docs/P2_MIGRATION_EXECUTION.md`

---

## 11. Language and Content

The product is bilingual in English and Vietnamese.

User-visible changes should preserve the established bilingual model.

Content changes should preserve source provenance where applicable.

Do not silently replace source-derived content with synthetic or unverified
material.

---

## 12. Pricing

The product uses Australian dollars (AUD).

Do not silently change the canonical currency or introduce competing pricing
semantics.

When changing pricing behavior, inspect both domain and presentation paths.

---

## 13. Production Runtime

The application is deployed to Vercel.

Production-compatible code must not rely on:

- undeclared environment variables;
- local-only filesystem state;
- local machine configuration;
- development-only behavior;
- hard-coded secrets.

Use `.env.example` for safe documentation of environment-variable names and
configuration shape.

---

## 14. Verification

Canonical project scripts are defined in `package.json`.

Depending on task scope, relevant verification may include:

- `npm run test:domain`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run test:smoke`

Critical domain changes require broader verification than a small isolated
change.

Do not claim a command passed without executing it.

---

## 15. Documentation Structure

Detailed project procedures belong in `docs/`.

Important current documents include:

- `docs/ENGINEERING_GOVERNANCE.md`
- `docs/AI_ENGINEERING_WORKFLOW.md`
- `docs/CONTENT_ARCHAEOLOGY.md`
- `docs/PARITY_AUDIT.md`
- `docs/P2_MIGRATION_EXECUTION.md`
- `docs/P1_NOTIFICATIONS.md`
- `CLAUDE.md` (Claude Code's harness-specific operating guidance; it does not
  alter Claude Code's governance standing, which is equal to Codex CLI/App)

`AGENTS.project.md` should remain a concise project contract rather than a
duplicate of these documents.

Historical documents remain evidence and should not be rewritten merely to
make current behavior look continuous.

---

## 16. Multi-Harness Engineering Model

The project supports multiple implementation environments.

Current implementation lanes:

- Claude Code (governed by `CLAUDE.md` for Claude-specific operating details)
- Codex CLI / Codex App
- OMP CLI (DeepSeek, GLM, Kimi, Qwen — used routinely for cost/availability
  reasons, including whenever a session limit is hit on another lane)

Claude Code and Codex CLI/App have the same Main Engineer role and the same
higher-trust, merge-capable governance standing — they are peers, and
neither is the designated primary or the other's fallback. OMP remains a
full implementation lane but does not hold merge authority. Harness choice
does not change:

- project scope;
- verification requirements;
- Git rules;
- review boundaries;
- approval boundaries;
- final Project Owner authority.

The same peer relationship holds on the review side: Claude Chat and
ChatGPT are equally-standing Chief Engineer lanes (see §17).

The repository should remain portable across harnesses.

## 17. Approval Boundary

The current workflow is:

Project Owner defines task
→ implementation / investigation
→ tests + evidence + handoff
→ Chief Engineer review
→ APPROVE from the active Chief Engineer chat lane (Claude Chat or
  ChatGPT — either is independently sufficient), or the Project Owner
→ merge executed by the Project Owner, Claude Code, or Codex CLI/App
  (either lane is independently sufficient)
→ protected `main`

The Chief Engineer role is performed by the active chat/review lane — Claude
Chat or ChatGPT — and these two have the same role and authority, as true
peers rather than a primary lane with a backup. Claude Code is a Main
Engineer lane with the same governance standing as Codex CLI/App, likewise
as peers. Neither an implementation harness nor a successful automated test
may bypass this boundary.

**Approval authority is held by the active Chief Engineer chat lane
(Claude Chat or ChatGPT) and the Project Owner. Merge-execution authority is
held equally by the Project Owner, Claude Code, and Codex CLI/App.** Claude
Chat and ChatGPT do not execute merges from chat-only environments; Claude
Code and Codex CLI/App may equally execute an approved merge — there is no
default or preferred executor between the two, and no default or preferred
approver between Claude Chat and ChatGPT. OMP does not execute a merge to
`main`; its implementation work reaches `main` through the same review-and-
approval gate.

See `docs/ENGINEERING_GOVERNANCE.md` §6a for the authoritative definition
of the approval gate and merge-execution rules.

## 18. Scope Control

A task should normally produce the smallest correct change that satisfies its
requirements.

Do not combine unrelated:

- refactors;
- dependency modernization;
- UI redesign;
- migration cleanup;
- content rewriting;
- architecture replacement;

with a scoped engineering task unless explicitly authorized.

Record newly discovered unrelated issues separately.

---

## 19. Definition of Done

A substantive task is complete when:

- the authorized scope is implemented or investigated;
- relevant verification has been run;
- important claims are evidence-backed;
- security, data, and provenance implications have been considered;
- the diff is focused and reviewable;
- documentation is accurate where behavior changed;
- remaining limitations are explicit;
- Git state is understood;
- the work is ready for the required review.
