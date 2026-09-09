import Link from "next/link";
import { primaryNav } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">
            Semax Hub
          </span>
          <span className="hidden text-xs uppercase tracking-[0.14em] text-muted sm:inline">
            Educational
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {primaryNav.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 py-1.5 text-ink/75 transition hover:bg-stone-200/60 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/discuss"
            className="rounded-full px-2.5 py-1.5 text-ink/75 transition hover:bg-stone-200/60 hover:text-ink"
          >
            Discuss
          </Link>
          <Link
            href="/about"
            className="rounded-full px-2.5 py-1.5 text-ink/75 transition hover:bg-stone-200/60 hover:text-ink"
          >
            About
          </Link>
        </nav>
        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-lg">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-ink/80 hover:bg-stone-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
