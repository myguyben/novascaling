import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule a Meeting — Free Consultation",
  description:
    "Book a free consultation with Ozio Consulting. We'll walk through your operations, show you where you're losing money, and map out a plan to fix it.",
  openGraph: {
    title: "Schedule a Meeting | Ozio Consulting",
    description:
      "Book a free consultation. No pitch, no slides — just a real conversation about your business.",
  },
};

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
