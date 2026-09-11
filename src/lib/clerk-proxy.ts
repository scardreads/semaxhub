/** Same-origin Clerk Frontend API proxy.

pk_live for this instance encodes clerk.semaxhub-brown.vercel.app, which cannot
get a TLS cert (nested subdomain of vercel.app). ClerkJS must use an absolute
proxy URL so it never talks to that host.
*/
export function clerkProxyUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_CLERK_PROXY_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const strip = (value: string) =>
    value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Production traffic hits the brown alias, not the unique *.vercel.app deploy URL.
  const host =
    process.env.VERCEL_ENV === "production"
      ? strip(
          process.env.VERCEL_PROJECT_PRODUCTION_URL ||
            "semaxhub-brown.vercel.app",
        )
      : strip(
          process.env.VERCEL_URL ||
            process.env.VERCEL_PROJECT_PRODUCTION_URL ||
            "",
        );

  if (host) {
    return `https://${host}/__clerk`;
  }
  return "/__clerk";
}
