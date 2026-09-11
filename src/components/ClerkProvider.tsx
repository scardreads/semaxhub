"use client";

import { ClerkProvider as ClerkRoot } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function AppClerkProvider({ children }: { children: ReactNode }) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return <>{children}</>;
  }
  return (
    <ClerkRoot
      publishableKey={key}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
      signInFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ??
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ??
        "/discuss"
      }
      signUpFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ??
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ??
        "/discuss"
      }
    >
      {children}
    </ClerkRoot>
  );
}
