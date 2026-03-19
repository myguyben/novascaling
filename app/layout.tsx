import type { Metadata } from "next";
import "./globals.css";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

export const metadata: Metadata = {
  title: {
    default: "NovaScaling — AI Automation for SMBs",
    template: "%s | NovaScaling",
  },
  description:
    "Fractional Chief AI Officer & Margin Expansion as a Service. We deploy custom AI automations that eliminate 40+ hours of manual labor per month.",
  openGraph: {
    title: "NovaScaling — AI Automation for SMBs",
    description:
      "Enterprise-grade AI automation at SMB pricing. Eliminate 40+ hours of manual work per month.",
    siteName: "NovaScaling",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CursorGlow />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
