import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "../src/db";

const SEED_TOPICS = [
  {
    slug: "what-is-semax",
    title: "What is Semax?",
    description:
      "Newcomer questions about what the molecule is (and isn’t).",
    teachHref: "/what-is-semax",
    starterPrompt:
      "If you had to explain Semax to a friend in two sentences, what would you say?",
    sortOrder: 1,
  },
  {
    slug: "origin-folklore",
    title: "Origin / folklore",
    description:
      "KGB and Limitless nicknames vs what Institute of Molecular Genetics researchers documented.",
    teachHref: "/origin",
    starterPrompt:
      "Where did you first hear ‘KGB peptide,’ and what sourced version convinced you (or didn’t)?",
    sortOrder: 2,
  },
  {
    slug: "how-semax-works",
    title: "How Semax works",
    description:
      "Pathways people discuss (BDNF/TrkB and friends), plus what’s still open.",
    teachHref: "/how-it-works",
    starterPrompt:
      "Which mechanism claim have you seen oversold online, and what’s the careful version?",
    sortOrder: 3,
  },
  {
    slug: "evidence",
    title: "Evidence",
    description:
      "Russian clinical footprint vs Western replication gaps.",
    teachHref: "/evidence",
    starterPrompt:
      "What’s the strongest study you’ve actually read, and what design limits would you flag?",
    sortOrder: 4,
  },
  {
    slug: "safety",
    title: "Safety",
    description:
      "Tolerability notes, quality caveats, and peer experiences (not Hub medical advice).",
    teachHref: "/safety-faqs",
    starterPrompt:
      "What context helped you read a safety claim carefully (label vs anecdote vs paper)?",
    sortOrder: 5,
  },
  {
    slug: "regulatory-compounding",
    title: "Regulatory / compounding",
    description:
      "U.S. compounding pathway confusion (503A, Category 2, PCAC) vs Russia’s registered nasal drug.",
    teachHref: "/regulatory",
    starterPrompt:
      "What headline about Semax and the FDA most confused you, and how would you rewrite it plainly?",
    sortOrder: 6,
  },
  {
    slug: "semax-vs-selank",
    title: "Semax vs Selank",
    description: "Same design school, different aims. Keep them straight.",
    teachHref: "/semax-vs-selank",
    starterPrompt:
      "What’s the most common mix-up you’ve seen between Semax and Selank?",
    sortOrder: 7,
  },
  {
    slug: "general-questions",
    title: "General questions",
    description:
      "Anything that doesn’t fit a topic yet. Keep it curious and kind.",
    teachHref: "/about",
    starterPrompt:
      "What’s the Semax question you wish a clear, sourced page answered first?",
    sortOrder: 8,
  },
] as const;

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL (or POSTGRES_URL) is required to seed.");
    process.exit(1);
  }
  const db = getDb();
  for (const topic of SEED_TOPICS) {
    const existing = await db
      .select({ id: schema.topics.id })
      .from(schema.topics)
      .where(eq(schema.topics.slug, topic.slug))
      .limit(1);
    if (existing[0]) {
      await db
        .update(schema.topics)
        .set({
          title: topic.title,
          description: topic.description,
          teachHref: topic.teachHref,
          starterPrompt: topic.starterPrompt,
          sortOrder: topic.sortOrder,
        })
        .where(eq(schema.topics.slug, topic.slug));
      console.log(`updated: ${topic.slug}`);
    } else {
      await db.insert(schema.topics).values(topic);
      console.log(`inserted: ${topic.slug}`);
    }
  }
  console.log("Seed complete: 8 topics upserted.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
