import type { Metadata } from "next";
import "./globals.css";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL("https://novascaling.ai"),
  title: {
    default: "NovaScaling — AI Automation for SMBs",
    template: "%s | NovaScaling",
  },
  description:
    "Fractional Chief AI Officer & Margin Expansion as a Service. We deploy custom AI automations that eliminate 40+ hours of manual labor per month for SMBs.",
  keywords: [
    "AI automation",
    "SMB automation",
    "fractional AI officer",
    "business automation",
    "AI consulting",
    "operational efficiency",
    "workflow automation",
    "fractional CAIO",
    "AI for small business",
    "business process automation",
  ],
  authors: [{ name: "NovaScaling" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://novascaling.ai",
    siteName: "NovaScaling",
    title: "NovaScaling — AI Automation for SMBs",
    description:
      "Enterprise-grade AI automation at SMB pricing. Eliminate 40+ hours of manual work per month with your Fractional Chief AI Officer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaScaling — AI Automation for SMBs",
    description:
      "Enterprise-grade AI automation at SMB pricing. Eliminate 40+ hours of manual work per month.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://novascaling.ai" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NovaScaling",
  url: "https://novascaling.ai",
  description:
    "Fractional Chief AI Officer & Margin Expansion as a Service for SMBs",
  sameAs: [],
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "850",
    highPrice: "5000",
    priceCurrency: "USD",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CursorGlow />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
