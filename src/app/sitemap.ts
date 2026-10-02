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

function fallbackSitemap(): MetadataRoute.Sitemap {
  return [...staticSitemapEntries(), ...discussSitemapEntries(null, [])];
}

/**
 * Next throws these to opt a route out of static rendering (`connection()`,
 * PPR postpone, prerender interrupt). They must propagate. Any other error
 * should still return a sitemap.
 */
function isFrameworkControlFlow(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const digest = "digest" in error ? (error as { digest?: unknown }).digest : undefined;
  if (
    digest === "DYNAMIC_SERVER_USAGE" ||
    digest === "NEXT_PRERENDER_INTERRUPTED" ||
    digest === "HANGING_PROMISE_REJECTION"
  ) {
    return true;
  }
  if ("code" in error && (error as { code?: unknown }).code === "NEXT_STATIC_GEN_BAILOUT") {
    return true;
  }
  return (
    error instanceof Error &&
    error.message.includes("needs to bail out of prerendering at this point because it used")
  );
}

async function discussEntries(): Promise<MetadataRoute.Sitemap> {
  if (!isDatabaseConfigured()) {
    return discussSitemapEntries(null, []);
  }

  const [topicResult, threadResult] = await Promise.allSettled([
    listTopics(),
    listPublicThreadsForSitemap(),
  ]);

  const topics: SitemapTopic[] | null =
    topicResult.status === "fulfilled"
      ? topicResult.value.map((topic) => ({
          slug: topic.slug,
          lastModified: topic.lastActivityAt,
        }))
      : null;
  const threads: SitemapThread[] =
    threadResult.status === "fulfilled" ? threadResult.value : [];

  return discussSitemapEntries(topics, threads);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connection();
    return [...staticSitemapEntries(), ...(await discussEntries())];
  } catch (error) {
    if (isFrameworkControlFlow(error)) throw error;
    console.error("sitemap fallback", error);
    return fallbackSitemap();
  }
}
