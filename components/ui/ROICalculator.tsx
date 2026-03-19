"use client";

import { useState } from "react";
import { DollarSign, Clock, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(50);

  const monthlySavingsHours = Math.round(hoursPerWeek * 0.6 * 4.33);
  const monthlySavingsDollars = monthlySavingsHours * hourlyRate;
  const annualSavings = monthlySavingsDollars * 12;

  return (
    <GlassCard className="p-8 md:p-10 max-w-[700px] mx-auto" hoverEffect="glow">
      <h3 className="font-['Outfit'] text-2xl font-bold mb-2 text-center">
        Calculate Your Savings
      </h3>
      <p className="text-[var(--text-secondary)] text-sm text-center mb-8">
        See how much time and money AI automation could save your business.
      </p>

      <div className="flex flex-col gap-6 mb-8">
        {/* Hours per week slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Hours spent on repetitive tasks / week
            </label>
            <span className="font-['Outfit'] text-lg font-bold text-[var(--accent)]">
              {hoursPerWeek}h
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[rgba(255,255,255,0.06)]"
            style={{
              accentColor: "#38bdf8",
            }}
          />
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
            <span>5h</span>
            <span>60h</span>
          </div>
        </div>

        {/* Hourly rate slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Your effective hourly rate
            </label>
            <span className="font-['Outfit'] text-lg font-bold text-[var(--accent)]">
              ${hourlyRate}
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={200}
            step={5}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[rgba(255,255,255,0.06)]"
            style={{
              accentColor: "#38bdf8",
            }}
          />
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
            <span>$25</span>
            <span>$200</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 bg-[rgba(56,189,248,0.1)] rounded-xl flex items-center justify-center mx-auto mb-3 text-[var(--accent)]">
            <Clock size={20} />
          </div>
          <div className="font-['Outfit'] text-2xl font-bold text-[var(--text-primary)]">
            {monthlySavingsHours}h
          </div>
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mt-1">
            Hours saved / mo
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(56,189,248,0.2)] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 bg-[rgba(56,189,248,0.1)] rounded-xl flex items-center justify-center mx-auto mb-3 text-[var(--accent)]">
            <DollarSign size={20} />
          </div>
          <div className="font-['Outfit'] text-2xl font-bold text-[var(--success)]">
            ${monthlySavingsDollars.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mt-1">
            Saved / month
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 bg-[rgba(52,211,153,0.1)] rounded-xl flex items-center justify-center mx-auto mb-3 text-[var(--success)]">
            <TrendingUp size={20} />
          </div>
          <div className="font-['Outfit'] text-2xl font-bold text-[var(--text-primary)]">
            ${annualSavings.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mt-1">
            Annual savings
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default ROICalculator;
