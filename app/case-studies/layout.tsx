import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Real Automation Results",
  description:
    "See how SMBs saved 40-60 hours per month with Ozio Consulting's workflow automation. Real results from e-commerce, HVAC, and real estate businesses.",
  openGraph: {
    title: "Case Studies — Real Automation Results | Ozio Consulting",
    description:
      "See how SMBs saved 40-60 hours per month with Ozio Consulting's workflow automation. Real results from e-commerce, HVAC, and real estate businesses.",
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
