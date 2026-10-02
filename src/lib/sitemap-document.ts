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
import type { MetadataRoute } from "next";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function lastmodText(value: MetadataRoute.Sitemap[number]["lastModified"]): string | null {
  try {
    if (value == null || value === "") return null;
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) return null;
      return value.toISOString();
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || null;
    }
    return null;
  } catch {
    return null;
  }
}

/** Sitemap XML we control. Never throws; bad entries are skipped. */
export function renderSitemapXml(entries: MetadataRoute.Sitemap | null | undefined): string {
  const urls: string[] = [];
  const list = Array.isArray(entries) ? entries : [];
  for (const entry of list) {
    try {
      if (!entry || typeof entry.url !== "string" || !entry.url.trim()) continue;
      const lines = ["<url>", `<loc>${escapeXml(entry.url.trim())}</loc>`];
      const lastmod = lastmodText(entry.lastModified);
      if (lastmod) lines.push(`<lastmod>${escapeXml(lastmod)}</lastmod>`);
      if (typeof entry.changeFrequency === "string" && entry.changeFrequency) {
        lines.push(`<changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`);
      }
      if (typeof entry.priority === "number" && Number.isFinite(entry.priority)) {
        lines.push(`<priority>${entry.priority}</priority>`);
      }
      lines.push("</url>");
      urls.push(lines.join("\n"));
    } catch {
      continue;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export function fallbackSitemapEntries(): MetadataRoute.Sitemap {
  return [...staticSitemapEntries(), ...discussSitemapEntries(null, [])];
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

/**
 * Static pages, Discuss rooms, and public threads.
 * A database failure becomes seeded rooms. This function itself does not throw.
 */
export async function loadSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    return [...staticSitemapEntries(), ...(await discussEntries())];
  } catch (error) {
    console.error("sitemap fallback", error);
    return fallbackSitemapEntries();
  }
}

export function sitemapXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
