import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedAction = createRouteMatcher([]);

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);

const middleware = clerkConfigured
  ? clerkMiddleware(
      async (auth, req) => {
        // Public read; posting gated in Server Actions via auth().
        if (isProtectedAction(req)) {
          await auth.protect();
        }
      },
      { frontendApiProxy: { enabled: true } },
    )
  : function passthrough(_req: NextRequest) {
      return NextResponse.next();
    };

export default middleware;

export const config = {
  matcher: [
    // Skip Next internals and static files, but NOT /__clerk (see next matcher)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk Core 3 frontendApiProxy serves clerk.browser.js under /__clerk — must hit middleware
    "/__clerk/(.*)",
  ],
};
