import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import type { Topic, Thread, Reply } from "@/db/schema";

export type { Topic, Thread, Reply };
export { isDatabaseConfigured };

export type TopicWithCounts = Topic & { threadCount: number };

export async function listTopics(): Promise<TopicWithCounts[]> {
  const db = getDb();
  const topicRows = await db
    .select()
    .from(schema.topics)
    .orderBy(asc(schema.topics.sortOrder));

  const countRows = await db
    .select({
      topicId: schema.threads.topicId,
      threadCount: sql<number>`cast(count(*) as int)`,
    })
    .from(schema.threads)
    .where(isNull(schema.threads.hiddenAt))
    .groupBy(schema.threads.topicId);

  const countMap = new Map(
    countRows.map((r) => [r.topicId, Number(r.threadCount)]),
  );

  return topicRows.map((t) => ({
    ...t,
    threadCount: countMap.get(t.id) ?? 0,
  }));
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function listThreadsForTopic(
  topicId: string,
  opts: { includeHidden?: boolean } = {},
): Promise<Thread[]> {
  const db = getDb();
  const conditions = [eq(schema.threads.topicId, topicId)];
  if (!opts.includeHidden) {
    conditions.push(isNull(schema.threads.hiddenAt));
  }
  return db
    .select()
    .from(schema.threads)
    .where(and(...conditions))
    .orderBy(desc(schema.threads.createdAt));
}

export async function getThreadById(
  threadId: string,
  opts: { includeHidden?: boolean } = {},
): Promise<(Thread & { topicSlug: string; topicTitle: string }) | null> {
  const db = getDb();
  const rows = await db
    .select({
      id: schema.threads.id,
      topicId: schema.threads.topicId,
      authorClerkId: schema.threads.authorClerkId,
      authorDisplayName: schema.threads.authorDisplayName,
      title: schema.threads.title,
      body: schema.threads.body,
      createdAt: schema.threads.createdAt,
      hiddenAt: schema.threads.hiddenAt,
      topicSlug: schema.topics.slug,
      topicTitle: schema.topics.title,
    })
    .from(schema.threads)
    .innerJoin(schema.topics, eq(schema.topics.id, schema.threads.topicId))
    .where(eq(schema.threads.id, threadId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (!opts.includeHidden && row.hiddenAt) return null;
  return row;
}

export async function listRepliesForThread(
  threadId: string,
  opts: { includeHidden?: boolean } = {},
): Promise<Reply[]> {
  const db = getDb();
  const conditions = [eq(schema.replies.threadId, threadId)];
  if (!opts.includeHidden) {
    conditions.push(isNull(schema.replies.hiddenAt));
  }
  return db
    .select()
    .from(schema.replies)
    .where(and(...conditions))
    .orderBy(asc(schema.replies.createdAt));
}

export type HomeDiscussHighlight = {
  id: string;
  title: string;
  authorDisplayName: string;
  createdAt: Date;
  topicSlug: string;
  replyCount: number;
  source: "recent" | "popular";
};

export async function listHomeDiscussHighlights(
  limit = 6,
): Promise<HomeDiscussHighlight[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.threads.id,
        title: schema.threads.title,
        authorDisplayName: schema.threads.authorDisplayName,
        createdAt: schema.threads.createdAt,
        topicSlug: schema.topics.slug,
        replyCount: sql<number>`cast(count(${schema.replies.id}) as int)`,
      })
      .from(schema.threads)
      .innerJoin(schema.topics, eq(schema.topics.id, schema.threads.topicId))
      .leftJoin(
        schema.replies,
        and(
          eq(schema.replies.threadId, schema.threads.id),
          isNull(schema.replies.hiddenAt),
        ),
      )
      .where(isNull(schema.threads.hiddenAt))
      .groupBy(
        schema.threads.id,
        schema.threads.title,
        schema.threads.authorDisplayName,
        schema.threads.createdAt,
        schema.topics.slug,
      );

    const recent = [...rows].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const popular = [...rows].sort((a, b) => {
      const byReplies = Number(b.replyCount) - Number(a.replyCount);
      if (byReplies !== 0) return byReplies;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const picked: HomeDiscussHighlight[] = [];
    const seen = new Set<string>();
    const take = Math.max(1, Math.ceil(limit / 2));

    const push = (
      row: (typeof rows)[number],
      source: HomeDiscussHighlight["source"],
    ) => {
      if (seen.has(row.id) || picked.length >= limit) return;
      seen.add(row.id);
      picked.push({
        id: row.id,
        title: row.title,
        authorDisplayName: row.authorDisplayName,
        createdAt: row.createdAt,
        topicSlug: row.topicSlug,
        replyCount: Number(row.replyCount),
        source,
      });
    };

    for (let i = 0; i < take; i++) {
      if (recent[i]) push(recent[i], "recent");
      if (popular[i]) push(popular[i], "popular");
    }
    return picked;
  } catch {
    return [];
  }
}
