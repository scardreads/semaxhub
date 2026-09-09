export type NavItem = { href: string; label: string; group?: string };

export const primaryNav: NavItem[] = [
  { href: "/what-is-semax", label: "What is Semax?" },
  { href: "/origin", label: "Origin" },
  { href: "/how-it-may-work", label: "How it may work" },
  { href: "/evidence", label: "Evidence" },
  { href: "/safety-faqs", label: "Safety & FAQs" },
  { href: "/semax-vs-selank", label: "Semax vs Selank" },
  { href: "/regulatory", label: "Regulatory" },
  { href: "/sources", label: "Sources" },
  { href: "/discuss", label: "Discuss" },
  { href: "/about", label: "About" },
];

export const teachPages = [
  {
    href: "/what-is-semax",
    title: "What is Semax?",
    blurb: "Heptapeptide MEHFPGP, ACTH(4-10) analog, nasal Rx in Russia.",
  },
  {
    href: "/origin",
    title: "Origin story",
    blurb: "From the KGB peptide hook to the Institute of Molecular Genetics record.",
  },
  {
    href: "/how-it-may-work",
    title: "How it may work",
    blurb: "BDNF/TrkB signals in animals, and the open questions that remain.",
  },
  {
    href: "/evidence",
    title: "Evidence map",
    blurb: "Russian clinical contexts and Western replication gaps.",
  },
  {
    href: "/safety-faqs",
    title: "Safety & FAQs",
    blurb: "Context only. Quality caveats. Not medical advice.",
  },
  {
    href: "/semax-vs-selank",
    title: "Semax vs Selank",
    blurb: "Related peptides, different aims. Keep them straight.",
  },
  {
    href: "/regulatory",
    title: "Regulatory status",
    blurb: "Russia Vital & Essential Drugs lists; not FDA/EMA-approved.",
  },
  {
    href: "/sources",
    title: "Sources",
    blurb: "Footnotes hub. We flag what still needs a citation.",
  },
] as const;
