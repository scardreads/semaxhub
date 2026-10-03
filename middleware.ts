import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkMiddlewareProxyUrl } from "@/lib/clerk-proxy";
import { sitemapPathFromEncoded } from "@/lib/decode-pathname";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedAction = createRouteMatcher([]);

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);

const clerkHandler = clerkConfigured
  ? clerkMiddleware(
      async (auth, req) => {
        // Public read; posting gated in Server Actions via auth().
        if (isProtectedAction(req)) {
          await auth.protect();
        }
      },
      {
        frontendApiProxy: { enabled: true },
        proxyUrl: clerkMiddlewareProxyUrl(),
        authorizedParties: ["https://semaxhub.com"],
      },
    )
  : null;

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Vercel answers a percent-encoded dynamic path with the Next 500 page
  // (`x-matched-path: /500`) after Clerk calls next(). `/sitemap%2Exml` and
  // `/%73itemap.xml` are the same document as `/sitemap.xml`. Rewrite before
  // Clerk so the platform invokes that route. Static `/robots.txt` already
  // survives the same encoding and is left alone.
  const encodedPath = sitemapPathFromEncoded(req.nextUrl.pathname);
  if (encodedPath) {
    const url = req.nextUrl.clone();
    url.pathname = encodedPath;
    return NextResponse.rewrite(url);
  }

  if (!clerkHandler) return NextResponse.next();
  return clerkHandler(req, event);
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
