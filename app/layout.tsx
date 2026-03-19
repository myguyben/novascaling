import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaScaling — AI Automation for SMBs",
  description:
    "Fractional Chief AI Officer & Margin Expansion as a Service. We deploy custom AI automations that eliminate 40+ hours of manual labor per month.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
