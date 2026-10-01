/**
 * Canonical host for Semax Hub.
 *
 * `NEXT_PUBLIC_SITE_URL` may override this (origin only, no trailing slash).
 * Leave it unset, or set it to the production origin on every Vercel
 * environment. Do not point it at a preview deployment: canonicals, the
 * sitemap, robots, JSON-LD, and llms.txt all use this host.
 *
 * Indexing follows `VERCEL_ENV`. Production deployments are indexable.
 * Preview (`VERCEL_ENV=preview`) and local builds (unset) are noindex, and
 * their robots.txt disallows crawling. Vercel sets `VERCEL_ENV` per deployment.
 */
export const PRODUCTION_SITE_URL = "https://semaxhub-brown.vercel.app";

export const SITE_NAME = "Semax Hub";

export const SITE_TITLE = "Semax Hub | Semax, the definitive resource";

export const SITE_DESCRIPTION =
  'Semax Hub is the place for sourced knowledge and discussion on the peptide known as the "KGB brain spray" and the "Limitless peptide." Learn what it is, what the research says and, through discussion, exchange knowledge with like-minded people.';

export const LEARN_DESCRIPTION =
  "Clear, sourced guides on what Semax is, where it came from, and what the research says.";

export const DISCUSS_DESCRIPTION =
  "Reading room for questions and peer talk about Semax. Anyone can read; sign in to post or reply.";

/** Paths that must not be crawled. Auth screens and the Clerk asset proxy. */
export const PRIVATE_ROBOTS_PATHS = [
  "/sign-in",
  "/sign-up",
  "/__clerk",
  "/api/",
] as const;

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return PRODUCTION_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(configured)
    ? configured
    : `https://${configured}`;
  return withProtocol.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path === "/" || path === "") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True only on the Vercel production deployment. */
export function isIndexableDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}
