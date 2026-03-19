"use client";

import { ArrowRight, Clock, DollarSign, Quote, SmilePlus, Timer } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { CountUp } from "@/components/animations/CountUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { CTABanner } from "@/components/ui/CTABanner";
import { CASE_STUDIES } from "@/lib/constants";

export default function CaseStudiesPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "10rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Case Studies"
              title="Real results from"
              titleHighlight="real businesses."
              subtitle="See how SMBs like yours eliminated manual work, cut response times, and scaled faster with NovaScaling."
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="section section-dark" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { end: 150, suffix: "+", label: "Hours Saved Monthly" },
                { end: 10, suffix: "x", label: "Average ROI" },
                { end: 94, suffix: "%", label: "Client Satisfaction" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 700,
                      fontFamily: "Outfit, sans-serif",
                      background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--text-tertiary)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section">
        <div className="section-container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {CASE_STUDIES.map((cs, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <GlassCard className="p-8 md:p-10" hoverEffect="border">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                  <Badge>{cs.industry}</Badge>
                  <span style={{ color: "var(--text-primary)", fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 600 }}>
                    {cs.company}
                  </span>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>
                    {cs.revenue}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div>
                    <h4
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#f87171",
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                      }}
                    >
                      The Problem
                    </h4>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                      {cs.problem}
                    </p>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#34d399",
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                      }}
                    >
                      Our Solution
                    </h4>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                      {cs.solution}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 14,
                      padding: "1.25rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <Clock size={18} style={{ color: "#38bdf8", marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "#34d399" }}>
                      <CountUp end={cs.metrics.hoursSaved} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Hours Saved/Mo
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 14,
                      padding: "1.25rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <Timer size={18} style={{ color: "#38bdf8", marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: "0.25rem" }}>
                      Before: <span style={{ color: "#f87171" }}>{cs.metrics.responseTime.before}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                      After: <span style={{ color: "#34d399", fontWeight: 600 }}>{cs.metrics.responseTime.after}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.5rem" }}>
                      Response Time
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 14,
                      padding: "1.25rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <SmilePlus size={18} style={{ color: "#38bdf8", marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: "0.25rem" }}>
                      Before: <span style={{ color: "#f87171" }}>{cs.metrics.satisfaction.before}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                      After: <span style={{ color: "#34d399", fontWeight: 600 }}>{cs.metrics.satisfaction.after}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.5rem" }}>
                      Satisfaction
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 14,
                      padding: "1.25rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <DollarSign size={18} style={{ color: "#38bdf8", marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "#34d399" }}>
                      $<CountUp end={cs.metrics.monthlySavings} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Monthly Savings
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div
                  style={{
                    background: "rgba(56,189,248,0.04)",
                    border: "1px solid rgba(56,189,248,0.1)",
                    borderRadius: 14,
                    padding: "1.5rem 2rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <Quote size={24} style={{ color: "#38bdf8", flexShrink: 0, marginTop: 2 }} />
                  <p style={{ color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.7, fontSize: "0.95rem" }}>
                    {cs.quote}
                  </p>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <CTABanner
        title="Ready to become the next"
        titleHighlight="success story?"
        subtitle="Get a free AI Bottleneck Audit and see your projected savings in 24 hours."
        buttonText="Get Your Free Audit"
        buttonHref="/audit"
      />
    </PageLayout>
  );
}
