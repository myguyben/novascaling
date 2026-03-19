"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  ChevronRight,
  Clock,
  DollarSign,
  Layers,
  LineChart,
  Lock,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { CountUp } from "@/components/animations/CountUp";
import { ParticleField } from "@/components/animations/ParticleField";
import { TextReveal } from "@/components/animations/TextReveal";
import { TypewriterText } from "@/components/animations/TypewriterText";
import { TiltCard } from "@/components/animations/TiltCard";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CTABanner } from "@/components/ui/CTABanner";
import { PricingCard } from "@/components/ui/PricingCard";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { PRICING_TIERS, INTEGRATIONS } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  Search: <Search size={28} />,
  Zap: <Zap size={28} />,
  Layers: <Layers size={28} />,
  TrendingUp: <TrendingUp size={28} />,
};

export default function Home() {
  const heroRef = useRef(null);

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section ref={heroRef} className="hero-section">
        <ParticleField className="absolute inset-0" />
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-overlay" />
        </div>

        <motion.div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-8">
              <Sparkles size={14} />
              <span>Fractional Chief AI Officer for SMBs</span>
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <TextReveal
              text="Stop drowning in busywork."
              className="hero-title"
              delay={0.4}
            />
            <h1 className="hero-title" style={{ marginTop: "-0.5rem" }}>
              <TypewriterText
                phrases={[
                  "Rise above the grind.",
                  "Scale faster than ever.",
                  "Your AI partner is here.",
                ]}
                className="text-gradient-hero"
              />
            </h1>
          </motion.div>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            We deploy custom AI automations that eliminate 40+ hours of manual labor
            per month — so you can focus on growing your business, not running it.
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <MagneticButton>
              <Button variant="primary" size="lg" href="/audit">
                Get Your Free AI Audit <ArrowRight size={18} />
              </Button>
            </MagneticButton>
            <Button variant="ghost" size="lg" href="/services">
              See How It Works
            </Button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="hero-stat">
              <div className="hero-stat-value">
                <CountUp end={40} suffix="+" />
              </div>
              <div className="hero-stat-label">Hours saved / month</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">
                <CountUp end={85} suffix="%" />
              </div>
              <div className="hero-stat-label">Gross margins</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">
                <CountUp end={10} suffix="x" />
              </div>
              <div className="hero-stat-label">Faster than a VA</div>
            </div>
          </motion.div>
        </motion.div>

        <div className="hero-scroll-indicator">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronRight size={20} style={{ transform: "rotate(90deg)" }} />
          </motion.div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section id="problem" className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="The Problem"
              title="You're stuck in"
              titleHighlight="the mud."
              subtitle="SMB founders spend 70% of their time on low-leverage tasks that AI can handle in seconds. Meanwhile, the tools that could help are priced for enterprises."
            />
          </AnimatedSection>

          <StaggerGrid className="problem-grid">
            {[
              {
                icon: <Clock size={28} />,
                title: "Time Trapped",
                desc: "Copy-pasting between Shopify, Zendesk, Slack, and your CRM. Every. Single. Day.",
              },
              {
                icon: <DollarSign size={28} />,
                title: "Priced Out",
                desc: "A full-time AI officer costs $150k+. Bespoke consulting starts at $10k. You can't afford either.",
              },
              {
                icon: <Users size={28} />,
                title: "Talent Gap",
                desc: "You need enterprise-grade automation but have a 3-person team and no in-house engineers.",
              },
              {
                icon: <Target size={28} />,
                title: "Broken Solutions",
                desc: "Generic SaaS tools require you to change your process. Cheap agencies deliver ChatGPT wrappers that break.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <GlassCard className="problem-card">
                  <div className="problem-icon">{item.icon}</div>
                  <h3 className="problem-card-title">{item.title}</h3>
                  <p className="problem-card-desc">{item.desc}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── Solution Section ── */}
      <section id="solution" className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="The Solution"
              title="The"
              titleHighlight="A.N.T. System"
              subtitle="Enterprise-grade AI automation, built for your budget. Not a chatbot. Not a template. A fully managed growth engine embedded in your business."
            />
          </AnimatedSection>

          <div className="ant-grid">
            {[
              {
                letter: "A",
                word: "Acumen",
                icon: <Brain size={32} />,
                desc: "We audit your SOPs, map your bottlenecks, and identify exactly where AI creates the highest ROI — before writing a single line of code.",
                color: "#38bdf8",
              },
              {
                letter: "N",
                word: "Nuance",
                icon: <Layers size={32} />,
                desc: "Custom AI tuning, robust prompt engineering, and context-aware systems purpose-built for your specific workflows. No generic wrappers.",
                color: "#818cf8",
              },
              {
                letter: "T",
                word: "Trust",
                icon: <Shield size={32} />,
                desc: "White-glove implementation with strict data privacy controls, continuous monitoring, and proactive maintenance. Your data never leaves your silo.",
                color: "#34d399",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <TiltCard>
                  <GlassCard className="ant-card" hoverEffect="glow">
                    <div className="ant-card-header">
                      <div className="ant-letter" style={{ color: item.color }}>
                        {item.letter}
                      </div>
                      <div className="ant-icon" style={{ color: item.color }}>
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

      {/* ── What We Automate ── */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Capabilities"
              title="What we"
              titleHighlight="automate"
            />
          </AnimatedSection>

          <StaggerGrid className="capabilities-grid">
            {[
              { icon: <Bot size={24} />, label: "Customer Support Triage" },
              { icon: <LineChart size={24} />, label: "Lead Qualification & Routing" },
              { icon: <Zap size={24} />, label: "Automated Follow-ups" },
              { icon: <Search size={24} />, label: "Internal Knowledge Bases" },
              { icon: <Rocket size={24} />, label: "Sales Pipeline Automation" },
              { icon: <Lock size={24} />, label: "Vendor & Email Drafting" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="capability-pill">
                  <div className="capability-icon">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </StaggerGrid>

          <AnimatedSection delay={0.3}>
            <div style={{ marginTop: "3rem" }}>
              <LogoMarquee items={INTEGRATIONS} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="How It Works"
              title="From chaos to clarity in"
              titleHighlight="90 days"
            />
          </AnimatedSection>

          <div className="process-timeline">
            {[
              {
                month: "Month 1",
                title: "The Diagnostic",
                desc: "We audit every SOP, tool, and workflow to find where you're bleeding time and money. You get a custom AI Roadmap.",
                icon: <Search size={28} />,
              },
              {
                month: "Month 2",
                title: "Quick Wins",
                desc: "We deploy high-ROI automations immediately — internal knowledge bots, email triage, lead routing. You see results in days, not months.",
                icon: <Zap size={28} />,
              },
              {
                month: "Month 3",
                title: "Core Automations",
                desc: "Full pipeline integration: your CRM, helpdesk, and comms tools connected through intelligent AI orchestration.",
                icon: <Layers size={28} />,
              },
              {
                month: "Month 4+",
                title: "Continuous Growth",
                desc: "Ongoing optimization, new automation opportunities, and monthly ROI reports proving every dollar of your investment.",
                icon: <TrendingUp size={28} />,
              },
            ].map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="process-step">
                  <div className="process-step-marker">
                    <div className="process-step-icon">{step.icon}</div>
                    {i < 3 && <div className="process-step-line" />}
                  </div>
                  <div className="process-step-content">
                    <div className="process-step-month">{step.month}</div>
                    <h3 className="process-step-title">{step.title}</h3>
                    <p className="process-step-desc">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Pricing"
              title="Less than a part-time hire."
              titleHighlight="10x the output."
              subtitle="No setup fees. No long-term contracts. If we don't save you 40+ hours in the first month, the next month is free."
            />
          </AnimatedSection>

          <div className="pricing-grid">
            {PRICING_TIERS.map((tier, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <PricingCard {...tier} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button variant="ghost" size="lg" href="/pricing">
                See full pricing details <ArrowRight size={16} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Social Proof / Trust ── */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Why NovaScaling"
              title="Built different from the"
              titleHighlight={'"AI agencies"'}
            />
          </AnimatedSection>

          <StaggerGrid className="trust-grid">
            {[
              {
                icon: <Shield size={28} />,
                title: "No Hallucination Risk",
                desc: "Our AI never executes financial transactions or destructive actions without schema validation and human-in-the-loop approval.",
              },
              {
                icon: <Lock size={28} />,
                title: "Data Stays Yours",
                desc: "Strict row-level security. Your data is siloed. We never use client data to train models.",
              },
              {
                icon: <LineChart size={28} />,
                title: "Provable ROI",
                desc: "Monthly Growth Payload reports show the exact hours saved and dollar value created. No vanity metrics.",
              },
              {
                icon: <Rocket size={28} />,
                title: "Done For You",
                desc: "We don't hand you a tool and wish you luck. We build it, maintain it, optimize it, and report on it.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <TiltCard>
                  <GlassCard className="trust-card" hoverEffect="glow">
                    <div className="trust-icon">{item.icon}</div>
                    <h3 className="trust-title">{item.title}</h3>
                    <p className="trust-desc">{item.desc}</p>
                  </GlassCard>
                </TiltCard>
              </AnimatedSection>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTABanner
        title="Ready to escape"
        titleHighlight="the grind?"
        subtitle="Get a free AI Bottleneck Audit. We'll show you exactly how many hours and dollars you're losing to manual work — and how to fix it."
        buttonText="Book Your Free Audit"
        buttonHref="/audit"
      />
    </PageLayout>
  );
}
