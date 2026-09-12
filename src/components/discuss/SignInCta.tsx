import Link from "next/link";
import { EMPTY_SIGN_IN_CTA } from "@/lib/discuss-copy";

export function SignInCta() {
  return (
    <div className="surface p-5">
      <p className="text-sm leading-relaxed text-ink">{EMPTY_SIGN_IN_CTA}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/sign-in" className="btn btn-primary">
          Sign in
        </Link>
        <Link href="/sign-up" className="btn btn-ghost">
          Create account
        </Link>
      </div>
    </div>
  );
}
