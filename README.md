# Semax Hub

Free educational resource on Semax: history, mechanisms people discuss, evidence map, safety context, and common confusions. **Informational only. Not medical advice. We don't sell Semax.**

Promise: Curious. Sourced. Never a shop.

## Production

- https://semaxhub.com

Canonicals, the sitemap, `robots.txt`, JSON-LD, and `/llms.txt` use that host unless `NEXT_PUBLIC_SITE_URL` is set to another production origin. Pages are indexable only when `VERCEL_ENV=production`. Preview deployments are `noindex` and their `robots.txt` disallows crawling. The sitemap includes public Discuss rooms, and public threads when the database is reachable. Hidden threads, `/sign-in`, and `/sign-up` are excluded. A database error or an unreadable timestamp drops that dynamic piece only; static pages and the seeded rooms still return.

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

## Analytics

Google Analytics 4 (`gtag.js`) loads from the root layout. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to override the ID (the public property is `G-78DELVNFMX`). On the Vercel production deployment, an unset variable uses that ID. Preview and local dev do not load the tag unless the variable is set. Set it to an empty value to turn the tag off in any environment, including production.

## Notes

- No cart, pricing, buy CTAs, affiliate links, or storefront patterns.
- Teach routes live under `src/app/*/content.mdx`.
- Discussion UI at `/discuss` is DB-backed reading-room v1.
- If a claim needs a citation and one is missing, pages say so.
