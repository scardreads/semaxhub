import type { Metadata } from "next";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { PageShell } from "@/components/PageShell";
import { guideMetadata } from "@/lib/seo";
import Content from "./content.mdx";

export const metadata: Metadata = guideMetadata("/evidence");

export default function Page() {
  return (
    <PageShell>
      <GuideJsonLd href="/evidence" />
      <Content />
    </PageShell>
  );
}
