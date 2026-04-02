import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Transparent Automation Plans",
  description:
    "Business automation starting at $497/mo. Three tiers: Starter, Growth, Partner. 40-hour guarantee on Growth+. Free custom website included. No setup fees, no contracts.",
  openGraph: {
    title: "Pricing — Transparent Automation Plans | Ozio Consulting",
    description:
      "Business automation starting at $497/mo. Starter, Growth, and Partner tiers. 40-hour guarantee. Free custom website included. No contracts.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
