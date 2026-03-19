"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  LineChart,
  Lock,
  Rocket,
  Search,
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
  Bot: <Bot size={24} />,
  LineChart: <LineChart size={24} />,
  Zap: <Zap size={24} />,
  Search: <Search size={24} />,
  Rocket: <Rocket size={24} />,
  Lock: <Lock size={24} />,
};

const ICON_MAP_LG: Record<string, React.ReactNode> = {
  Bot: <Bot size={32} />,
  LineChart: <LineChart size={32} />,
  Zap: <Zap size={32} />,
  Search: <Search size={32} />,
  Rocket: <Rocket size={32} />,
  Lock: <Lock size={32} />,
};

export default function ServicesPage() {
  const [selected, setSelected] = useState(0);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "10rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Our Services"
              title="Enterprise AI automation,"
              titleHighlight="built for your budget."
              subtitle="We don't sell chatbots. We build fully managed automation systems that eliminate manual work and prove their ROI every month."
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Service Explorer */}
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
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6" style={{ minHeight: 400 }}>
              {/* Service list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {SERVICES.map((svc, i) => (
                  <button
                    key={svc.id}
                    onClick={() => setSelected(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "1rem 1.25rem",
                      background: selected === i ? "rgba(56,189,248,0.08)" : "transparent",
                      border: `1px solid ${selected === i ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 14,
                      color: selected === i ? "#38bdf8" : "var(--text-secondary)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: selected === i ? 600 : 400,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ flexShrink: 0 }}>{ICON_MAP[svc.icon]}</span>
                    {svc.title}
                  </button>
                ))}
              </div>

              {/* Detail panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-8 h-full" hoverEffect="border">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))",
                          border: "1px solid rgba(56,189,248,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#38bdf8",
                        }}
                      >
                        {ICON_MAP_LG[SERVICES[selected].icon]}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 600, fontFamily: "Outfit, sans-serif" }}>
                          {SERVICES[selected].title}
                        </h3>
                        <p style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                          {SERVICES[selected].metric}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#f87171", marginBottom: "0.5rem", fontWeight: 600 }}>
                        The Problem
                      </h4>
                      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        {SERVICES[selected].problem}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--success)", marginBottom: "0.5rem", fontWeight: 600 }}>
                        Our Solution
                      </h4>
                      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        {SERVICES[selected].solution}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>
            </div>
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
              subtitle="If it has an API, we can connect it. Here are the platforms we integrate with most."
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
                  "You learn the software",
                  "You integrate it yourself",
                  "You change your process to fit",
                  "Low adoption, high churn",
                ],
                verdict: "Doesn\u2019t work",
              },
              {
                label: "Cheap AI Agencies",
                color: "#fbbf24",
                items: [
                  "ChatGPT wrappers",
                  "Simple Zapier templates",
                  "No ongoing maintenance",
                  "Breaks when APIs update",
                ],
                verdict: "Breaks fast",
              },
              {
                label: "NovaScaling",
                color: "#34d399",
                items: [
                  "Custom-built for your workflows",
                  "Fully managed & maintained",
                  "Monthly ROI reports",
                  "Strategic CAIO partnership",
                ],
                verdict: "Built to last",
              },
            ].map((col, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <GlassCard
                  className="p-8"
                  hoverEffect={i === 2 ? "glow" : "lift"}
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
                        {i === 2 ? (
                          <CheckCircle size={16} style={{ color: "#34d399", flexShrink: 0 }} />
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
        subtitle="Tell us what's eating your time and we'll show you how to fix it &mdash; for free."
        buttonText="Get Your Free Audit"
        buttonHref="/audit"
      />
    </PageLayout>
  );
}
