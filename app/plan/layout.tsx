import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Plan",
  robots: { index: false, follow: false },
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
