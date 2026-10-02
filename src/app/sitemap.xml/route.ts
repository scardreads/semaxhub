import { fallbackSitemapEntries, loadSitemapEntries, renderSitemapXml, sitemapXmlResponse } from "@/lib/sitemap-document";

export const dynamic = "force-dynamic";

/**
 * Route handler, not a metadata `sitemap.ts`.
 * Next's metadata route serializes the return value after the function
 * returns, so a throw there is an HTTP 500 the route cannot catch.
 */
export async function GET() {
  try {
    const xml = renderSitemapXml(await loadSitemapEntries());
    return sitemapXmlResponse(xml);
  } catch (error) {
    console.error("sitemap fallback", error);
    return sitemapXmlResponse(renderSitemapXml(fallbackSitemapEntries()));
  }
}
