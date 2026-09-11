import Link from "next/link";
import { learnNav } from "@/lib/nav";
import { HeaderAuth } from "@/components/HeaderAuth";

const linkClass =
  "rounded-full px-2.5 py-1.5 text-sm text-ink/75 transition hover:bg-stone-200/60 hover:text-ink";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">
            Semax Hub
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <details className="learn-nav relative">
            <summary className={`${linkClass} cursor-pointer`}>
              Learn
            </summary>
            <div className="learn-panel absolute left-0 top-full z-50 mt-1 min-w-52 rounded-2xl border border-border bg-card p-2 shadow-lg max-lg:right-0 max-lg:left-auto">
              {learnNav.map((item) => (
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
          <Link href="/discuss" className={linkClass}>
            Discuss
          </Link>
          <div className="ml-1 flex items-center">
            <HeaderAuth />
          </div>
        </nav>
      </div>
    </header>
  );
}
