import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | NovaScaling",
  description:
    "All NovaScaling links in one place — book a call, visit our site, get a free audit, and follow us on social media.",
  robots: { index: true, follow: true },
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
