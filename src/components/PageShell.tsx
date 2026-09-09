import type { ReactNode } from "react";
import { TrustBanner } from "./TrustBanner";

export function PageShell({
  children,
  eyebrow,
  title,
  lede,
}: {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  lede?: string;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <TrustBanner />
      </div>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
      ) : null}
      {lede ? <p className="mt-3 text-lg leading-relaxed text-ink/75">{lede}</p> : null}
      <div className="mt-8">{children}</div>
    </article>
  );
}
