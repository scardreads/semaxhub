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
          Semax Hub is a free resource on Semax: history, how it works, evidence,
          safety context, and common confusions (including Semax vs Selank). We aim
          for a clear, sourced picture — and we don&apos;t sell Semax.
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

    </PageShell>
  );
}
