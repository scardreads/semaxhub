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
    <div className="page-shell discuss-shell">
      <div className="page-measure">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Reading room
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
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
          <div className="surface px-4 py-3 text-sm text-ink">
            {loadError}
          </div>
        ) : null}

        {dbReady && !loadError ? (
          <div className="discuss-list">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/discuss/${topic.slug}`}
                className="block surface px-4 py-3 transition hover:border-accent/40"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-semibold text-ink">
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
    </div>
  );
}
