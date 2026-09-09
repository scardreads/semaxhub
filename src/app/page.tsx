import Link from "next/link";
import { teachPages } from "@/lib/nav";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(15,118,110,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(120,113,108,0.12),_transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            The so-called &quot;KGB peptide,&quot; explained
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Semax, without the hype
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80 sm:text-xl">
            Semax Hub is a free educational resource on the peptide people call the
            &quot;KGB brain spray&quot;: what it is, where the story actually comes from,
            and what the research does (and doesn&apos;t) say. Curious. Sourced. Never a
            shop.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/what-is-semax"
              className="inline-flex items-center justify-center rounded-full bg-teal-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-900"
            >
              Start with What is Semax?
            </Link>
            <Link
              href="/origin"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-card px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-stone-100"
            >
              Read the origin story
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            Informational only. Not medical advice. We don&apos;t sell Semax.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Documented origin, not folklore ops stories
            </h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              The publicly documented story points to Russia&apos;s Institute of Molecular
              Genetics in the early 1980s. Work associated with N.F. Myasoedov,
              I.P. Ashmarin, and colleagues turned an ACTH fragment into the
              stabilized heptapeptide <span className="font-mono text-sm">MEHFPGP</span>
              {" "}(Semax). That laboratory and peptide-design record is what we treat as
              established.
            </p>
            <p className="mt-4 leading-relaxed text-ink/80">
              Online lore sometimes claims a dramatic KGB operations origin. That
              folklore is memorable as a discovery hook. It is <strong>not</strong>{" "}
              established as historical fact on this site. We label folklore as
              folklore, then land on the IMG record.
            </p>
            <Link
              href="/origin"
              className="mt-5 inline-flex text-sm font-medium text-teal-800 hover:underline"
            >
              Read the origin story →
            </Link>
          </div>
          <div className="rounded-3xl border border-teal-800/15 bg-teal-50/60 p-6 sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-ink">What this site is</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
              <li>An informational hub with sourced teach pages.</li>
              <li>A reading-room style discussion space.</li>
              <li>Clear about gaps: if we lack a citation, we say so.</li>
            </ul>
            <h3 className="mt-6 font-serif text-lg font-semibold text-ink">What it isn&apos;t</h3>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
              <li>Not a store, clinic, or dosing guide.</li>
              <li>No carts. No &quot;buy Semax.&quot; No medical advice.</li>
            </ul>
            <p className="mt-6 text-sm font-medium text-teal-900">
              Promise: Curious, sourced, never a shop.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-ink">Start reading</h2>
          <Link href="/sources" className="text-sm text-teal-800 hover:underline">
            Sources hub
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teachPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-800/25 hover:shadow-md"
            >
              <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-teal-900">
                {page.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{page.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
