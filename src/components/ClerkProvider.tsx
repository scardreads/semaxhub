"use client";

import { ClerkProvider as ClerkRoot } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function AppClerkProvider({ children }: { children: ReactNode }) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return <>{children}</>;
  }
  return <ClerkRoot publishableKey={key}>{children}</ClerkRoot>;
}
