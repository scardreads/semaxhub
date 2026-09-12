"use client";

import { ClerkProvider as ClerkRoot } from "@clerk/nextjs";
import type { InternalClerkScriptProps } from "@clerk/react/internal";
import type { ReactNode } from "react";
import {
  clerkClientProxyUrl,
  clerkJsAssetUrl,
  clerkUiAssetUrl,
} from "@/lib/clerk-proxy";

export function AppClerkProvider({ children }: { children: ReactNode }) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return <>{children}</>;
  }

  const scriptProps: InternalClerkScriptProps = {
    __internal_clerkJSUrl: clerkJsAssetUrl(),
    __internal_clerkUIUrl: clerkUiAssetUrl(),
  };

  return (
    <ClerkRoot
      publishableKey={key}
      proxyUrl={clerkClientProxyUrl()}
      {...scriptProps}
      appearance={{
        variables: {
          colorPrimary: "#2F6FED",
          colorBackground: "#ffffff",
          colorForeground: "#1D1D1F",
          colorMutedForeground: "#6E6E73",
          colorInput: "#ffffff",
          colorInputForeground: "#1D1D1F",
          borderRadius: "0.75rem",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
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
