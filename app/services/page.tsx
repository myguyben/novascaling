"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  DollarSign,
  LineChart,
  Phone,
  Star,
  Wrench,
  X as XIcon,
  Zap,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/animations/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/ui/CTABanner";
import LogoMarquee from "@/components/ui/LogoMarquee";
import { SERVICES, INTEGRATIONS } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  Phone: <Phone size={24} />,
  Zap: <Zap size={24} />,
  Calendar: <Calendar size={24} />,
  Star: <Star size={24} />,
  LineChart: <LineChart size={24} />,
  Wrench: <Wrench size={24} />,
};

const ICON_MAP_LG: Record<string, React.ReactNode> = {
  Phone: <Phone size={32} />,
  Zap: <Zap size={32} />,
  Calendar: <Calendar size={32} />,
  Star: <Star size={32} />,
  LineChart: <LineChart size={32} />,
  Wrench: <Wrench size={32} />,
};

export default function ServicesPage() {
  const [selected, setSelected] = useState(0);
  const svc = SERVICES[selected];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "10rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Our Services"
              title="Everything your business needs,"
              titleHighlight="automated."
              subtitle="We build fully managed automation systems for trades and home services businesses. Each service is custom-built for how you actually work — not how software thinks you should."
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Service Explorer */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="What We Build"
              title="Choose your"
              titleHighlight="biggest pain point"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            {/* Service selector tabs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "2rem" }}>
              {SERVICES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.85rem 1rem",
                    background: selected === i ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selected === i ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 12,
                    color: selected === i ? "#f59e0b" : "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: selected === i ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{ICON_MAP[s.icon]}</span>
                  {s.title}
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,88,12,0.15))",
                      border: "1px solid rgba(245,158,11,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f59e0b",
                      flexShrink: 0,
                    }}
                  >
                    {ICON_MAP_LG[svc.icon]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", marginBottom: "0.15rem" }}>
                      {svc.title}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                      {svc.short}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,88,12,0.08))",
                      border: "1px solid rgba(245,158,11,0.25)",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", color: "#f59e0b" }}>
                      {svc.metric}
                    </div>
                  </div>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left — Problem, How It Works, Example */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Problem */}
                    <GlassCard className="p-6" hoverEffect="border">
                      <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#f87171", marginBottom: "0.6rem", fontWeight: 600 }}>
                        The Problem
                      </h4>
                      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                        {svc.problem}
                      </p>
                    </GlassCard>

                    {/* How It Works */}
                    <GlassCard className="p-6" hoverEffect="border">
                      <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 600 }}>
                        How It Works
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {svc.steps.map((step, j) => (
                          <div key={j} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                                color: "#000",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              {j + 1}
                            </div>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, fontSize: "0.85rem" }}>
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* Real Example */}
                    <GlassCard className="p-6" hoverEffect="border">
                      <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--success)", marginBottom: "0.6rem", fontWeight: 600 }}>
                        Real Example
                      </h4>
                      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.85rem", fontStyle: "italic" }}>
                        {svc.example}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "0.75rem",
                          padding: "0.45rem 0.75rem",
                          borderRadius: 8,
                          background: "rgba(212,168,83,0.08)",
                          border: "1px solid rgba(212,168,83,0.2)",
                        }}
                      >
                        <DollarSign size={14} style={{ color: "#d4a853", flexShrink: 0 }} />
                        <span style={{ color: "#d4a853", fontSize: "0.8rem", fontWeight: 600 }}>
                          {svc.roi}
                        </span>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Right — What's Included */}
                  <GlassCard className="p-6" hoverEffect="glow" style={{ height: "100%" }}>
                    <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", marginBottom: "1rem", fontWeight: 600 }}>
                      What&apos;s Included
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {svc.features.map((feature, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <CheckCircle size={15} style={{ color: "#d4a853", flexShrink: 0, marginTop: 2 }} />
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </AnimatePresence>
          </AnimatedSection>
        </div>
      </section>

      {/* Integrations */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Integrations"
              title="Connects with the tools"
              titleHighlight="you already use"
              subtitle="We don't replace your existing software. We plug into it and automate the gaps. If it has an API, we can connect it."
            />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <LogoMarquee items={INTEGRATIONS} />
          </AnimatedSection>
        </div>
      </section>

      {/* How We're Different */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="The Difference"
              title="Three choices. Only one"
              titleHighlight="actually works."
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Generic SaaS",
                color: "#f87171",
                items: [
                  "You learn the software yourself",
                  "Doesn't respond to leads at 2am",
                  "No follow-up automation",
                  "Low adoption, high churn",
                ],
                verdict: "Doesn\u2019t work",
              },
              {
                label: "Budget Agencies",
                color: "#fbbf24",
                items: [
                  "Cookie-cutter Zapier templates",
                  "Simple chatbot, not real automation",
                  "No ongoing maintenance",
                  "Breaks when your tools update",
                ],
                verdict: "Breaks fast",
              },
              {
                label: "Ozio Consulting",
                color: "#d4a853",
                items: [
                  "Custom-built for your business",
                  "Fully managed & maintained monthly",
                  "Provable ROI every month",
                  "Integrates with ServiceTitan, Jobber, etc.",
                ],
                verdict: "Built to last",
              },
            ].map((col, ci) => (
              <AnimatedSection key={ci} delay={ci * 0.15}>
                <GlassCard
                  className="p-8"
                  hoverEffect={ci === 2 ? "glow" : "lift"}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: col.color,
                      fontWeight: 700,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {col.label}
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                    {col.items.map((item, j) => (
                      <li
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {ci === 2 ? (
                          <CheckCircle size={16} style={{ color: "#d4a853", flexShrink: 0 }} />
                        ) : (
                          <XIcon size={16} style={{ color: col.color, flexShrink: 0, opacity: 0.6 }} />
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: 8,
                      background: `${col.color}15`,
                      border: `1px solid ${col.color}30`,
                      color: col.color,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {col.verdict}
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to automate your"
        titleHighlight="biggest bottleneck?"
        subtitle="No slides, no pitch. Just a real conversation about your business — and we'll show you exactly where you're losing money."
        buttonText="Tell Us Your Problems"
        buttonHref="/schedule"
      />
    </PageLayout>
  );
}
