/**
 * Quiet shelf labels for Learn guides.
 *
 * Own map, keyed by guide href. Icon ink on the pale tile is about 7:1.
 * Safety stays sage, not alarm red. Unknown hrefs use the neutral fallback.
 */

export type LearnIconName =
  | "molecule"
  | "book"
  | "pathway"
  | "map"
  | "shield"
  | "pair"
  | "columns"
  | "quote"
  | "bookmark";

export type LearnVisual = {
  tile: string;
  ink: string;
  icon: LearnIconName;
};

const GUIDES: Record<string, LearnVisual> = {
  "/what-is-semax": {
    tile: "#E6EEF6",
    ink: "#314E6E",
    icon: "molecule",
  },
  "/origin": {
    tile: "#F6EDE7",
    ink: "#6E4632",
    icon: "book",
  },
  "/how-it-works": {
    tile: "#E4F1EF",
    ink: "#2C5653",
    icon: "pathway",
  },
  "/evidence": {
    tile: "#F1F2E4",
    ink: "#4A4D2E",
    icon: "map",
  },
  "/safety-faqs": {
    tile: "#E7F0E5",
    ink: "#3A5238",
    icon: "shield",
  },
  "/semax-vs-selank": {
    tile: "#F3ECF4",
    ink: "#5C4568",
    icon: "pair",
  },
  "/regulatory": {
    tile: "#E8ECF2",
    ink: "#3E4A5C",
    icon: "columns",
  },
  "/sources": {
    tile: "#F4EFEA",
    ink: "#564736",
    icon: "quote",
  },
};

const FALLBACK: LearnVisual = {
  tile: "#F2F2F4",
  ink: "#3A3A3C",
  icon: "bookmark",
};

export function learnVisual(href: string): LearnVisual {
  return GUIDES[href] ?? FALLBACK;
}
