import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Transparent AI Automation Plans",
  description:
    "AI automation starting at $850/mo. Three tiers: Core Operations, Growth Engine, Enterprise Matrix. 40-hour guarantee. No setup fees, no contracts.",
  openGraph: {
    title: "Pricing — Transparent AI Automation Plans | NovaScaling",
    description:
      "AI automation starting at $850/mo. Three tiers: Core Operations, Growth Engine, Enterprise Matrix. 40-hour guarantee. No setup fees, no contracts.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
