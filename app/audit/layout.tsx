import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Bottleneck Audit",
  description:
    "Get a free efficiency audit showing exactly how many hours and dollars your business loses to manual work. Custom report within 24 hours.",
  openGraph: {
    title: "Free Bottleneck Audit | Ozio Consulting",
    description:
      "Get a free efficiency audit showing exactly how many hours and dollars your business loses to manual work. Custom report within 24 hours.",
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
