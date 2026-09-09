export type Thread = {
  slug: string;
  title: string;
  summary: string;
  status: "open" | "seeded";
};

export const threads: Thread[] = [
  {
    slug: "kgb-peptide-folklore",
    title: "Where does the KGB peptide story come from?",
    summary:
      "A reading-room thread for separating discovery hooks from documented IMG history.",
    status: "seeded",
  },
  {
    slug: "bdnf-trkb-open-questions",
    title: "BDNF/TrkB: what is established vs open?",
    summary:
      "Collect notes on animal findings, human gaps, and careful wording for mechanism claims.",
    status: "seeded",
  },
  {
    slug: "western-replication-gaps",
    title: "Western replication gaps on the evidence map",
    summary:
      "Track what has Russian clinical footprint versus independent Western trial packages.",
    status: "open",
  },
];

export function getThread(slug: string) {
  return threads.find((t) => t.slug === slug);
}
