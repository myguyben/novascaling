"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] pt-16 pb-8 px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 mb-12">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#38bdf8] to-[#818cf8] rounded-[10px] flex items-center justify-center text-black">
              <TrendingUp size={18} />
            </div>
            <span className="font-['Outfit'] font-bold text-[1.3rem] tracking-tight text-[var(--text-primary)]">
              Ozio Consulting
            </span>
          </Link>
          <p className="text-[var(--text-tertiary)] text-sm mt-3">
            We fix the operations that cost you money.
          </p>
        </div>

        {/* Link Columns */}
        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-semibold mb-2">
              Product
            </h4>
            <Link
              href="/services"
              className="text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Pricing
            </Link>
            {/* <Link
              href="/case-studies"
              className="text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Case Studies
            </Link> */}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-semibold mb-2">
              Company
            </h4>
            <Link
              href="/schedule"
              className="text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Let&apos;s Do Lunch
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Client Portal
            </Link>
            <Link
              href="/links"
              className="text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              Links
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1200px] mx-auto pt-8 border-t border-[var(--glass-border)]">
        <p className="text-xs text-[var(--text-tertiary)]">
          &copy; 2026 Ozio Consulting. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
