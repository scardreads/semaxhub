import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description: "Why Semax Hub exists: informational only, never a shop.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
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
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="surface p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-ink">What we are</h2>
          <p className="mt-3 leading-relaxed text-ink/85">
            An informational hub and a reading-room style discussion space.
          </p>
        </div>
        <div className="surface p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-ink">What we aren&apos;t</h2>
          <p className="mt-3 leading-relaxed text-ink/85">
            A store, a clinic, or a dosing guide.
          </p>
        </div>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink/85">
        No carts. No &quot;buy Semax.&quot; No medical advice. If a claim needs a citation and
        we don&apos;t have one yet, we say so.
      </p>

      <div className="surface mt-8 p-5 sm:p-6">
        <p className="font-medium text-ink">
          Promise: Curious. Sourced. Never a shop.
        </p>
      </div>
    </PageShell>
  );
}
