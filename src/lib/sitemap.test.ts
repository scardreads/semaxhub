import assert from "node:assert/strict";
import test from "node:test";
import { safeDecodedPathname, sitemapPathFromEncoded } from "./decode-pathname";
import { publicThreadSitemapLastModified } from "./discuss";
import {
  discussSitemapEntries,
  sitemapLastModified,
  staticSitemapEntries,
} from "./seo";
import {
  fallbackSitemapEntries,
  renderSitemapXml,
  sitemapXmlResponse,
} from "./sitemap-document";
import { DISCUSS_ROOMS } from "./discuss-rooms";

const postgresTimestamp = "2026-09-29 20:36:10.735+00";
const replyIso = "2026-09-29T20:48:10.735Z";

test("string createdAt plus a reply Date does not throw and keeps the later timestamp", () => {
  const lastModified = publicThreadSitemapLastModified(
    postgresTimestamp,
    new Date(replyIso),
  );
  assert.equal(lastModified?.toISOString(), replyIso);
});

test("string createdAt alone becomes a Date", () => {
  const lastModified = publicThreadSitemapLastModified(postgresTimestamp, null);
  assert.equal(lastModified?.toISOString(), "2026-09-29T20:36:10.735Z");
});

test("unreadable timestamps become null instead of an Invalid Date", () => {
  assert.equal(publicThreadSitemapLastModified("not-a-date", "also-nope"), null);
  assert.equal(publicThreadSitemapLastModified(new Date("nope"), null), null);
  assert.equal(
    publicThreadSitemapLastModified(
      {
        getTime() {
          throw new Error("boom");
        },
      },
      null,
    ),
    null,
  );
});

test("sitemapLastModified emits ISO strings and drops invalid values", () => {
  assert.equal(sitemapLastModified(postgresTimestamp), "2026-09-29T20:36:10.735Z");
  assert.equal(sitemapLastModified(new Date(replyIso)), replyIso);
  assert.equal(sitemapLastModified(new Date("nope")), undefined);
  assert.equal(sitemapLastModified("not-a-date"), undefined);
  assert.equal(sitemapLastModified(null), undefined);
});

test("bad dates and one bad thread still leave static pages, rooms, and good threads", () => {
  const entries = [
    ...staticSitemapEntries(),
    ...discussSitemapEntries(
      [{ slug: "effects-experiences", lastModified: new Date("nope") }],
      [
        {
          id: "00130570-3da7-4a2a-93a0-1e214e1b8387",
          topicSlug: "effects-experiences",
          lastModified: postgresTimestamp,
        },
        {
          id: "bad id",
          topicSlug: "effects-experiences",
          lastModified: replyIso,
        },
        {
          id: "126b9486-9c4a-4ec2-97be-a18fa372df2f",
          topicSlug: "general-questions",
          lastModified: {
            getTime() {
              throw new Error("boom");
            },
          } as unknown as Date,
        },
      ],
    ),
  ];

  assert.ok(entries.some((entry) => entry.url.endsWith("/learn")));
  assert.ok(entries.some((entry) => entry.url.endsWith("/discuss/effects-experiences")));
  assert.ok(
    entries.some((entry) =>
      entry.url.endsWith("/discuss/effects-experiences/00130570-3da7-4a2a-93a0-1e214e1b8387"),
    ),
  );
  assert.ok(
    entries.some((entry) =>
      entry.url.endsWith("/discuss/general-questions/126b9486-9c4a-4ec2-97be-a18fa372df2f"),
    ),
  );
  assert.equal(
    entries.some((entry) => entry.url.includes("bad id")),
    false,
  );

  const room = entries.find((entry) => entry.url.endsWith("/discuss/effects-experiences"));
  assert.equal(room?.lastModified, undefined);
  const thread = entries.find((entry) =>
    entry.url.endsWith("/discuss/effects-experiences/00130570-3da7-4a2a-93a0-1e214e1b8387"),
  );
  assert.equal(thread?.lastModified, "2026-09-29T20:36:10.735Z");
  for (const entry of entries) {
    if (entry.lastModified instanceof Date) {
      assert.equal(Number.isNaN(entry.lastModified.getTime()), false);
    }
  }
});

