import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description: "Why Semax Hub exists: informational only, never a shop.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
        Why Semax Hub exists
      </h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/85">
        <p>
          Semax Hub is here so newcomers can get a clear, sourced picture of Semax:
          history, mechanisms people discuss, evidence map, safety context, and common
          confusions (including Semax vs Selank), without wading through sales pages.
        </p>
        <p>
          We lean into memorable hooks like &quot;KGB peptide&quot; only as discovery. Then we
          land on the Institute of Molecular Genetics record and flag what&apos;s folklore
          vs what&apos;s documented.
        </p>
        <p>
          <strong>What we are:</strong> An informational hub and a reading-room style
          discussion space.
        </p>
        <p>
          <strong>What we aren&apos;t:</strong> A store, a clinic, or a dosing guide.
        </p>
        <p>
          No carts. No &quot;buy Semax.&quot; No medical advice. If a claim needs a citation and
          we don&apos;t have one yet, we say so.
        </p>
        <p className="font-medium text-teal-900">
          Promise: Curious, sourced, never a shop.
        </p>
      </div>
    </PageShell>
  );
}
