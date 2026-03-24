import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Automation Services for SMBs",
  description:
    "Customer support triage, lead qualification, automated follow-ups, internal knowledge bases, and sales pipeline automation. Enterprise-grade automation at SMB prices.",
  openGraph: {
    title: "Business Automation Services for SMBs | NovaScaling",
    description:
      "Customer support triage, lead qualification, automated follow-ups, internal knowledge bases, and sales pipeline automation. Enterprise-grade automation at SMB prices.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
