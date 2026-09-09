import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { getThread, threads } from "@/lib/discuss";

export function generateStaticParams() {
  return threads.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thread = getThread(slug);
  return { title: thread ? thread.title : "Thread" };
}

export default async function DiscussThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thread = getThread(slug);
  if (!thread) notFound();

  return (
    <PageShell eyebrow="Reading room" title={thread.title} lede={thread.summary}>
      <div className="rounded-2xl border border-dashed border-stone-300 bg-card/70 p-6">
        <p className="text-sm leading-relaxed text-ink/80">
          Discussion shell (v0 stub). Future replies can live here as a reading-room
          archive. Keep claims sourced, label folklore clearly, and never turn the
          thread into a shop.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Seed note
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Start from the teach pages, especially{" "}
              <Link href="/origin" className="text-teal-800 underline">
                Origin
              </Link>
              ,{" "}
              <Link href="/evidence" className="text-teal-800 underline">
                Evidence
              </Link>
              , and{" "}
              <Link href="/sources" className="text-teal-800 underline">
                Sources
              </Link>
              . If a claim needs a citation and we do not have one yet, say so.
            </p>
          </div>
        </div>
      </div>
      <p className="mt-6 text-sm">
        <Link href="/discuss" className="text-teal-800 hover:underline">
          ← All threads
        </Link>
      </p>
    </PageShell>
  );
}
