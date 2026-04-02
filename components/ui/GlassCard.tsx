"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "border";
  style?: React.CSSProperties;
}

const hoverStyles: Record<string, string> = {
  lift: "hover:translate-y-[-4px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]",
  glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15),0_20px_60px_rgba(0,0,0,0.3)]",
  border:
    "hover:border-[rgba(255,255,255,0.12)]",
};

export function GlassCard({
  children,
  className,
  hoverEffect = "lift",
  style,
}: GlassCardProps) {
  return (
    <div
      style={style}
      className={cn(
        "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-3xl backdrop-blur-[16px] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hoverStyles[hoverEffect],
        className
      )}
    >
      {children}
    </div>
  );
}

export default GlassCard;
