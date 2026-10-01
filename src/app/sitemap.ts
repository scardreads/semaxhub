import type { MetadataRoute } from "next";
import { connection } from "next/server";
import {
  isDatabaseConfigured,
  listPublicThreadsForSitemap,
  listTopics,
} from "@/lib/discuss";
import {
  discussSitemapEntries,
  staticSitemapEntries,
  type SitemapThread,
  type SitemapTopic,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  let topics: SitemapTopic[] | null = null;
  let threads: SitemapThread[] = [];

  if (isDatabaseConfigured()) {
    try {
      const [topicRows, threadRows] = await Promise.all([
        listTopics(),
        listPublicThreadsForSitemap(),
      ]);
      topics = topicRows.map((topic) => ({
        slug: topic.slug,
        lastModified: topic.lastActivityAt,
      }));
      threads = threadRows;
    } catch {
      topics = null;
      threads = [];
    }
  }

  return [...staticSitemapEntries(), ...discussSitemapEntries(topics, threads)];
}
