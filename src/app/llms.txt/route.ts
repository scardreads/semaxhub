import { connection } from "next/server";
import { isDatabaseConfigured, listTopics } from "@/lib/discuss";
import { llmsTxt } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  await connection();

  let topics: { title: string; slug: string; description: string }[] = [];
  if (isDatabaseConfigured()) {
    try {
      const rows = await listTopics();
      topics = rows.map((topic) => ({
        title: topic.title,
        slug: topic.slug,
        description: topic.description,
      }));
    } catch {
      topics = [];
    }
  }

  return new Response(llmsTxt(topics), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
