"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2 bg-[rgba(56,189,248,0.08)] border border-[rgba(56,189,248,0.2)] rounded-full text-sm text-[var(--accent)] font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
