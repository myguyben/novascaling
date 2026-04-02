import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automation Services for Trades & Home Services",
  description:
    "Lead capture, estimate follow-ups, scheduling, review automation, and CRM pipeline management. Custom-built for plumbers, HVAC, electricians, landscapers, and contractors.",
  openGraph: {
    title: "Automation Services for Trades & Home Services | Ozio Consulting",
    description:
      "Lead capture, estimate follow-ups, scheduling, review automation, and CRM pipeline management. Custom-built for trades and home services businesses.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
