import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation Services for SMBs",
  description:
    "Customer support triage, lead qualification, automated follow-ups, internal knowledge bases, and sales pipeline automation. Enterprise AI at SMB prices.",
  openGraph: {
    title: "AI Automation Services for SMBs | NovaScaling",
    description:
      "Customer support triage, lead qualification, automated follow-ups, internal knowledge bases, and sales pipeline automation. Enterprise AI at SMB prices.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
