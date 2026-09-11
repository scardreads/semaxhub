import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/** True for prisma+ / Prisma accelerator URLs that postgres.js cannot use. */
function isPrismaUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.startsWith("prisma+") || lower.includes("prisma");
}

/**
 * Neon / Vercel Postgres may set POSTGRES_* aliases instead of DATABASE_URL.
 * Prefer plain postgres URLs; never hand prisma+ URLs to postgres.js.
 */
export function getDatabaseUrl(): string | undefined {
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

export function isDatabaseConfigured(): boolean {
  // Avoid opening a DB connection while Next is collecting page data in production build.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return false;
  }
  return Boolean(getDatabaseUrl());
}

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!dbInstance) {
    client = postgres(url, { prepare: false, max: 1 });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export { schema };
