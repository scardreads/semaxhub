import Image from "next/image";
import Link from "next/link";
import { HeaderAuth } from "@/components/HeaderAuth";
import { LearnMenu } from "@/components/LearnMenu";

const linkClass =
  "rounded-full px-1.5 py-1.5 text-sm font-medium text-ink/80 transition hover:bg-accent-soft hover:text-ink sm:px-3.5 sm:py-2 sm:text-base";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-2.5 py-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-2 sm:px-6 sm:py-3">
        <Link
          href="/"
          className="site-brand flex min-w-0 shrink items-center gap-1 justify-self-start sm:gap-2"
        >
          <Image
            src="/semax-hub-logo.png"
            alt=""
            width={235}
            height={190}
            priority
            unoptimized
            className="h-5 w-[25px] shrink-0 sm:h-8 sm:w-10"
          />
          <span className="site-brand-name truncate text-sm font-semibold tracking-tight text-ink sm:text-xl">
            Semax Hub
          </span>
        </Link>
        <nav className="flex shrink-0 items-center justify-center gap-0.5 sm:gap-1">
          <LearnMenu />
          <Link href="/discuss" className={linkClass}>
            Discuss
          </Link>
        </nav>
        <div className="shrink-0 justify-self-end">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
