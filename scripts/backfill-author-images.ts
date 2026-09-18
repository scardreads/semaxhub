import "dotenv/config";
import postgres from "postgres";
import { imageUrlFromUser } from "../src/lib/author-image";

function isPrismaUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.startsWith("prisma+") || lower.includes("prisma");
}

function getDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed && !isPrismaUrl(trimmed)) return trimmed;
  }
  return undefined;
}

async function fetchClerkUser(clerkId: string, secretKey: string) {
  const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`clerk_http_${res.status}`);
  }
  return res.json();
}

async function main() {
  const url = getDatabaseUrl();
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();
  if (!url) {
    console.error("DATABASE_URL (or POSTGRES_URL) is required");
    process.exit(1);
  }
  if (!secretKey) {
    console.error("CLERK_SECRET_KEY is required");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });

  const rows = await sql<{ author_clerk_id: string }[]>`
    SELECT DISTINCT author_clerk_id FROM (
      SELECT author_clerk_id FROM threads WHERE author_image_url IS NULL
      UNION
      SELECT author_clerk_id FROM replies WHERE author_image_url IS NULL
    ) AS missing
  `;

  let authorsScanned = 0;
  let updatedThreads = 0;
  let updatedReplies = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    const clerkId = row.author_clerk_id;
    authorsScanned += 1;
    try {
      const user = await fetchClerkUser(clerkId, secretKey);
      const imageUrl = imageUrlFromUser(user);
      if (!imageUrl) {
        skipped += 1;
        continue;
      }
      const threadResult = await sql`
        UPDATE threads
        SET author_image_url = ${imageUrl}
        WHERE author_clerk_id = ${clerkId}
          AND author_image_url IS NULL
      `;
      const replyResult = await sql`
        UPDATE replies
        SET author_image_url = ${imageUrl}
        WHERE author_clerk_id = ${clerkId}
          AND author_image_url IS NULL
      `;
      updatedThreads += threadResult.count;
      updatedReplies += replyResult.count;
    } catch {
      errors += 1;
    }
  }

  await sql.end();

  console.log(
    JSON.stringify({
      authorsScanned,
      updatedThreads,
      updatedReplies,
      skipped,
      errors,
    }),
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : "backfill_failed");
  process.exit(1);
});
