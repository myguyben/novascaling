import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduling | NovaScaling",
  description: "Internal scheduling dashboard for NovaScaling.",
  robots: { index: false, follow: false },
};

export default function SchedulingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
