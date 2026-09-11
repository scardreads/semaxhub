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
NEXT_PUBLIC_CLERK_PROXY_URL=/__clerk
ADMIN_USER_IDS=                    # optional comma-separated Clerk user IDs
```

Client `NEXT_PUBLIC_CLERK_PROXY_URL` must be the **relative** path `/__clerk`.
An absolute `https://semaxhub-brown.vercel.app/__clerk` makes Clerk load
`https://clerk.semaxhub-brown.vercel.app/npm/@clerk/clerk-js@5/...` (TLS closed,
`failed_to_load_clerk_ui`). next.config pins `NEXT_PUBLIC_CLERK_JS_URL` and
`NEXT_PUBLIC_CLERK_UI_URL` to `/__clerk/npm/@clerk/...`. The Dashboard proxy
URL stays absolute (`https://semaxhub-brown.vercel.app/__clerk`).

After setting `DATABASE_URL` (or a `POSTGRES_*` alias) on Vercel Production + Preview, **redeploy**. Migrate/seed already ran against prod Postgres.

### Clerk dashboard

1. Enable **Email verification** and **Google OAuth**.
2. Production domain is **only** `https://semaxhub-brown.vercel.app` (one primary `vercel.app` domain). Do not Change domain to add the ilya-nikolayevs-projects alias.
3. **Frontend API proxy (required):** Domains → Frontend API → Set proxy configuration to `https://semaxhub-brown.vercel.app/__clerk`. Without this, ClerkJS still calls `clerk.semaxhub-brown.vercel.app` and sign-in shows ClerkFailed.
4. Do **not** CNAME `clerk.semaxhub-brown.vercel.app` or `accounts.semaxhub-brown.vercel.app`. Nested subdomains of `vercel.app` cannot get TLS. Do not switch v1 to Clerk Account Portal while those hosts are the portal URLs (they TLS-fail). If you want hosted Account Portal later, change it in the Dashboard to the default `*.accounts.dev` URL, not `accounts.*.vercel.app`.
5. Optional admin: set `publicMetadata.role` to `"admin"` on a user, or list IDs in `ADMIN_USER_IDS`.

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
