import Link from "next/link";
import { teachPages } from "@/lib/nav";

export default function HomePage() {
  return (
    <div className="home home-pilot">
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
        <div className="home-split">
          <div className="home-card">
            <h2 className="home-h2">
              Documented origin, not folklore ops stories
            </h2>
            <p className="home-body">
              The publicly documented story points to Russia&apos;s Institute of Molecular
              Genetics in the early 1980s. Work associated with N.F. Myasoedov,
              I.P. Ashmarin, and colleagues turned an adrenocorticotropic hormone (ACTH)
              fragment into the stabilized heptapeptide{" "}
              <span className="home-mono">MEHFPGP</span>
              {" "}(Semax&apos;s seven-letter amino-acid code). That laboratory and
              peptide-design record is what we treat as established.
            </p>
            <p className="home-body">
              Online lore sometimes claims a dramatic KGB operations origin. That
              folklore is memorable as a discovery hook. It is <strong>not</strong>{" "}
              established as historical fact on this site. We label folklore as
              folklore, then land on what Institute of Molecular Genetics researchers documented.
            </p>
            <Link href="/origin" className="home-inline-link">
              Read the origin story →
            </Link>
          </div>
          <div className="home-card home-card-wash">
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
        </div>
      </section>

      <section className="home-section home-section-last">
        <div className="home-section-head">
          <h2 className="home-h2">Start reading</h2>
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
    </div>
  );
}
