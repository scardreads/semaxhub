import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'Safety & FAQs',
  description: 'Not medical advice. Quality caveats.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
