import Link from "next/link";
import { EMPTY_SIGN_IN_CTA } from "@/lib/discuss-copy";

export function SignInCta() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-card/70 p-5">
      <p className="text-sm leading-relaxed text-ink/80">{EMPTY_SIGN_IN_CTA}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/sign-in"
          className="rounded-full bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink hover:bg-stone-100"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
