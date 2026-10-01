import type { Metadata } from "next";
import { LearnGuideCard } from "@/components/learn/LearnGuideCard";
import { teachPages } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Clear, sourced guides on what Semax is, where it came from, and what the research says.",
};

export default function LearnIndexPage() {
  return (
    <div className="page-shell home">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Learn
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/75">
        Clear, sourced guides on what Semax is, where it came from, and what the
        research says.
      </p>

      <div className="home-grid mt-8">
        {teachPages.map((page) => (
          <LearnGuideCard
            key={page.href}
            href={page.href}
            title={page.title}
            blurb={page.blurb}
            variant="full"
          />
        ))}
      </div>
    </div>
  );
}
