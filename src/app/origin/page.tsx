import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: 'Origin story',
  description: 'From the “KGB peptide” and “Limitless peptide” nicknames to the Institute of Molecular Genetics record.',
};

export default function Page() {
  return (
    <PageShell>
      <Content />
    </PageShell>
  );
}
