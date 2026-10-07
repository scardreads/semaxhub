import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://semaxhub.com</loc></url>\n</urlset>\n';

export function GET() {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Length": String(Buffer.byteLength(xml, "utf8")),
    },
  });
}
