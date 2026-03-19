"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ArrowRight, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-100 px-8 py-4 transition-all duration-400",
        scrolled &&
          "bg-[rgba(3,7,18,0.85)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.06)] py-3"
      )}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#38bdf8] to-[#818cf8] rounded-[10px] flex items-center justify-center text-black">
            <TrendingUp size={20} />
          </div>
          <span className="font-['Outfit'] font-bold text-[1.3rem] tracking-tight text-[var(--text-primary)]">
            NovaScaling
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] font-medium transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="/audit"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] text-black shadow-[0_0_20px_rgba(56,189,248,0.4),0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(56,189,248,0.4),0_8px_25px_rgba(0,0,0,0.4)]"
        >
          Book a Call <ArrowRight size={16} />
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden bg-transparent border-none text-[var(--text-primary)] cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="flex md:hidden flex-col gap-4 py-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg text-[var(--text-secondary)] py-2 transition-colors duration-200 hover:text-[var(--text-primary)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/audit"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-base font-bold rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] text-black"
            >
              Book a Call
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
