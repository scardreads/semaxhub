import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'Regulatory status',
  description: 'Russia listings; not FDA/EMA-approved.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
