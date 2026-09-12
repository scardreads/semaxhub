# Semax Hub

Free educational resource on Semax: history, mechanisms people discuss, evidence map, safety context, and common confusions. **Informational only. Not medical advice. We don't sell Semax.**

Promise: Curious. Sourced. Never a shop.

## Production

- https://semaxhub-brown.vercel.app
- Older alias: https://semaxhub-ilya-nikolayevs-projects.vercel.app

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX teach pages
- Clerk (auth for Discuss)
- Postgres + Drizzle ORM (Discuss topics / threads / replies)

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill Clerk + DATABASE_URL (or POSTGRES_URL)
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

Discuss routes degrade if `DATABASE_URL` / `POSTGRES_URL` is missing (banner, no crash). Teach pages always build.

## Discuss

See [docs/DISCUSS.md](docs/DISCUSS.md) for the full env checklist (Clerk + Postgres), seed, and moderation notes.

Set `DATABASE_URL` (or Neon/Vercel `POSTGRES_*` aliases) on Vercel Production + Preview, then redeploy. Migrate/seed already ran against prod Postgres.

## Notes

- No cart, pricing, buy CTAs, affiliate links, or storefront patterns.
- Teach routes live under `src/app/*/content.mdx`.
- Discussion UI at `/discuss` is DB-backed reading-room v1.
- If a claim needs a citation and one is missing, pages say so.
