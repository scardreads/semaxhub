/**
 * Public Discuss rooms. Kept in sync with scripts/seed-discuss.ts.
 * The sitemap and llms.txt use the database when it is reachable, and these
 * rows when it is not. Hidden threads are never listed here.
 */
export const DISCUSS_ROOMS = [
  {
    slug: "dosing-schedules",
    title: "Dosing & schedules",
    description:
      "How people dose Semax, how often, cycles, and nasal technique. Experiences from other users, not medical advice.",
  },
  {
    slug: "stacking-combinations",
    title: "Stacking & combinations",
    description:
      "Semax with Selank or other compounds: what people try together, timing, and what they stop using.",
  },
  {
    slug: "effects-experiences",
    title: "Effects & experiences",
    description:
      "What people notice (or don’t): focus, mood, energy, sleep, and how long it lasts for them.",
  },
  {
    slug: "sourcing-quality",
    title: "Sourcing & quality",
    description:
      "How people think about quality, compounding, and red flags. Semax Hub does not sell Semax or list shops.",
  },
  {
    slug: "side-effects-tolerability",
    title: "Side effects & tolerability",
    description:
      "Nasal irritation, jitters, crashes, and what people do when something feels off.",
  },
  {
    slug: "semax-vs-selank",
    title: "Semax vs Selank",
    description:
      "When people reach for one, the other, or both, and how they tell them apart in practice.",
  },
  {
    slug: "us-access-regulatory",
    title: "U.S. access & regulatory",
    description:
      "What’s practical in the U.S. right now: compounding context, Category 2 and bulks-list updates, and access questions.",
  },
  {
    slug: "general-questions",
    title: "General questions",
    description: "Anything Semax-related that doesn’t fit the rooms above.",
  },
] as const;

export type DiscussRoomSlug = (typeof DISCUSS_ROOMS)[number]["slug"];
