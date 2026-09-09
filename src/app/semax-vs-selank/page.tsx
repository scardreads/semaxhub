import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'Semax vs Selank',
  description: 'Related peptides, different aims.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
