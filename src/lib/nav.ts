export type NavItem = { href: string; label: string; group?: string };

export const primaryNav: NavItem[] = [
  { href: "/what-is-semax", label: "What is Semax?" },
  { href: "/origin", label: "Origin" },
  { href: "/how-it-works", label: "How Semax works" },
  { href: "/evidence", label: "Evidence" },
  { href: "/safety-faqs", label: "Safety & FAQs" },
  { href: "/semax-vs-selank", label: "Semax vs Selank" },
  { href: "/regulatory", label: "Regulatory" },
  { href: "/sources", label: "Sources" },
  { href: "/discuss", label: "Discuss" },
  { href: "/about", label: "About" },
];

export const learnNav: NavItem[] = [
  { href: "/what-is-semax", label: "What Semax is" },
  { href: "/origin", label: "Origin story" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/evidence", label: "Evidence" },
  { href: "/safety-faqs", label: "Safety & FAQs" },
  { href: "/regulatory", label: "Regulatory status" },
];

export const teachPages = [
  {
    href: "/what-is-semax",
    title: "What is Semax?",
    blurb: "Heptapeptide MEHFPGP (Semax's seven-letter amino-acid code), an adrenocorticotropic hormone (ACTH) fragment analog, nasal Rx in Russia.",
  },
  {
    href: "/origin",
    title: "Origin story",
    blurb: "From the “KGB peptide” and “Limitless peptide” nicknames to the Institute of Molecular Genetics record.",
  },
  {
    href: "/how-it-works",
    title: "How Semax works",
    blurb: "Brain-derived neurotrophic factor (BDNF) / its receptor TrkB signals in animals, and the open questions that remain.",
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
    blurb: "Russia Vital & Essential Drugs lists; not U.S. Food and Drug Administration (FDA) / European Medicines Agency (EMA)-approved.",
  },
  {
    href: "/sources",
    title: "Sources",
    blurb: "Footnotes hub. We flag what still needs a citation.",
  },
] as const;

/** First six guides for home Learn (Regulatory + Sources only on /learn). */
export const homeLearnPages = teachPages.slice(0, 6);