test("null topics fall back to every seeded room", () => {
  const entries = discussSitemapEntries(null, []);
  for (const room of DISCUSS_ROOMS) {
    assert.ok(entries.some((entry) => entry.url.endsWith(`/discuss/${room.slug}`)));
  }
});

test("percent-encoded /sitemap.xml decodes to the canonical path", () => {
  assert.equal(sitemapPathFromEncoded("/%73itemap.xml"), "/sitemap.xml");
  assert.equal(sitemapPathFromEncoded("/sitemap%2Exml"), "/sitemap.xml");
  assert.equal(sitemapPathFromEncoded("/sitemap%2exml"), "/sitemap.xml");
  assert.equal(sitemapPathFromEncoded("/site%6dap.xml"), "/sitemap.xml");
  assert.equal(sitemapPathFromEncoded("/%2573itemap.xml"), "/sitemap.xml");
  assert.equal(safeDecodedPathname("/sitemap.xml"), null);
  assert.equal(sitemapPathFromEncoded("/sitemap.xml"), null);
  assert.equal(sitemapPathFromEncoded("/%2e%2e/sitemap.xml"), null);
  assert.equal(sitemapPathFromEncoded("/%2e%2e%2fsitemap.xml"), null);
  assert.equal(sitemapPathFromEncoded("/%"), null);
  assert.equal(sitemapPathFromEncoded("/foo%00bar"), null);
  assert.equal(sitemapPathFromEncoded("/robots%2Etxt"), null);
  assert.equal(sitemapPathFromEncoded("/%64iscuss"), null);
});

test("our sitemap renderer stays valid XML when Next's serializer would throw", () => {
  const xml = renderSitemapXml([
    ...staticSitemapEntries(),
    ...discussSitemapEntries(
      [{ slug: "dosing-schedules", lastModified: new Date("nope") }],
      [
        {
          id: "1289a578-b32c-4bb6-bddd-2bfea6bd0454",
          topicSlug: "dosing-schedules",
          lastModified: new Date("nope"),
        },
      ],
    ),
    { url: "https://semaxhub.com/discuss/a&b", lastModified: new Date("nope") },
    { url: "javascript:alert(1)" },
    { url: "not a url" },
  ]);

  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<loc>https:\/\/semaxhub\.com\/discuss\/dosing-schedules<\/loc>/);
  assert.match(xml, /<loc>https:\/\/semaxhub\.com\/discuss\/a&amp;b<\/loc>/);
  assert.match(xml, /1289a578-b32c-4bb6-bddd-2bfea6bd0454/);
  assert.equal(xml.includes("<lastmod>"), false);
  assert.equal(xml.includes("Invalid"), false);
  assert.equal(xml.includes("javascript:"), false);
  assert.equal(xml.includes("not a url"), false);

  const fallback = renderSitemapXml(fallbackSitemapEntries());
  assert.match(fallback, /<loc>https:\/\/semaxhub\.com<\/loc>/);
  assert.match(fallback, /<loc>https:\/\/semaxhub\.com\/discuss\/general-questions<\/loc>/);
  assert.equal(fallback.includes("semaxhub-brown.vercel.app"), false);
  for (const room of DISCUSS_ROOMS) {
    assert.match(fallback, new RegExp(`<loc>https://semaxhub\\.com/discuss/${room.slug}</loc>`));
  }
});

test("Next sitemap serializer accepts our entries and rejects an Invalid Date", async () => {
  const { resolveRouteData } = (await import(
    "next/dist/build/webpack/loaders/metadata/resolve-route-data.js"
  )) as {
    resolveRouteData: (
      data: { url: string; lastModified?: string | Date }[],
      fileType: "sitemap",
    ) => string;
  };

  const entries = [
    ...staticSitemapEntries(),
    ...discussSitemapEntries(
      [{ slug: "dosing-schedules", lastModified: postgresTimestamp }],
      [
        {
          id: "1289a578-b32c-4bb6-bddd-2bfea6bd0454",
          topicSlug: "dosing-schedules",
          lastModified: new Date(replyIso),
        },
      ],
    ),
  ];

  const xml = resolveRouteData(entries, "sitemap");
  assert.match(xml, /<loc>https:\/\/semaxhub\.com\/discuss\/dosing-schedules<\/loc>/);
  assert.match(xml, /<lastmod>2026-09-29T20:36:10\.735Z<\/lastmod>/);
  assert.match(xml, /1289a578-b32c-4bb6-bddd-2bfea6bd0454/);
  assert.equal(xml.includes("Invalid"), false);

  assert.throws(() =>
    resolveRouteData(
      [{ url: "https://semaxhub.com", lastModified: new Date("nope") }],
      "sitemap",
    ),
  );
});

