import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
