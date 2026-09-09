import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'Evidence map',
  description: 'Russian clinical contexts and Western replication gaps.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
