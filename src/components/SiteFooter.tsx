import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-stone-100/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="font-serif text-lg font-semibold text-ink">Semax Hub</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Informational only. Not medical advice. We don&apos;t sell Semax.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/sources" className="text-ink/70 hover:text-ink">
            Sources
          </Link>
          <Link href="/about" className="text-ink/70 hover:text-ink">
            About
          </Link>
          <Link href="/discuss" className="text-ink/70 hover:text-ink">
            Discuss
          </Link>
          <Link href="/regulatory" className="text-ink/70 hover:text-ink">
            Regulatory
          </Link>
        </div>
      </div>
    </footer>
  );
}
