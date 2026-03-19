"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  titleHighlight,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-16", className)}>
      <p className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-4">
        {label}
      </p>
      <h2 className="font-['Outfit'] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight mb-5">
        {title}{" "}
        <span
          className="inline"
          style={{
            background: "linear-gradient(135deg, #38bdf8, #818cf8, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {titleHighlight}
        </span>
      </h2>
      {subtitle && (
        <p className="text-lg text-[var(--text-secondary)] max-w-[650px] mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
