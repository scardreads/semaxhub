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

function lastmodText(value: unknown): string | null {
  try {
    if (value == null || value === "") return null;
    const date =
      value instanceof Date
        ? value
        : typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : null;
    if (!date || Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

function locText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!/^https:\/\/[^\s<>"']+$/i.test(url)) return null;
  return url;
}

/** Sitemap XML we control. Never throws; bad entries are skipped. */
export function renderSitemapXml(entries: MetadataRoute.Sitemap | null | undefined): string {
  const urls: string[] = [];
  const list = Array.isArray(entries) ? entries : [];
  for (const entry of list) {
    try {
      const loc = locText(entry?.url);
      if (!loc) continue;
      const lines = ["<url>", `<loc>${escapeXml(loc)}</loc>`];
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
    topicResult.status === "fulfilled" && Array.isArray(topicResult.value)
      ? topicResult.value.map((topic) => ({
          slug: topic.slug,
          lastModified: topic.lastActivityAt,
        }))
      : null;
  const threads: SitemapThread[] =
    threadResult.status === "fulfilled" && Array.isArray(threadResult.value)
      ? threadResult.value
      : [];

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

/**
 * Vercel compresses `application/xml` when the request advertises
 * `Accept-Encoding`. Curl decodes that brotli/gzip body. Other clients
 * (markdown fetchers, some libraries) advertise the same encodings and then
 * fail the compressed XML, which shows up as HTTP 500, while HTML and
 * `text/plain` from this host still succeed. `no-transform` tells the CDN
 * to leave the bytes alone and keep `Content-Length`.
 */
export function sitemapXmlResponse(xml: string): Response {
  const body = Buffer.from(xml, "utf8");
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate, no-transform",
      // Already-encoded responses are not compressed again. `identity` keeps
      // the XML bytes intact for clients that advertise gzip/br and then fail
      // to decode a compressed sitemap. `no-transform` alone is not enough:
      // Vercel still attaches `content-encoding: br`.
      "Content-Encoding": "identity",
      "Content-Length": String(body.byteLength),
    },
  });
}
