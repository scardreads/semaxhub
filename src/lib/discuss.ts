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
