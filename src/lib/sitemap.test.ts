import assert from "node:assert/strict";
import test from "node:test";
import { publicThreadSitemapLastModified } from "./discuss";
import {
  discussSitemapEntries,
  sitemapLastModified,
  staticSitemapEntries,
} from "./seo";
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
