"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Eye,
  Heart,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/animations/AnimatedSection";
import TextReveal from "@/components/animations/TextReveal";
import TiltCard from "@/components/animations/TiltCard";
import StaggerGrid from "@/components/animations/StaggerGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import CTABanner from "@/components/ui/CTABanner";

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "10rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
              <div className="section-label">About NovaScaling</div>
              <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
                <TextReveal
                  text="The story behind NovaScaling."
                  className="section-title"
                  delay={0.2}
                />
              </h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                We exist because small businesses deserve the same AI-powered
                operational efficiency that Fortune 500 companies take for granted
                &mdash; without the Fortune 500 price tag.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <GlassCard className="p-12 md:p-16 relative overflow-hidden" hoverEffect="glow">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 4,
                  height: "100%",
                  background: "linear-gradient(to bottom, #38bdf8, #818cf8, #34d399)",
                }}
              />
              <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                <Sparkles
                  size={32}
                  style={{ color: "#38bdf8", marginBottom: "1.5rem" }}
                />
                <p
                  style={{
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;To democratize world-class AI automation infrastructure for
                  main-street SMBs, ensuring they remain competitive in a
                  drastically evolving technological landscape.&rdquo;
                </p>
                <p
                  style={{
                    marginTop: "1.5rem",
                    color: "var(--accent)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Our Mission
                </p>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* A.N.T. Philosophy */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Our Framework"
              title="The"
              titleHighlight="A.N.T. Philosophy"
              subtitle="Every engagement follows our three-pillar system. No shortcuts, no exceptions."
            />
          </AnimatedSection>

          <div className="ant-grid">
            {[
              {
                letter: "A",
                word: "Acumen",
                icon: <Brain size={36} />,
                color: "#38bdf8",
                desc: "Deep strategic consulting to audit and map your existing SOPs before writing a single line of code. We don't guess \u2014 we diagnose. Every automation is backed by data on where your time and money actually bleed.",
              },
              {
                letter: "N",
                word: "Nuance",
                icon: <Layers size={36} />,
                color: "#818cf8",
                desc: "Custom AI tuning, robust prompt engineering, and context-aware systems. We don't slap ChatGPT on your website and call it a day. Every agent is purpose-built for your specific workflows, data, and edge cases.",
              },
              {
                letter: "T",
                word: "Trust",
                icon: <Shield size={36} />,
                color: "#34d399",
                desc: "White-glove implementation with severe data privacy controls. Your data is siloed. AI never executes financial transactions without human approval. We maintain, monitor, and optimize continuously.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <TiltCard>
                  <GlassCard
                    className="p-8"
                    hoverEffect="glow"
                  >
                    <div className="ant-card-header">
                      <div className="ant-letter" style={{ color: item.color }}>
                        {item.letter}
                      </div>
                      <div style={{ color: item.color, opacity: 0.7 }}>
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="ant-word">{item.word}</h3>
                    <p className="ant-desc">{item.desc}</p>
                  </GlassCard>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Our Values"
              title="What drives"
              titleHighlight="every decision"
            />
          </AnimatedSection>

          <StaggerGrid className="trust-grid">
            {[
              {
                icon: <Lock size={28} />,
                title: "Data Privacy First",
                desc: "Client data is strictly isolated within row-level security policies. We never use client CRM data to train foundational models. Period.",
              },
              {
                icon: <Target size={28} />,
                title: "Ruthless Reliability",
                desc: "If the AI model fails or returns low confidence, we default to a deterministic fallback or escalate to human review. No hallucinations in production.",
              },
              {
                icon: <TrendingUp size={28} />,
                title: "ROI or It Doesn\u2019t Ship",
                desc: "Every automation must prove its value in dollars saved and hours reclaimed. If we can\u2019t measure it, we don\u2019t build it.",
              },
              {
                icon: <Heart size={28} />,
                title: "SMB-First Pricing",
                desc: "We price for the business generating $300k/year, not the enterprise with unlimited budget. Our margins come from efficiency, not overcharging.",
              },
            ].map((item, i) => (
              <div key={i}>
                <TiltCard>
                  <div className="trust-card">
                    <div className="trust-icon">{item.icon}</div>
                    <h3 className="trust-title">{item.title}</h3>
                    <p className="trust-desc">{item.desc}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Fractional CAIO */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Your Embedded Partner"
              title="Not an agency. Not a contractor."
              titleHighlight="A strategic partner."
              subtitle="We act as your Fractional Chief AI Officer &mdash; embedded in your operations, aligned with your growth, accountable to your ROI."
            />
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                icon: <Eye size={24} />,
                title: "Full Visibility",
                desc: "Monthly Growth Payload reports with exact dollars saved. No black boxes.",
              },
              {
                icon: <Zap size={24} />,
                title: "Rapid Deployment",
                desc: "First automation live in 2 weeks. Full transformation in 90 days.",
              },
              {
                icon: <Shield size={24} />,
                title: "Zero Risk",
                desc: "No setup fees. No long-term contracts. 40-hour guarantee or the next month is free.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <GlassCard className="p-8" hoverEffect="border">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "rgba(56,189,248,0.1)",
                      border: "1px solid rgba(56,189,248,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#38bdf8",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "Outfit, sans-serif" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                    {item.desc}
                  </p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to meet your"
        titleHighlight="Fractional CAIO?"
        subtitle="Book a free AI Bottleneck Audit and see exactly how NovaScaling can transform your operations."
        buttonText="Get Your Free Audit"
        buttonHref="/audit"
      />
    </PageLayout>
  );
}
