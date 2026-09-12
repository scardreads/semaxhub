import type { Metadata } from "next";
import Link from "next/link";
import { ClerkSignIn } from "@/components/ClerkSignIn";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default function SignInPage() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          Clerk is not configured yet. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and
          CLERK_SECRET_KEY, then enable Email verification and Google OAuth in
          the Clerk dashboard.
        </p>
        <Link href="/discuss" className="mt-6 inline-block text-accent hover:underline">
          Back to Discuss
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-h-[480px] max-w-md px-4 py-16">
      <ClerkSignIn />
    </div>
  );
}
