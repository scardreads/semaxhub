import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'What is Semax?',
  description: 'Heptapeptide MEHFPGP, ACTH(4-10) analog, nasal Rx in Russia.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
