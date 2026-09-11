import type { Metadata } from "next";
import Link from "next/link";
import { DiscussBanner } from "@/components/discuss/DiscussBanner";
import { DbMissingBanner } from "@/components/discuss/DbMissingBanner";
import { isDatabaseConfigured, listTopics } from "@/lib/discuss";

export const metadata: Metadata = {
  title: "Discuss",
  description:
    "A reading-room for questions and peer talk about Semax. Anyone can read; sign in to post.",
};

export const dynamic = "force-dynamic";

export default async function DiscussIndexPage() {
  const dbReady = isDatabaseConfigured();
  let topics: Awaited<ReturnType<typeof listTopics>> = [];
  let loadError: string | null = null;

  if (dbReady) {
    try {
      topics = await listTopics();
    } catch {
      loadError = "Could not load topics. Check DATABASE_URL and migrations.";
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
        Reading room
      </p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Discuss
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/75">
        Questions and peer talk about Semax. Anyone can read; sign in to post or
        reply.
      </p>

      <div className="mt-8 space-y-4">
        <DiscussBanner />
        {!dbReady ? <DbMissingBanner /> : null}
        {loadError ? (
          <div className="rounded-2xl border border-amber-700/20 bg-amber-50 px-4 py-3 text-sm text-amber-950/85">
            {loadError}
          </div>
        ) : null}

        {dbReady && !loadError ? (
          <div className="space-y-3">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/discuss/${topic.slug}`}
                className="block rounded-2xl border border-border bg-card p-5 transition hover:border-teal-800/25"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-serif text-xl font-semibold text-ink">
                    {topic.title}
                  </h2>
                  <span className="text-xs text-muted">
                    {topic.threadCount}{" "}
                    {topic.threadCount === 1 ? "thread" : "threads"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {topic.description}
                </p>
              </Link>
            ))}
            {topics.length === 0 ? (
              <p className="text-sm text-muted">
                No topics yet. Run <code className="font-mono text-xs">npm run db:seed</code>.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
