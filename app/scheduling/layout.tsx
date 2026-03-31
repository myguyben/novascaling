import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduling | Ozio Consulting",
  description: "Internal scheduling dashboard for Ozio Consulting.",
  robots: { index: false, follow: false },
};

export default function SchedulingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
