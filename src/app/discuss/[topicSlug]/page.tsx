import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeAuth } from "@/lib/auth-safe";
import { DiscussBanner } from "@/components/discuss/DiscussBanner";
import { DbMissingBanner } from "@/components/discuss/DbMissingBanner";
import { SignInCta } from "@/components/discuss/SignInCta";
import { NewThreadForm } from "@/components/discuss/NewThreadForm";
import { AdminHideButton } from "@/components/discuss/AdminHideButton";
import { ReportButton } from "@/components/discuss/ReportButton";
import { isAdmin } from "@/lib/admin";
import { EMPTY_NO_THREADS } from "@/lib/discuss-copy";
import {
  getTopicBySlug,
  isDatabaseConfigured,
  listThreadsForTopic,
} from "@/lib/discuss";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}): Promise<Metadata> {
  const { topicSlug } = await params;
  if (!isDatabaseConfigured()) return { title: "Discuss" };
  try {
    const topic = await getTopicBySlug(topicSlug);
    return { title: topic ? topic.title : "Topic" };
  } catch {
    return { title: "Discuss" };
  }
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const dbReady = isDatabaseConfigured();

  if (!dbReady) {
    return (
      <div className="page-wrap space-y-4">
        <DiscussBanner />
        <DbMissingBanner />
        <Link href="/discuss" className="text-sm text-accent hover:underline">
          ← All topics
        </Link>
      </div>
    );
  }

  const topic = await getTopicBySlug(topicSlug);
  if (!topic) notFound();

  const admin = await isAdmin();
  const { userId } = await safeAuth();
  const signedIn = Boolean(userId);
  const threads = await listThreadsForTopic(topic.id, { includeHidden: admin });

  return (
    <div className="page-wrap">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Reading room
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {topic.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/75">
        {topic.description}
      </p>
      {topic.teachHref ? (
        <p className="mt-2 text-sm">
          <Link href={topic.teachHref} className="text-accent hover:underline">
            Read the teach page →
          </Link>
        </p>
      ) : null}

      <div className="mt-8 space-y-6">
        <DiscussBanner />

        {signedIn ? (
          <NewThreadForm
            topicId={topic.id}
            topicSlug={topic.slug}
            starterPrompt={topic.starterPrompt}
          />
        ) : (
          <SignInCta />
        )}

        <div className="space-y-3">
          {threads.length === 0 ? (
            <div className="surface p-5 text-sm text-ink">
              {EMPTY_NO_THREADS}
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                className="surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={`/discuss/${topic.slug}/${thread.id}`}
                    className="text-xl font-semibold text-ink hover:text-accent"
                  >
                    {thread.title}
                    {thread.hiddenAt ? (
                      <span className="ml-2 text-xs font-sans font-normal uppercase tracking-wide text-amber-800">
                        hidden
                      </span>
                    ) : null}
                  </Link>
                  <div className="flex items-center gap-3">
                    <ReportButton
                      targetType="thread"
                      targetId={thread.id}
                      signedIn={signedIn}
                    />
                    <AdminHideButton
                      targetType="thread"
                      targetId={thread.id}
                      topicSlug={topic.slug}
                      isHidden={Boolean(thread.hiddenAt)}
                      isAdminUser={admin}
                    />
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {thread.body}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {thread.authorDisplayName} ·{" "}
                  {thread.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        <p className="text-sm">
          <Link href="/discuss" className="text-accent hover:underline">
            ← All topics
          </Link>
        </p>
      </div>
    </div>
  );
}
