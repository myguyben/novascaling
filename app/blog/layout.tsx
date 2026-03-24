import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Automation Blog for SMBs",
  description:
    "Expert insights on workflow automation, operational efficiency, and growth strategies for small and medium businesses.",
  openGraph: {
    title: "Business Automation Blog for SMBs | NovaScaling",
    description:
      "Expert insights on workflow automation, operational efficiency, and growth strategies for small and medium businesses.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
