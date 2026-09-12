import Link from "next/link";
import { listHomeDiscussHighlights } from "@/lib/discuss";
import { teachPages } from "@/lib/nav";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HomePage() {
  const highlights = await listHomeDiscussHighlights(6);
  const recent = highlights.filter((thread) => thread.source === "recent");
  const popular = highlights.filter((thread) => thread.source === "popular");

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-inner">
          <p className="home-eyebrow">
            The so-called &quot;KGB peptide,&quot; explained
          </p>
          <h1 className="home-title">Semax, the definitive resource</h1>
          <p className="home-subhead">
            Semax Hub is a free resource on the peptide known as the
            &quot;KGB brain spray&quot;: what it is, where the story actually comes from,
            and what the research does (and doesn&apos;t) say.
          </p>
          <div className="home-actions">
            <Link href="/what-is-semax" className="home-cta home-cta-primary">
              Start with What is Semax?
            </Link>
            <Link href="/origin" className="home-cta home-cta-ghost">
              Read the origin story
            </Link>
          </div>
          <p className="home-trust">
            Informational only. Not medical advice. We don&apos;t sell Semax.
          </p>
        </div>
      </section>


      <section className="home-section">
        <div className="home-section-head">
          <div>
            <h2 className="home-h2">Learn</h2>
            <p className="home-section-lede">
              Clear pages on what Semax is, where it came from, and what the
              research says.
            </p>
          </div>
          <Link href="/sources" className="home-meta-link">
            Sources hub
          </Link>
        </div>
        <div className="home-grid">
          {teachPages.map((page) => (
            <Link key={page.href} href={page.href} className="home-read-card">
              <h3 className="home-read-title">{page.title}</h3>
              <p className="home-read-blurb">{page.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <div>
            <h2 className="home-h2">Discuss</h2>
            <p className="home-section-lede">
              Recent and popular threads from the reading room.
            </p>
          </div>
          <Link href="/discuss" className="home-meta-link">
            Browse all topics
          </Link>
        </div>
        {highlights.length === 0 ? (
          <div className="home-card home-card-solo">
            <p className="home-body">
              No threads yet. Be the first to ask something in Discuss.
            </p>
            <Link href="/discuss" className="home-inline-link">
              Browse all topics
            </Link>
          </div>
        ) : (
          <>
            {recent.length > 0 ? (
              <div className="home-discuss-block">
                <h3 className="home-discuss-subhead">Recent</h3>
                <div className="home-grid">
                  {recent.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/discuss/${thread.topicSlug}/${thread.id}`}
                      className="home-read-card"
                    >
                      <h3 className="home-read-title">{thread.title}</h3>
                      <p className="home-read-blurb">
                        {thread.authorDisplayName} · {formatDate(thread.createdAt)}{" "}
                        · {thread.replyCount}{" "}
                        {thread.replyCount === 1 ? "reply" : "replies"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {popular.length > 0 ? (
              <div className="home-discuss-block">
                <h3 className="home-discuss-subhead">Popular</h3>
                <div className="home-grid">
                  {popular.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/discuss/${thread.topicSlug}/${thread.id}`}
                      className="home-read-card"
                    >
                      <h3 className="home-read-title">{thread.title}</h3>
                      <p className="home-read-blurb">
                        {thread.authorDisplayName} · {formatDate(thread.createdAt)}{" "}
                        · {thread.replyCount}{" "}
                        {thread.replyCount === 1 ? "reply" : "replies"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className="home-section home-section-last">
        <div className="home-card home-card-solo">
          <h2 className="home-h2">What this site is</h2>
          <ul className="home-list">
            <li>An informational hub with sourced teach pages.</li>
            <li>A reading-room style discussion space.</li>
            <li>Clear about gaps: if we lack a citation, we say so.</li>
          </ul>
          <h3 className="home-h3">What it isn&apos;t</h3>
          <ul className="home-list">
            <li>Not a store, clinic, or dosing guide.</li>
            <li>No carts. No &quot;buy Semax.&quot; No medical advice.</li>
          </ul>
          <p className="home-promise">
            Promise: Curious. Sourced. Never a shop.
          </p>
        </div>
      </section>
    </div>
  );
}
