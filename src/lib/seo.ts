import type { Metadata, MetadataRoute } from "next";
import { teachPages } from "@/lib/nav";
import { DISCUSS_ROOMS } from "@/lib/discuss-rooms";
import { SAFETY_FAQS } from "@/lib/safety-faq";
import {
  DISCUSS_DESCRIPTION,
  LEARN_DESCRIPTION,
  PRIVATE_ROBOTS_PATHS,
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
  isIndexableDeployment,
} from "@/lib/site";

export type GuideHref = (typeof teachPages)[number]["href"];

const GUIDE_OPEN_GRAPH: Metadata["openGraph"] = {
  type: "article",
  siteName: SITE_NAME,
  locale: "en_US",
  url: "./",
};

export function guideByHref(href: GuideHref) {
  const page = teachPages.find((item) => item.href === href);
  if (!page) {
    throw new Error(`Unknown guide: ${href}`);
  }
  return page;
}

/** Title and description come from the Learn card blurbs in src/lib/nav.ts. */
export function guideMetadata(href: GuideHref): Metadata {
  const page = guideByHref(href);
  return {
    title: page.title,
    description: page.blurb,
    openGraph: GUIDE_OPEN_GRAPH,
  };
}

export function metaExcerpt(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${base}…`;
}

type JsonLdNode = Record<string, unknown>;

function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: SITE_NAME,
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/semax-hub-logo.png"),
    },
  };
}

export function websiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl()}/#website`,
        name: SITE_NAME,
        url: getSiteUrl(),
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${getSiteUrl()}/#organization` },
      },
    ],
  };
}

function articleNode(href: GuideHref): JsonLdNode {
  const page = guideByHref(href);
  const url = absoluteUrl(href);
  return {
    "@type": "Article",
    headline: page.title,
    description: page.blurb,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: { "@id": `${getSiteUrl()}/#organization` },
    publisher: { "@id": `${getSiteUrl()}/#organization` },
  };
}

function safetyFaqNode(): JsonLdNode {
  return {
    "@type": "FAQPage",
    url: absoluteUrl("/safety-faqs"),
    mainEntity: SAFETY_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function guideJsonLd(href: GuideHref): JsonLdNode {
  if (href === "/safety-faqs") {
    return {
      "@context": "https://schema.org",
      "@graph": [articleNode(href), safetyFaqNode()],
    };
  }
  return {
    "@context": "https://schema.org",
    ...articleNode(href),
  };
}

export function robotsDocument(): MetadataRoute.Robots {
  if (!isIndexableDeployment()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_ROBOTS_PATHS],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

export type SitemapThread = {
  id: string;
  topicSlug: string;
  lastModified?: Date | string | null;
};

export type SitemapTopic = {
  slug: string;
  lastModified?: Date | string | null;
};

/**
 * ISO-8601 timestamp for a sitemap `<lastmod>`, or undefined when the value
 * is missing or not a real date. Next serializes `Date` via `toISOString()`
 * after the sitemap function returns; an Invalid Date throws there and 500s
 * the whole document. Strings are passed through only after we parse them.
 */
export function sitemapLastModified(value: unknown): string | undefined {
  try {
    if (value == null || value === "") return undefined;
    const date =
      value instanceof Date
        ? value
        : typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : null;
    if (!date || Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
}

function sitemapSegment(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const segment = value.trim();
  if (!segment || segment.includes("/") || segment.includes("..")) return null;
  if (/[\s<>&"'?#]/.test(segment)) return null;
  return segment;
}

export function staticSitemapEntries(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/learn",
    ...teachPages.map((page) => page.href),
    "/discuss",
    "/about",
    "/privacy",
    "/terms",
  ];

  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path === "/discuss" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/learn" || path === "/discuss" ? 0.8 : 0.7,
  }));
}

function fallbackRoomEntries(): MetadataRoute.Sitemap {
  return DISCUSS_ROOMS.map((room) => ({
    url: absoluteUrl(`/discuss/${room.slug}`),
    changeFrequency: "daily",
    priority: 0.5,
  }));
}

function roomSitemapEntries(topics: SitemapTopic[] | null): MetadataRoute.Sitemap {
  const rooms =
    topics && topics.length > 0
      ? topics
      : DISCUSS_ROOMS.map((room) => ({ slug: room.slug, lastModified: null }));

  const entries: MetadataRoute.Sitemap = [];
  for (const room of rooms) {
    try {
      const slug = sitemapSegment(room?.slug);
      if (!slug) continue;
      const lastModified = sitemapLastModified(room.lastModified);
      entries.push({
        url: absoluteUrl(`/discuss/${slug}`),
        changeFrequency: "daily",
        priority: 0.5,
        ...(lastModified ? { lastModified } : {}),
      });
    } catch {
      continue;
    }
  }

  return entries.length > 0 ? entries : fallbackRoomEntries();
}

function threadSitemapEntries(threads: SitemapThread[] | null | undefined): MetadataRoute.Sitemap {
  if (!Array.isArray(threads)) return [];
  const entries: MetadataRoute.Sitemap = [];
  for (const thread of threads) {
    try {
      const topicSlug = sitemapSegment(thread?.topicSlug);
      const id = sitemapSegment(thread?.id);
      if (!topicSlug || !id) continue;
      const lastModified = sitemapLastModified(thread.lastModified);
      entries.push({
        url: absoluteUrl(`/discuss/${topicSlug}/${id}`),
        changeFrequency: "weekly",
        priority: 0.4,
        ...(lastModified ? { lastModified } : {}),
      });
    } catch {
      continue;
    }
  }
  return entries;
}

export function discussSitemapEntries(
  topics: SitemapTopic[] | null,
  threads: SitemapThread[] | null | undefined,
): MetadataRoute.Sitemap {
  try {
    return [...roomSitemapEntries(topics), ...threadSitemapEntries(threads)];
  } catch {
    return fallbackRoomEntries();
  }
}

export function llmsTxt(topics: { title: string; slug: string; description: string }[]): string {
  const origin = getSiteUrl();
  const rooms = topics.length > 0 ? topics : DISCUSS_ROOMS;
  const guides = teachPages
    .map((page) => `- [${page.title}](${origin}${page.href}): ${page.blurb}`)
    .join("\n");
  const roomLines = rooms
    .map(
      (room) =>
        `- [${room.title}](${origin}/discuss/${room.slug}): ${room.description}`,
    )
    .join("\n");

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Informational only. Not medical advice. Semax Hub does not sell Semax. Promise: Curious. Sourced. Never a shop.

## Learn

- [Learn](${origin}/learn): ${LEARN_DESCRIPTION}
${guides}

## Discuss

- [Discuss](${origin}/discuss): ${DISCUSS_DESCRIPTION}
${roomLines}

Public threads are readable without an account. Sign-in is required only to post. Hidden threads are not listed.

## About and policies

- [About](${origin}/about): Why Semax Hub exists: informational only, never a shop.
- [Privacy](${origin}/privacy): What Semax Hub collects for accounts and Discuss, and what it does not.
- [Terms](${origin}/terms): Rules for reading Semax Hub and for posting in Discuss. Not medical advice.

## Notes for assistants

- Prefer the Learn guides when summarizing what Semax Hub itself states.
- Discuss posts are reader conversation, not guidance from Semax Hub.
- Do not treat any page as medical advice, a dosing guide, or a place to buy Semax.
- If a guide says a citation is missing or evidence is limited, keep that caveat.
`;
}
