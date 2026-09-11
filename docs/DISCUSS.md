# Semax Hub Discuss v1

Reading-room discussion. Anyone can read; sign-in required to post or reply. No anonymous posts. No third-party forum.

## Production host

- Primary: https://semaxhub-brown.vercel.app
- Older alias (still valid if present): https://semaxhub-ilya-nikolayevs-projects.vercel.app

## Env checklist (Ilya / Vercel)

Set these on Vercel (**Production + Preview**) and locally in `.env.local`:

```bash
DATABASE_URL=                      # Postgres (Neon or Vercel Postgres recommended)
                                   # Also accepted: POSTGRES_URL, POSTGRES_URL_NON_POOLING
                                   # Do not use POSTGRES_PRISMA_URL / prisma+ URLs with postgres.js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/discuss
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/discuss
ADMIN_USER_IDS=                    # optional comma-separated Clerk user IDs
```

After setting `DATABASE_URL` (or a `POSTGRES_*` alias) on Vercel Production + Preview, **redeploy**. Migrate/seed already ran against prod Postgres.

### Clerk dashboard

1. Enable **Email verification** and **Google OAuth**.
2. Add Vercel production and preview domains under Allowed origins / redirect URLs.
3. Optional admin: set `publicMetadata.role` to `"admin"` on a user, or list IDs in `ADMIN_USER_IDS`.

### Database

```bash
npm run db:migrate    # apply drizzle/ SQL migrations
npm run db:seed       # upsert the 8 Research topics
```

On first deploy: set `DATABASE_URL` (or `POSTGRES_URL`), run migrate + seed (locally against prod URL, or via a one-off job).

### Graceful degrade

If `DATABASE_URL` / `POSTGRES_URL` is missing, `/discuss` shows a banner ("Discussion DB not configured") and does not crash the build. Teach pages always build. Discuss routes use `dynamic = force-dynamic`.

## Routes

- `/discuss`  -  topics
- `/discuss/[topicSlug]`  -  threads in a topic + create thread
- `/discuss/[topicSlug]/[threadId]`  -  thread + replies
- `/sign-in`, `/sign-up`  -  Clerk catch-alls

## Moderation v1

- Report button on threads/replies (signed-in).
- Admin soft-hide / unhide when `publicMetadata.role === "admin"` or user ID is in `ADMIN_USER_IDS`.

## Out of scope

Karma, DMs, rich reactions, full admin console.
