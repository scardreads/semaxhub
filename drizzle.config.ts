import "dotenv/config";
import { defineConfig } from "drizzle-kit";

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

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl() ?? "postgresql://localhost:5432/semaxhub",
  },
});
