import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'How Semax works',
  description: 'Brain-derived neurotrophic factor (BDNF) / TrkB signals and open questions.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
