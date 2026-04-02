"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "lg" | "xl";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-gradient-to-br from-[#f59e0b] to-[#ea580c] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4),0_4px_15px_rgba(0,0,0,0.3)] hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(245,158,11,0.4),0_8px_25px_rgba(0,0,0,0.4)]",
  outline:
    "bg-transparent text-[var(--text-primary)] border border-[rgba(255,255,255,0.12)] justify-center hover:bg-[rgba(255,255,255,0.05)] hover:border-[var(--accent)] hover:translate-y-[-2px]",
  ghost:
    "bg-[rgba(255,255,255,0.06)] text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.12)]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3 text-base rounded-xl",
  xl: "px-10 py-4 text-lg rounded-2xl",
};

export function Button({
  children,
  variant = "primary",
  size = "lg",
  href,
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2 font-semibold cursor-pointer whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default Button;
