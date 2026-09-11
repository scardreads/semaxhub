import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL?.trim();
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
