"use client";

import { ClerkFailed, ClerkLoading, SignUp } from "@clerk/nextjs";

export function ClerkSignUp() {
  return (
    <div className="min-h-[480px] w-full">
      <ClerkLoading>
        <p className="text-center text-sm text-muted">Loading sign up…</p>
      </ClerkLoading>
      <ClerkFailed>
        <p className="text-center text-sm text-muted">
          Could not load sign up. Refresh, then confirm Clerk Dashboard →
          Domains → Frontend API proxy is https://semaxhub-brown.vercel.app/__clerk.
        </p>
      </ClerkFailed>
      <SignUp signInUrl="/sign-in" />
    </div>
  );
}
