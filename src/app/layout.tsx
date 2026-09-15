import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { AppClerkProvider } from "@/components/ClerkProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Semax Hub | Semax, the definitive resource",
    template: "%s | Semax Hub",
  },
  description:
    "Semax Hub is the place for sourced knowledge and discussion on the peptide known as the \"KGB brain spray\" and the \"Limitless peptide.\" Learn what it is, what the research says and, through discussion, exchange knowledge with like-minded people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.variable} antialiased`}>
        <AppClerkProvider>
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </AppClerkProvider>
      </body>
    </html>
  );
}
