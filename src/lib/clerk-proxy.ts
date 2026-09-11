/** Clerk Frontend API / clerk-js must stay on this origin.

pk_live encodes clerk.semaxhub-brown.vercel.app. That host cannot TLS (nested
subdomain of vercel.app). An *absolute* proxyUrl makes Clerk build script URLs
as https://clerk.<host>/npm/... which is the Console failure
(failed_to_load_clerk_ui / ERR_CONNECTION_CLOSED).

Client proxyUrl MUST be the relative path /__clerk so clerkJSScriptUrl and
clerkUIScriptUrl use /__clerk/npm/@clerk/... . Middleware handshake can still
use an absolute URL.
*/
export const CLERK_PROXY_PATH = "/__clerk";

export function clerkClientProxyUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CLERK_PROXY_URL?.trim();
  if (!raw) return CLERK_PROXY_PATH;
  if (raw.startsWith("/")) {
    return raw.replace(/\/$/, "") || CLERK_PROXY_PATH;
  }
  try {
    const path = new URL(raw).pathname.replace(/\/$/, "");
    return path || CLERK_PROXY_PATH;
  } catch {
    return CLERK_PROXY_PATH;
  }
}

export function clerkJsAssetUrl(): string {
  return `${CLERK_PROXY_PATH}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`;
}

export function clerkUiAssetUrl(): string {
  return `${CLERK_PROXY_PATH}/npm/@clerk/ui@1/dist/ui.browser.js`;
}

/** Absolute proxy for clerkMiddleware handshake only (not script tags). */
export function clerkMiddlewareProxyUrl(): string {
  const host = (
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL || "semaxhub-brown.vercel.app"
      : process.env.VERCEL_URL ||
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        ""
  )
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (host) return `https://${host}${CLERK_PROXY_PATH}`;
  return CLERK_PROXY_PATH;
}
