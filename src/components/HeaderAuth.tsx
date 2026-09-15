"use client";

import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { displayNameFromUser } from "@/lib/display-name";
import { SyncOAuthAvatar } from "@/components/SyncOAuthAvatar";

const signInClassName =
  "btn btn-ghost px-3 py-1.5 text-sm";

function SignInLink() {
  return (
    <Link href="/sign-in" className={signInClassName}>
      Sign in
    </Link>
  );
}

function HeaderAuthLoaded() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <SignInLink />;
  }

  const name = user
    ? displayNameFromUser({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      })
    : null;

  return (
    <div className="flex items-center gap-2">
      <SyncOAuthAvatar />
      {name ? (
        <span className="max-w-[12ch] truncate text-sm font-medium text-ink sm:max-w-[16ch]">
          {name}
        </span>
      ) : null}
      <UserButton />
    </div>
  );
}

export function HeaderAuth() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return <SignInLink />;
  }

  return <HeaderAuthLoaded />;
}
