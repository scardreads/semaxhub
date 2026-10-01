import type { Metadata } from "next";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { PageShell } from "@/components/PageShell";
import { guideMetadata } from "@/lib/seo";
import Content from "./content.mdx";

export const metadata: Metadata = guideMetadata("/safety-faqs");

export default function Page() {
  return (
    <PageShell>
      <GuideJsonLd href="/safety-faqs" />
      <Content />
    </PageShell>
  );
}
