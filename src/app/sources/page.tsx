import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'Sources',
  description: 'Footnotes hub with gaps flagged.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
