"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}

export function CTABanner({
  title,
  titleHighlight,
  subtitle,
  buttonText,
  buttonHref,
  className,
}: CTABannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-28 px-8",
        className
      )}
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] top-[-20%] right-[-10%]" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-[radial-gradient(circle,rgba(234,88,12,0.15)_0%,transparent_70%)] bottom-[-20%] left-[-10%]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        <h2 className="font-['Cormorant_Garamond'] text-[clamp(2.2rem,4vw,3.5rem)] font-bold mb-6 leading-tight">
          {title}{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ea580c, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {titleHighlight}
          </span>
        </h2>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-10">
          {subtitle}
        </p>
        <div className="flex justify-center mb-6">
          <Button href={buttonHref} variant="primary" size="xl">
            {buttonText} <ArrowRight size={20} />
          </Button>
        </div>
        <p className="text-sm text-[var(--text-tertiary)]">
          No contracts. No setup fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

export default CTABanner;
