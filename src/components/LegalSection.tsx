import Link from "next/link";
import type { ReactNode } from "react";

export const LEGAL_EFFECTIVE_DATE = "September 30, 2026";

const linkClass =
  "text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";

export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={linkClass}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-4 text-lg leading-relaxed text-ink/85">
        {children}
      </div>
    </section>
  );
}

/** No public contact address exists in the repo or on the site. */
export function LegalContact() {
  return (
    <LegalSection title="Contact">
      <p>
        We have not published a contact email or mailing address. If we add one,
        it will appear in this section. Until then, there is no separate inbox
        for privacy requests, content removal, or questions about these pages.
      </p>
    </LegalSection>
  );
}
