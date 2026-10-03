import {
  fallbackSitemapEntries,
  loadSitemapEntries,
  renderSitemapXml,
  sitemapXmlResponse,
} from "@/lib/sitemap-document";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Route handler, not a metadata `sitemap.ts`.
 * Next's generated metadata GET calls `resolveRouteData` after `sitemap()`
 * returns, and `Date#toISOString()` on an Invalid Date throws there — a 500
 * the route's own try/catch cannot see. This handler writes the XML itself.
 */
export async function GET() {
  try {
    return sitemapXmlResponse(renderSitemapXml(await loadSitemapEntries()));
  } catch (error) {
    console.error("sitemap fallback", error);
    return sitemapXmlResponse(renderSitemapXml(fallbackSitemapEntries()));
  }
}
