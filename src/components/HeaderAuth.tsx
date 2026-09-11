"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

const signInClassName =
  "rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink/80 hover:bg-stone-100";

function SignInLink() {
  return (
    <Link href="/sign-in" className={signInClassName}>
      Sign in
    </Link>
  );
}

function HeaderAuthLoaded() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return <SignInLink />;
  }

  return <UserButton />;
}

export function HeaderAuth() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return <SignInLink />;
  }

  return <HeaderAuthLoaded />;
}
