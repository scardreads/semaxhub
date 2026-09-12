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
    <article className="page-wrap">
      <div className="mb-8">
        <TrustBanner />
      </div>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
      ) : null}
      {lede ? <p className="mt-3 text-lg leading-relaxed text-ink">{lede}</p> : null}
      <div className="mt-8">{children}</div>
    </article>
  );
}
