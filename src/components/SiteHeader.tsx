import Link from "next/link";
import { HeaderAuth } from "@/components/HeaderAuth";
import { LearnMenu } from "@/components/LearnMenu";

const linkClass =
  "rounded-full px-3.5 py-2 text-base font-medium text-ink/80 transition hover:bg-accent-soft hover:text-ink";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="justify-self-start">
          <span className="text-xl font-semibold tracking-tight text-ink">
            Semax Hub
          </span>
        </Link>
        <nav className="flex items-center justify-center gap-1">
          <LearnMenu />
          <Link href="/discuss" className={linkClass}>
            Discuss
          </Link>
        </nav>
        <div className="justify-self-end">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
