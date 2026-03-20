import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NovaScaling — Our Mission & A.N.T. Framework",
  description:
    "Learn about NovaScaling's mission to democratize AI automation for SMBs. Our A.N.T. System (Acumen, Nuance, Trust) delivers enterprise-grade efficiency at SMB pricing.",
  openGraph: {
    title: "About NovaScaling — Our Mission & A.N.T. Framework",
    description:
      "Learn about NovaScaling's mission to democratize AI automation for SMBs. Our A.N.T. System (Acumen, Nuance, Trust) delivers enterprise-grade efficiency at SMB pricing.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
