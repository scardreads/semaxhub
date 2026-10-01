import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import type { Topic, Thread, Reply } from "@/db/schema";

export type { Topic, Thread, Reply };
export { isDatabaseConfigured };

export type TopicActivity = {
  threadCount: number;
  replyCount: number;
  lastActivityAt: Date | null;
};

export type TopicWithCounts = Topic & TopicActivity;

const EMPTY_ACTIVITY: TopicActivity = {
  threadCount: 0,
  replyCount: 0,
  lastActivityAt: null,
};

function toDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function laterDate(a: Date | null, b: Date | null): Date | null {
  if (!a) return b;
  if (!b) return a;
  return a.getTime() >= b.getTime() ? a : b;
}

/** Visible threads, replies on those threads, and the newer of the two timestamps. */
async function loadTopicActivity(): Promise<Map<string, TopicActivity>> {
  const db = getDb();

  const threadRows = await db
    .select({
      topicId: schema.threads.topicId,
      threadCount: sql<number>`cast(count(*) as int)`,
      lastThreadAt: sql<Date | string | null>`max(${schema.threads.createdAt})`,
    })
    .from(schema.threads)
    .where(isNull(schema.threads.hiddenAt))
    .groupBy(schema.threads.topicId);

  const replyRows = await db
    .select({
      topicId: schema.threads.topicId,
      replyCount: sql<number>`cast(count(${schema.replies.id}) as int)`,
      lastReplyAt: sql<Date | string | null>`max(${schema.replies.createdAt})`,
    })
    .from(schema.replies)
    .innerJoin(schema.threads, eq(schema.threads.id, schema.replies.threadId))
    .where(and(isNull(schema.replies.hiddenAt), isNull(schema.threads.hiddenAt)))
    .groupBy(schema.threads.topicId);

  const map = new Map<string, TopicActivity>();

  for (const row of threadRows) {
    map.set(row.topicId, {
      threadCount: Number(row.threadCount) || 0,
      replyCount: 0,
      lastActivityAt: toDate(row.lastThreadAt),
    });
  }

  for (const row of replyRows) {
    const prev = map.get(row.topicId) ?? { ...EMPTY_ACTIVITY };
    map.set(row.topicId, {
      threadCount: prev.threadCount,
      replyCount: Number(row.replyCount) || 0,
      lastActivityAt: laterDate(prev.lastActivityAt, toDate(row.lastReplyAt)),
    });
  }

  return map;
}

export async function listTopics(): Promise<TopicWithCounts[]> {
  const db = getDb();
  const topicRows = await db
    .select()
    .from(schema.topics)
    .orderBy(asc(schema.topics.sortOrder));

  const activity = await loadTopicActivity();

  return topicRows.map((topic) => ({
    ...topic,
    ...(activity.get(topic.id) ?? EMPTY_ACTIVITY),
  }));
}

export async function getTopicActivity(topicId: string): Promise<TopicActivity> {
  const activity = await loadTopicActivity();
  return activity.get(topicId) ?? { ...EMPTY_ACTIVITY };
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

export type PublicThreadSitemapEntry = {
  id: string;
  topicSlug: string;
  lastModified: Date;
};

/** Visible threads only. Hidden threads stay out of the sitemap. */
export async function listPublicThreadsForSitemap(): Promise<
  PublicThreadSitemapEntry[]
> {
  const db = getDb();
  const rows = await db
    .select({
      id: schema.threads.id,
      topicSlug: schema.topics.slug,
      createdAt: schema.threads.createdAt,
      lastReplyAt: sql<Date | string | null>`max(${schema.replies.createdAt})`,
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
    .groupBy(schema.threads.id, schema.topics.slug, schema.threads.createdAt);

  return rows.map((row) => ({
    id: row.id,
    topicSlug: row.topicSlug,
    lastModified: laterDate(row.createdAt, toDate(row.lastReplyAt)) ?? row.createdAt,
  }));
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
      authorImageUrl: schema.threads.authorImageUrl,
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

export type HomeDiscussModule =
  | {
      kind: "thread";
      id: string;
      title: string;
      href: string;
      topicSlug: string;
      authorDisplayName: string;
      authorImageUrl: string | null;
      createdAt: Date;
      replyCount: number;
      source: "recent" | "popular";
    }
  | {
      kind: "topic";
      id: string;
      title: string;
      href: string;
      topicSlug: string;
      description: string;
    };

export async function listHomeDiscussModules(
  limit = 6,
): Promise<HomeDiscussModule[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const db = getDb();
    const threadRows = await db
      .select({
        id: schema.threads.id,
        title: schema.threads.title,
        authorDisplayName: schema.threads.authorDisplayName,
        authorImageUrl: schema.threads.authorImageUrl,
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
        schema.threads.authorImageUrl,
        schema.threads.createdAt,
        schema.topics.slug,
      );

    const recent = [...threadRows].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const popular = [...threadRows]
      .filter((row) => Number(row.replyCount) > 0)
      .sort((a, b) => {
        const byReplies = Number(b.replyCount) - Number(a.replyCount);
        if (byReplies !== 0) return byReplies;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

    const picked: HomeDiscussModule[] = [];
    const seenThread = new Set<string>();

    const pushThread = (
      row: (typeof threadRows)[number],
      source: "recent" | "popular",
    ) => {
      if (seenThread.has(row.id) || picked.length >= limit) return;
      seenThread.add(row.id);
      picked.push({
        kind: "thread",
        id: row.id,
        title: row.title,
        href: `/discuss/${row.topicSlug}/${row.id}`,
        topicSlug: row.topicSlug,
        authorDisplayName: row.authorDisplayName,
        authorImageUrl: row.authorImageUrl,
        createdAt: row.createdAt,
        replyCount: Number(row.replyCount),
        source,
      });
    };

    for (const row of recent.slice(0, 2)) pushThread(row, "recent");
    for (const row of popular) pushThread(row, "popular");

    if (picked.length < limit) {
      const topics = await db
        .select({
          id: schema.topics.id,
          slug: schema.topics.slug,
          title: schema.topics.title,
          description: schema.topics.description,
        })
        .from(schema.topics)
        .orderBy(asc(schema.topics.sortOrder));
      const seenTopic = new Set<string>();
      for (const topic of topics) {
        if (seenTopic.has(topic.slug) || picked.length >= limit) break;
        seenTopic.add(topic.slug);
        picked.push({
          kind: "topic",
          id: topic.id,
          title: topic.title,
          href: `/discuss/${topic.slug}`,
          topicSlug: topic.slug,
          description: topic.description,
        });
      }
    }

    return picked.slice(0, limit);
  } catch {
    return [];
  }
}