const clientProfiles: { name: string; headers: Record<string, string> }[] = [
  { name: "curl default", headers: { "user-agent": "curl/8.5.0", accept: "*/*" } },
  { name: "empty user-agent", headers: { "user-agent": "", accept: "*/*" } },
  {
    name: "googlebot",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      accept: "text/html,application/xml;q=0.9,*/*;q=0.8",
    },
  },
  {
    name: "bingbot",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  },
  {
    name: "browser",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-encoding": "gzip, deflate, br",
    },
  },
  {
    name: "markdown fetcher",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      accept:
        "text/markdown,text/html;q=0.9,application/xhtml+xml;q=0.8,application/xml;q=0.7,image/webp;q=0.6,*/*;q=0.5",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.5",
    },
  },
  { name: "accept html", headers: { accept: "text/html" } },
  { name: "accept xml", headers: { accept: "application/xml" } },
  { name: "accept markdown", headers: { accept: "text/markdown" } },
  { name: "accept star", headers: { accept: "*/*" } },
  { name: "no accept", headers: { "user-agent": "node" } },
  { name: "encoding gzip", headers: { "accept-encoding": "gzip" } },
  { name: "encoding identity", headers: { "accept-encoding": "identity" } },
  { name: "encoding brotli", headers: { "accept-encoding": "br, gzip, deflate" } },
];

test("sitemap response stays identity application/xml for every client profile", async () => {
  const xml = renderSitemapXml(fallbackSitemapEntries());
  const direct = sitemapXmlResponse(xml);
  assert.equal(direct.status, 200);
  assert.equal(direct.headers.get("content-type"), "application/xml; charset=utf-8");
  assert.equal(direct.headers.get("content-encoding"), "identity");
  assert.match(direct.headers.get("cache-control") ?? "", /no-transform/);
  assert.equal(direct.headers.get("content-length"), String(Buffer.byteLength(xml, "utf8")));
  assert.equal(Buffer.from(await direct.arrayBuffer()).toString("utf8"), xml);

  const { GET } = await import("../app/sitemap.xml/route");
  let firstBody: string | null = null;
  for (const profile of clientProfiles) {
    for (const method of ["GET", "HEAD"] as const) {
      const response = await GET(
        new Request("https://semaxhub.com/sitemap.xml", {
          method,
          headers: profile.headers,
        }),
      );
      assert.equal(response.status, 200, `${profile.name} ${method}`);
      assert.equal(
        response.headers.get("content-type"),
        "application/xml; charset=utf-8",
        `${profile.name} ${method}`,
      );
      const cacheControl = response.headers.get("cache-control") ?? "";
      assert.match(cacheControl, /no-transform/, `${profile.name} ${method}`);
      assert.equal(response.headers.get("content-encoding"), "identity", `${profile.name} ${method}`);
      const body = Buffer.from(await response.arrayBuffer());
      assert.equal(
        response.headers.get("content-length"),
        String(body.byteLength),
        `${profile.name} ${method}`,
      );
      const text = body.toString("utf8");
      assert.match(text, /<loc>https:\/\/semaxhub\.com<\/loc>/, `${profile.name} ${method}`);
      assert.equal(text.includes("semaxhub-brown.vercel.app"), false, profile.name);
      assert.equal(text.includes("Invalid"), false, profile.name);
      assert.match(text, /<\?xml version="1.0" encoding="UTF-8"\?>/);
      if (firstBody === null) firstBody = text;
      else assert.equal(text, firstBody, `${profile.name} ${method}`);
    }
  }
});
