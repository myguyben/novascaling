"use client";

import { cn } from "@/lib/utils";

interface LogoMarqueeProps {
  items: string[];
  className?: string;
}

export function LogoMarquee({ items, className }: LogoMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("overflow-hidden py-8 relative", className)}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[var(--bg-deep)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[var(--bg-deep)] to-transparent pointer-events-none" />

      <div className="flex animate-[marquee_30s_linear_infinite] gap-8 w-max">
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-3 px-6 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl whitespace-nowrap text-[var(--text-secondary)] font-medium text-sm shrink-0"
          >
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full opacity-60" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoMarquee;
