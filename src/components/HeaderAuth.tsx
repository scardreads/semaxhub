"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export function HeaderAuth() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return (
      <Link
        href="/sign-in"
        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink/80 hover:bg-stone-100"
      >
        Sign in
      </Link>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink/80 hover:bg-stone-100"
        >
          Sign in
        </Link>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
