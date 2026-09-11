# Semax Hub

Free educational resource on Semax: history, mechanisms people discuss, evidence map, safety context, and common confusions. **Informational only. Not medical advice. We don't sell Semax.**

Brand promise: *Curious, sourced, never a shop.*

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
cp .env.example .env.local   # then fill Clerk + DATABASE_URL
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

Discuss routes degrade if `DATABASE_URL` is missing (banner, no crash). Teach pages always build.

## Discuss

See [docs/DISCUSS.md](docs/DISCUSS.md) for the full env checklist (Clerk + Postgres), seed, and moderation notes.

## Notes

- No cart, pricing, buy CTAs, affiliate links, or storefront patterns.
- Teach routes live under `src/app/*/content.mdx`.
- Discussion UI at `/discuss` is DB-backed reading-room v1.
- If a claim needs a citation and one is missing, pages say so.
