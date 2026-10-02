import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkMiddlewareProxyUrl } from "@/lib/clerk-proxy";
import { safeDecodedPathname } from "@/lib/decode-pathname";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedAction = createRouteMatcher([]);

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);

const middlewareHandler = clerkConfigured
  ? clerkMiddleware(
      async (auth, req) => {
        // Public read; posting gated in Server Actions via auth().
        if (isProtectedAction(req)) {
          await auth.protect();
        }
      },
      { frontendApiProxy: { enabled: true }, proxyUrl: clerkMiddlewareProxyUrl() },
    )
  : function passthrough(_req: NextRequest) {
      return NextResponse.next();
    };

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Vercel returns 500 for this dynamic route when any character in
  // `/sitemap.xml` is percent-encoded (`/sitemap%2Exml`, `/%73itemap.xml`).
  // The decoded path is the same document. Rewrite before Clerk runs.
  const decoded = safeDecodedPathname(req.nextUrl.pathname);
  if (decoded === "/sitemap.xml") {
    const url = req.nextUrl.clone();
    url.pathname = decoded;
    return NextResponse.rewrite(url);
  }
  return middlewareHandler(req, event);
}

export const config = {
  matcher: [
    // Skip Next internals and static files, but NOT /__clerk (see next matcher)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk Core 3 frontendApiProxy serves clerk.browser.js under /__clerk — must hit middleware
    "/__clerk/(.*)",
  ],
};
