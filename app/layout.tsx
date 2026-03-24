import type { Metadata } from "next";
import "./globals.css";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL("https://novascaling.ai"),
  title: {
    default: "NovaScaling — Business Automation for SMBs",
    template: "%s | NovaScaling",
  },
  description:
    "Fractional Operations Partner & Margin Expansion as a Service. We build custom automated workflows that eliminate 40+ hours of manual labor per month for SMBs.",
  keywords: [
    "business automation",
    "SMB automation",
    "fractional operations partner",
    "workflow automation",
    "operations consulting",
    "operational efficiency",
    "small business automation",
    "business process automation",
    "automated workflows",
    "operations outsourcing",
  ],
  authors: [{ name: "NovaScaling" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://novascaling.ai",
    siteName: "NovaScaling",
    title: "NovaScaling — Business Automation for SMBs",
    description:
      "Enterprise-grade workflow automation at SMB pricing. Eliminate 40+ hours of manual work per month with your Fractional Operations Partner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaScaling — Business Automation for SMBs",
    description:
      "Enterprise-grade workflow automation at SMB pricing. Eliminate 40+ hours of manual work per month.",
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
    "Fractional Operations Partner & Margin Expansion as a Service for SMBs",
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
