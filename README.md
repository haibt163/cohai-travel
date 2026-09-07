# CoHai Travel

Private journeys in Vietnam, Cambodia and Thailand. Booked in Australian dollars, with live seats.

This repository is the source of record for the **React rebuild** of the old VietAus WordPress site. The WordPress dump stays at [`haibt163/travel`](https://github.com/haibt163/travel) and is not the runtime.

Start here:

1. [`AGENTS.md`](./AGENTS.md) — product rules and stack
2. [`OriginalWordPress.md`](./OriginalWordPress.md) — what the archive contained
3. [`ProjectStatus.md`](./ProjectStatus.md) — what shipped and what is next

## Standalone checkout

```bash
cp .env.example .env
# fill DATABASE_URL (Neon), BETTER_AUTH_SECRET, BETTER_AUTH_URL
# add Google / X client ids when you want live sign-in

npm install
npm run db:migrate
npm run media          # optional Unsplash stills onto public/media/*.jpg
npm run dev            # http://localhost:3000
```

OAuth callback URLs to register:

- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/twitter`

## v1 in one paragraph

Guests browse three chapters (Nature, Coast, UNESCO), open a journey, pick a dated departure with remaining seats, and hold it under a signed-in account. Stays and cars book by date. Chrome is English / Vietnamese. Prices are AUD. The catalog lives in Postgres, not in WordPress.

## Stack

React 19 · TanStack Start · Vite · Tailwind v4 · Better Auth · Postgres (Neon).

The playable preview was built in the Grok App Builder sandbox, which is why this is TanStack Start rather than Next.js App Router. See `ProjectStatus.md` for the rationale.

## Status

v1 catalog + booking UI + Start scaffold is on `main`. Operator admin, payments, and a row-level import of `data_vietaustravel` are later phases.
