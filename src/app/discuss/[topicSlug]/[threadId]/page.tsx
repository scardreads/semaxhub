import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeAuth } from "@/lib/auth-safe";
import { DiscussBanner } from "@/components/discuss/DiscussBanner";
import { DbMissingBanner } from "@/components/discuss/DbMissingBanner";
import { SignInCta } from "@/components/discuss/SignInCta";
import { NewReplyForm } from "@/components/discuss/NewReplyForm";
import { AdminHideButton } from "@/components/discuss/AdminHideButton";
import { ReportButton } from "@/components/discuss/ReportButton";
import { isAdmin } from "@/lib/admin";
import { EMPTY_NO_REPLIES } from "@/lib/discuss-copy";
import {
  getThreadById,
  isDatabaseConfigured,
  listRepliesForThread,
} from "@/lib/discuss";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string; threadId: string }>;
}): Promise<Metadata> {
  const { threadId } = await params;
  if (!isDatabaseConfigured()) return { title: "Thread" };
  try {
    const thread = await getThreadById(threadId, { includeHidden: true });
    return { title: thread ? thread.title : "Thread" };
  } catch {
    return { title: "Thread" };
  }
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ topicSlug: string; threadId: string }>;
}) {
  const { topicSlug, threadId } = await params;
  const dbReady = isDatabaseConfigured();

  if (!dbReady) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
        <DiscussBanner />
        <DbMissingBanner />
        <Link href="/discuss" className="text-sm text-teal-800 hover:underline">
          ← All topics
        </Link>
      </div>
    );
  }

  const admin = await isAdmin();
  const thread = await getThreadById(threadId, { includeHidden: admin });
  if (!thread || thread.topicSlug !== topicSlug) notFound();

  const { userId } = await safeAuth();
  const signedIn = Boolean(userId);
  const replies = await listRepliesForThread(thread.id, {
    includeHidden: admin,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
        {thread.topicTitle}
      </p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {thread.title}
        {thread.hiddenAt ? (
          <span className="ml-2 align-middle text-xs font-sans font-normal uppercase tracking-wide text-amber-800">
            hidden
          </span>
        ) : null}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {thread.authorDisplayName} ·{" "}
        {thread.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      <div className="mt-8 space-y-6">
        <DiscussBanner />

        <article className="rounded-2xl border border-border bg-card p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
            {thread.body}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <ReportButton
              targetType="thread"
              targetId={thread.id}
              signedIn={signedIn}
            />
            <AdminHideButton
              targetType="thread"
              targetId={thread.id}
              topicSlug={topicSlug}
              isHidden={Boolean(thread.hiddenAt)}
              isAdminUser={admin}
            />
          </div>
        </article>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-ink">Replies</h2>
          {replies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-card/70 p-5 text-sm text-ink/80">
              {EMPTY_NO_REPLIES}
            </div>
          ) : (
            replies.map((reply) => (
              <div
                key={reply.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="text-xs text-muted">
                  {reply.authorDisplayName} ·{" "}
                  {reply.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {reply.hiddenAt ? (
                    <span className="ml-2 uppercase tracking-wide text-amber-800">
                      hidden
                    </span>
                  ) : null}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
                  {reply.body}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <ReportButton
                    targetType="reply"
                    targetId={reply.id}
                    signedIn={signedIn}
                  />
                  <AdminHideButton
                    targetType="reply"
                    targetId={reply.id}
                    topicSlug={topicSlug}
                    threadId={thread.id}
                    isHidden={Boolean(reply.hiddenAt)}
                    isAdminUser={admin}
                  />
                </div>
              </div>
            ))
          )}
        </section>

        {signedIn ? (
          <NewReplyForm threadId={thread.id} topicSlug={topicSlug} />
        ) : (
          <SignInCta />
        )}

        <p className="text-sm">
          <Link
            href={`/discuss/${topicSlug}`}
            className="text-teal-800 hover:underline"
          >
            ← {thread.topicTitle}
          </Link>
        </p>
      </div>
    </div>
  );
}
