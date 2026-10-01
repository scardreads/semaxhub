import type { Metadata } from "next";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { PageShell } from "@/components/PageShell";
import { guideMetadata } from "@/lib/seo";
import Content from "./content.mdx";

export const metadata: Metadata = guideMetadata("/what-is-semax");

export default function Page() {
  return (
    <PageShell>
      <GuideJsonLd href="/what-is-semax" />
      <Content />
    </PageShell>
  );
}
