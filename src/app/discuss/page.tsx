import type { Metadata } from "next";
import { DiscussBanner } from "@/components/discuss/DiscussBanner";
import { DbMissingBanner } from "@/components/discuss/DbMissingBanner";
import { TopicActivityLine } from "@/components/discuss/TopicActivityLine";
import { TopicRoomFrame } from "@/components/discuss/TopicRoomFrame";
import { isDatabaseConfigured, listTopics } from "@/lib/discuss";
import { DISCUSS_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Discuss",
  description: DISCUSS_DESCRIPTION,
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
              <TopicRoomFrame
                key={topic.id}
                slug={topic.slug}
                href={`/discuss/${topic.slug}`}
              >
                <h2 className="text-xl font-semibold text-ink">{topic.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {topic.description}
                </p>
                <TopicActivityLine
                  threadCount={topic.threadCount}
                  replyCount={topic.replyCount}
                  lastActivityAt={topic.lastActivityAt}
                />
              </TopicRoomFrame>
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
