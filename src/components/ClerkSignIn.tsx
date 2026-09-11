"use client";

import { ClerkFailed, ClerkLoading, SignIn } from "@clerk/nextjs";

export function ClerkSignIn() {
  return (
    <div className="min-h-[480px] w-full">
      <ClerkLoading>
        <p className="text-center text-sm text-muted">Loading sign in…</p>
      </ClerkLoading>
      <ClerkFailed>
        <p className="text-center text-sm text-muted">
          Could not load sign in. Refresh, or check that Clerk Production allows
          this domain.
        </p>
      </ClerkFailed>
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}
