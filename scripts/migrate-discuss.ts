import "dotenv/config";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  const sql = postgres(url, { max: 1 });
  await sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;
  const dir = join(process.cwd(), "drizzle");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const hash = file;
    const existing = await sql`
      SELECT id FROM "__drizzle_migrations" WHERE hash = ${hash} LIMIT 1
    `;
    if (existing.length) {
      console.log(`skip ${file}`);
      continue;
    }
    const raw = readFileSync(join(dir, file), "utf8");
    const statements = raw
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const statement of statements) {
      await sql.unsafe(statement);
    }
    await sql`
      INSERT INTO "__drizzle_migrations" (hash, created_at)
      VALUES (${hash}, ${Date.now()})
    `;
    console.log(`applied ${file}`);
  }
  await sql.end();
  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
