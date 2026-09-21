import "dotenv/config";
import { eq, inArray, notInArray } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "../src/db";

const SEED_TOPICS = [
  {
    slug: "dosing-schedules",
    title: "Dosing & schedules",
    description:
      "How people dose Semax, how often, cycles, and nasal technique. Experiences from other users, not medical advice.",
    teachHref: null as string | null,
    starterPrompt:
      "How do you time Semax (dose, frequency, cycle), and what nasal technique has worked for you? Experiences only — not medical advice.",
    sortOrder: 1,
  },
  {
    slug: "stacking-combinations",
    title: "Stacking & combinations",
    description:
      "Semax with Selank or other compounds: what people try together, timing, and what they stop using.",
    teachHref: null as string | null,
    starterPrompt:
      "What have you tried stacking with Semax (including Selank), how did you time it, and what did you stop? Experiences only — not medical advice.",
    sortOrder: 2,
  },
  {
    slug: "effects-experiences",
    title: "Effects & experiences",
    description:
      "What people notice (or don’t): focus, mood, energy, sleep, and how long it lasts for them.",
    teachHref: null as string | null,
    starterPrompt:
      "What did you notice (or not) with Semax — focus, mood, energy, sleep — and how long did it last for you? Experiences only — not medical advice.",
    sortOrder: 3,
  },
  {
    slug: "sourcing-quality",
    title: "Sourcing & quality",
    description:
      "How people think about quality, compounding, and red flags. Semax Hub does not sell Semax or list shops.",
    teachHref: null as string | null,
    starterPrompt:
      "How do you think about quality and red flags for Semax? Share criteria and caveats — no shop lists or sales.",
    sortOrder: 4,
  },
  {
    slug: "side-effects-tolerability",
    title: "Side effects & tolerability",
    description:
      "Nasal irritation, jitters, crashes, and what people do when something feels off.",
    teachHref: "/safety-faqs",
    starterPrompt:
      "Have you hit nasal irritation, jitters, or a crash — and what did you do when something felt off? Experiences only — not medical advice.",
    sortOrder: 5,
  },
  {
    slug: "semax-vs-selank",
    title: "Semax vs Selank",
    description:
      "When people reach for one, the other, or both, and how they tell them apart in practice.",
    teachHref: "/semax-vs-selank",
    starterPrompt:
      "When do you reach for Semax, Selank, or both — and how do you tell them apart in practice? Experiences only — not medical advice.",
    sortOrder: 6,
  },
  {
    slug: "us-access-regulatory",
    title: "U.S. access & regulatory",
    description:
      "What’s practical in the U.S. right now: compounding context, Category 2 and bulks-list updates, and access questions.",
    teachHref: "/regulatory",
    starterPrompt:
      "What’s your practical take on U.S. access right now (compounding, Category 2, bulks list)? Questions and context welcome — not legal or medical advice.",
    sortOrder: 7,
  },
  {
    slug: "general-questions",
    title: "General questions",
    description:
      "Anything Semax-related that doesn’t fit the rooms above.",
    teachHref: null as string | null,
    starterPrompt:
      "What’s your Semax question that doesn’t fit the other rooms? Keep it curious — experiences and questions, not medical advice or sales.",
    sortOrder: 8,
  },
] as const;

/** Old slug → new slug for thread migration before obsolete topics are deleted. */
const SLUG_MIGRATIONS: Record<string, string> = {
  "regulatory-compounding": "us-access-regulatory",
  safety: "side-effects-tolerability",
  "what-is-semax": "general-questions",
  "origin-folklore": "general-questions",
  "how-semax-works": "general-questions",
  evidence: "general-questions",
};

const KEEP_SLUGS = SEED_TOPICS.map((t) => t.slug);

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL (or POSTGRES_URL) is required to seed.");
    process.exit(1);
  }
  const db = getDb();

  // 1) Upsert the 8 community rooms
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
  console.log("Seed upsert complete: 8 topics.");

  // 2) Resolve new topic ids for migrations
  const allTopics = await db
    .select({
      id: schema.topics.id,
      slug: schema.topics.slug,
    })
    .from(schema.topics);
  const idBySlug = new Map(allTopics.map((t) => [t.slug, t.id]));

  // 3) Migrate threads from obsolete slugs → keep slugs
  let migratedThreads = 0;
  const oldSlugs = Object.keys(SLUG_MIGRATIONS);
  const oldTopics = allTopics.filter((t) => oldSlugs.includes(t.slug));

  for (const old of oldTopics) {
    const destSlug = SLUG_MIGRATIONS[old.slug];
    const destId = idBySlug.get(destSlug);
    if (!destId) {
      console.error(`missing dest topic for migration: ${destSlug}`);
      process.exit(1);
    }
    if (old.id === destId) continue;
    const result = await db
      .update(schema.threads)
      .set({ topicId: destId })
      .where(eq(schema.threads.topicId, old.id))
      .returning({ id: schema.threads.id });
    const n = result.length;
    migratedThreads += n;
    console.log(`migrated threads: ${old.slug} → ${destSlug} (${n})`);
  }
  console.log(`migration total threads moved: ${migratedThreads}`);

  // Catch-all: any remaining topics not in KEEP_SLUGS → general-questions
  const generalId = idBySlug.get("general-questions");
  if (!generalId) {
    console.error("missing general-questions after upsert");
    process.exit(1);
  }
  const obsolete = allTopics.filter((t) => !KEEP_SLUGS.includes(t.slug));
  let catchAllMoved = 0;
  for (const old of obsolete) {
    // skip ones already handled by named migrations (threads already moved)
    if (oldSlugs.includes(old.slug)) continue;
    const result = await db
      .update(schema.threads)
      .set({ topicId: generalId })
      .where(eq(schema.threads.topicId, old.id))
      .returning({ id: schema.threads.id });
    const n = result.length;
    catchAllMoved += n;
    if (n > 0) {
      console.log(`migrated threads: ${old.slug} → general-questions (${n})`);
    }
  }
  if (catchAllMoved > 0) {
    console.log(`catch-all threads moved to general-questions: ${catchAllMoved}`);
  }

  // 4) Delete obsolete topics (only those not in the new 8)
  const toDelete = await db
    .select({ id: schema.topics.id, slug: schema.topics.slug })
    .from(schema.topics)
    .where(notInArray(schema.topics.slug, [...KEEP_SLUGS]));

  if (toDelete.length > 0) {
    // Verify no threads remain on obsolete topics
    const leftover = await db
      .select({ topicId: schema.threads.topicId })
      .from(schema.threads)
      .where(
        inArray(
          schema.threads.topicId,
          toDelete.map((t) => t.id),
        ),
      );
    if (leftover.length > 0) {
      console.error(
        `refusing delete: ${leftover.length} thread(s) still on obsolete topics`,
      );
      process.exit(1);
    }
    await db
      .delete(schema.topics)
      .where(
        inArray(
          schema.topics.id,
          toDelete.map((t) => t.id),
        ),
      );
    console.log(
      `deleted obsolete topics (${toDelete.length}): ${toDelete.map((t) => t.slug).join(", ")}`,
    );
  } else {
    console.log("deleted obsolete topics (0)");
  }

  const remaining = await db.select({ slug: schema.topics.slug }).from(schema.topics);
  console.log(
    `Seed complete: ${remaining.length} topics remain [${remaining.map((t) => t.slug).join(", ")}]`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
