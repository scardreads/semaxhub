import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { threads } from "@/lib/discuss";

export const metadata: Metadata = {
  title: "Discuss",
  description: "A quiet reading-room space for sourced questions about Semax.",
};

export default function DiscussIndexPage() {
  return (
    <PageShell
      eyebrow="Reading room"
      title="Discuss"
      lede="A quiet reading-room space for sourced questions about Semax. No sales pitches."
    >
      <div className="space-y-3">
        {threads.map((thread) => (
          <Link
            key={thread.slug}
            href={`/discuss/${thread.slug}`}
            className="block rounded-2xl border border-border bg-card p-5 transition hover:border-teal-800/25"
          >
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-ink">{thread.title}</h2>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted">
                {thread.status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{thread.summary}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
