/**
 * Quiet shelf labels for Discuss rooms.
 *
 * Spine colors sit on white at about 3.5:1 or higher so the hue still reads.
 * Icon ink on the pale tile is about 7:1. Side effects stay plum, not alarm red.
 * Unknown slugs use the neutral fallback so the layout never drops the cue.
 */

export type TopicIconName =
  | "clock"
  | "layers"
  | "sun"
  | "seal"
  | "droplet"
  | "split"
  | "document"
  | "question"
  | "bookmark";

export type TopicVisual = {
  spine: string;
  tile: string;
  ink: string;
  icon: TopicIconName;
};

const TOPICS: Record<string, TopicVisual> = {
  "dosing-schedules": {
    spine: "#6A82A3",
    tile: "#E6EDF5",
    ink: "#314863",
    icon: "clock",
  },
  "stacking-combinations": {
    spine: "#6E8A6A",
    tile: "#E7F0E5",
    ink: "#3A5238",
    icon: "layers",
  },
  "effects-experiences": {
    spine: "#A6785C",
    tile: "#F6EDE7",
    ink: "#6E4632",
    icon: "sun",
  },
  "sourcing-quality": {
    spine: "#5E8E8A",
    tile: "#E4F1EF",
    ink: "#2C5653",
    icon: "seal",
  },
  "side-effects-tolerability": {
    spine: "#8E7A96",
    tile: "#F2EBF3",
    ink: "#56415C",
    icon: "droplet",
  },
  "semax-vs-selank": {
    spine: "#727AAB",
    tile: "#EBEDF6",
    ink: "#3C446C",
    icon: "split",
  },
  "us-access-regulatory": {
    spine: "#8A8B62",
    tile: "#F1F2E4",
    ink: "#4A4D2E",
    icon: "document",
  },
  "general-questions": {
    spine: "#9A8674",
    tile: "#F4EFEA",
    ink: "#564736",
    icon: "question",
  },
};

const FALLBACK: TopicVisual = {
  spine: "#8E8E93",
  tile: "#F2F2F4",
  ink: "#3A3A3C",
  icon: "bookmark",
};

export function topicVisual(slug: string): TopicVisual {
  return TOPICS[slug] ?? FALLBACK;
}
