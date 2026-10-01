/**
 * Visible Q&A from src/app/safety-faqs/content.mdx ("Common questions").
 * Plain text only: markdown emphasis removed, wording otherwise unchanged.
 * Do not add questions that are not on that page.
 */
export const SAFETY_FAQS = [
  {
    question: "Is Semax “safe”?",
    answer:
      "There is no universal yes/no. Russian clinical authors and the Russian label describe a generally favorable tolerability profile for the registered nasal product in studied uses, with mild nasal irritation as the most consistently mentioned local issue. That is not an FDA or EMA safety determination, and it does not apply automatically to unregulated products.",
  },
  {
    question: "What side effects show up most in the literature?",
    answer:
      "Primarily local nasal effects (irritation; in some summaries, mucosal discoloration). Systemic serious adverse events are not a dominant theme in the Russian clinical summaries cited below: but reporting standards and trial designs differ from contemporary Western Phase 3 programs.",
  },
  {
    question: "Does nasal delivery mean fewer whole-body side effects?",
    answer:
      "Intranasal use is chosen in Russia partly for convenience and central nervous system (CNS) access. Local nasal irritation is the trade-off most often discussed. Systemic effects can still occur in principle; the literature’s emphasis is that marked toxicity signals were uncommon in the reported series.",
  },
  {
    question: "Can I use Semax if I’m pregnant, breastfeeding, or have certain conditions?",
    answer:
      "Russian prescribing materials list pregnancy and lactation as contraindications (clinical studies not conducted in those groups), along with hypersensitivity, certain age cutoffs for specific uses, acute psychiatric states accompanied by anxiety, and a history of seizures. That is label information for the Russian medicine, not personal advice. Anyone with medical conditions should speak with a clinician: especially outside jurisdictions where the product is not approved.",
  },
  {
    question: "Is Semax addictive like stimulants?",
    answer:
      "Semax is not classified like classic amphetamine stimulants. Published Russian clinical narratives do not center on dependence syndromes. Uncertainty flag: Formal abuse-liability programs of the type expected for many Western CNS drugs are not what most visitors will find in the English PubMed trail.",
  },
  {
    question: "Why do internet sources disagree so much?",
    answer:
      "Because they mix: (a) Russian drug-label claims, (b) small clinical series, (c) animal brain-derived neurotrophic factor (BDNF) / neuroprotection papers, and (d) marketing for research peptides. This site separates those layers. For the 2026 U.S. compounding pathway (Category 2 removal vs the FDA’s Pharmacy Compounding Advisory Committee (PCAC) Bulks List recommendation vs what still must happen before compounding under section 503A is clearly authorized), see Regulatory status.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. Semax Hub pages are for education and orientation. They are not a diagnosis, treatment plan, or recommendation to obtain or use any substance.",
  },
] as const;
