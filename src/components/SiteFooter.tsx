import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-6 py-10 sm:px-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="text-lg font-semibold text-ink">Semax Hub</p>
          <p className="mt-2 text-sm leading-relaxed">
            Informational only. Not medical advice. We don&apos;t sell Semax.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/about">About</Link>
          <Link href="/sources">Sources</Link>
          <Link href="/semax-vs-selank">Semax vs Selank</Link>
          <Link href="/discuss">Discuss</Link>
        </div>
      </div>
    </footer>
  );
}
