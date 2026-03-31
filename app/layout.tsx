import type { Metadata } from "next";
import "./globals.css";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL("https://ozioconsulting.com"),
  title: {
    default: "Ozio Consulting — Business Automation for SMBs",
    template: "%s | Ozio Consulting",
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
  authors: [{ name: "Ozio Consulting" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ozioconsulting.com",
    siteName: "Ozio Consulting",
    title: "Ozio Consulting — Business Automation for SMBs",
    description:
      "Enterprise-grade workflow automation at SMB pricing. Eliminate 40+ hours of manual work per month with your Fractional Operations Partner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ozio Consulting — Business Automation for SMBs",
    description:
      "Enterprise-grade workflow automation at SMB pricing. Eliminate 40+ hours of manual work per month.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ozioconsulting.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ozio Consulting",
  url: "https://ozioconsulting.com",
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
