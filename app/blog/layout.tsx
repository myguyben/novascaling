import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation Blog for SMBs",
  description:
    "Expert insights on AI automation, operational efficiency, and growth strategies for small and medium businesses.",
  openGraph: {
    title: "AI Automation Blog for SMBs | NovaScaling",
    description:
      "Expert insights on AI automation, operational efficiency, and growth strategies for small and medium businesses.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
