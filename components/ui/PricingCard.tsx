"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  target: string;
  features: string[];
  cta: string;
  featured: boolean;
  badge?: string;
}

export function PricingCard({
  name,
  price,
  period,
  target,
  features,
  cta,
  featured,
  badge,
}: PricingCardProps) {
  return (
    <div className={cn("relative", featured && "scale-[1.03]")}>
      {/* Badge */}
      {badge && (
        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#38bdf8] to-[#818cf8] text-black px-5 py-1.5 rounded-full font-bold text-xs tracking-wide">
          {badge}
        </div>
      )}

      <GlassCard
        className={cn(
          "p-10",
          featured &&
            "border-[rgba(56,189,248,0.3)] bg-gradient-to-b from-[rgba(56,189,248,0.06)] to-[rgba(255,255,255,0.03)] shadow-[0_0_40px_rgba(56,189,248,0.1)]"
        )}
        hoverEffect="lift"
      >
        {/* Tier Label */}
        <p
          className={cn(
            "text-xs uppercase tracking-widest font-semibold mb-4",
            featured ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"
          )}
        >
          {name}
        </p>

        {/* Price */}
        <div className="font-['Outfit'] text-5xl font-bold mb-2">
          ${price.toLocaleString()}
          <span className="text-base text-[var(--text-tertiary)] font-normal">
            {period}
          </span>
        </div>

        {/* Target */}
        <p className="text-[var(--text-secondary)] text-sm mb-8">{target}</p>

        {/* Features */}
        <ul className="flex flex-col gap-3 mb-8 list-none">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 text-[var(--text-secondary)] text-sm"
            >
              <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full shrink-0" />
              {feature.includes("guarantee") ? (
                <strong className="text-[var(--success)]">{feature}</strong>
              ) : (
                feature
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          href="/audit"
          variant={featured ? "primary" : "outline"}
          size="lg"
          className="w-full justify-center"
        >
          {cta}
        </Button>
      </GlassCard>
    </div>
  );
}

export default PricingCard;
