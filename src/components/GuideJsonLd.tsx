import { JsonLd } from "@/components/JsonLd";
import { guideJsonLd, type GuideHref } from "@/lib/seo";

export function GuideJsonLd({ href }: { href: GuideHref }) {
  return <JsonLd data={guideJsonLd(href)} />;
}
