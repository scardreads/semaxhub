import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'What is Semax?',
  description: 'Heptapeptide MEHFPGP, adrenocorticotropic hormone (ACTH) fragment analog, nasal Rx in Russia.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
