import type { Metadata } from "next";
import Link from "next/link";
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
          <Link key={page.href} href={page.href} className="home-read-card">
            <h2 className="home-read-title">{page.title}</h2>
            <p className="home-read-blurb">{page.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
