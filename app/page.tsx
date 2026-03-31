"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Briefcase,
  ChevronRight,
  Clock,
  DollarSign,
  Gift,
  HardHat,
  Headset,
  Layers,
  LineChart,
  Lock,
  Paintbrush,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Store,
  Target,
  Thermometer,
  TreePine,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { IntroAnimation } from "@/components/animations/IntroAnimation";
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
    <IntroAnimation>
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
              <span>Operations Systems for Small Business</span>
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="hero-title">
              <TextReveal
                text="You're bleeding money."
                delay={0.4}
              />
            </h1>
            <h2 className="hero-title" style={{ marginTop: "0.25rem", fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)", whiteSpace: "nowrap" }}>
              <TypewriterText
                phrases={[
                  "Automation that pays for itself.",
                  "We find it. We fix it.",
                  "Your operations partner.",
                ]}
                className="text-gradient-hero"
              />
            </h2>
          </motion.div>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Most small businesses lose $3,000–$15,000 a year to missed leads, slow follow-ups, and manual busywork they don&apos;t even realize is a problem. We build the systems that stop the bleeding.
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <MagneticButton>
              <Button variant="primary" size="lg" href="/schedule">
                Let&apos;s Do Lunch <ArrowRight size={18} />
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

      {/* ── Free Website Badge ── */}
      <section style={{ padding: "1.5rem 2rem 0" }}>
        <div className="section-container" style={{ textAlign: "center" }}>
          <AnimatedSection>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "100px", color: "#34d399", fontSize: "0.9rem", fontWeight: 600 }}>
              <Gift size={18} />
              <span>Free custom website when you onboard — no strings attached</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section id="problem" className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="The Problem"
              title="You're losing money"
              titleHighlight="every single day."
              subtitle="Here's where it's going. Every one of these is fixable."
            />
          </AnimatedSection>

          <StaggerGrid className="problem-grid">
            {[
              {
                icon: <Clock size={28} />,
                title: "Missed Leads",
                desc: "A lead comes in at 8pm. You see it at 7am. They already called your competitor. Typical cost: $2,000–$10,000/year in lost jobs.",
              },
              {
                icon: <DollarSign size={28} />,
                title: "Manual Scheduling",
                desc: "Your office manager spends 2 hours a day playing phone tag. That's $15,000/year in wasted salary on something a system can handle.",
              },
              {
                icon: <Users size={28} />,
                title: "Follow-Up Black Hole",
                desc: "You send the quote. Never follow up. 60% of your quotes die in silence. Typical cost: $3,000–$15,000/year in lost work.",
              },
              {
                icon: <Target size={28} />,
                title: "Scattered Systems",
                desc: "Customer info in your phone, quotes in email, schedule on a whiteboard. Nothing talks to anything. You're the bottleneck.",
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

      {/* ── What We Do ── */}
      <section id="solution" className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="What We Do"
              title="We find what's broken."
              titleHighlight="Then we fix it."
              subtitle="Not a chatbot. Not a template. We embed into your business, build custom systems, and prove they work every month."
            />
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
            {[
              {
                icon: <Search size={28} />,
                title: "Find the leaks",
                desc: "We audit your operations top to bottom — quoting, scheduling, follow-ups, invoicing. You get a report showing exactly what's costing you money.",
                color: "#38bdf8",
              },
              {
                icon: <Zap size={28} />,
                title: "Build the fix",
                desc: "Custom automations built for your business. Not off-the-shelf tools. Real systems that handle the work your team shouldn't be doing manually.",
                color: "#818cf8",
              },
              {
                icon: <LineChart size={28} />,
                title: "Prove the ROI",
                desc: "Every month you get a report with exact hours saved and dollars returned. If we don't hit the numbers, you don't pay. Simple.",
                color: "#34d399",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <TiltCard>
                  <GlassCard className="p-8" hoverEffect="glow">
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, marginBottom: "1.25rem" }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", marginBottom: "0.5rem" }}>{item.title}</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>{item.desc}</p>
                  </GlassCard>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Who We Serve"
              title="Built for businesses that"
              titleHighlight="do real work."
              subtitle="We specialize in small businesses doing $100k–$3M in revenue. Service businesses where every missed call and slow follow-up costs real money."
            />
          </AnimatedSection>

          <StaggerGrid className="capabilities-grid">
            {[
              { icon: <Wrench size={24} />, label: "Plumbers" },
              { icon: <Zap size={24} />, label: "Electricians" },
              { icon: <Thermometer size={24} />, label: "HVAC" },
              { icon: <TreePine size={24} />, label: "Landscapers" },
              { icon: <HardHat size={24} />, label: "General Contractors" },
              { icon: <Paintbrush size={24} />, label: "Painters & Flooring" },
              { icon: <Briefcase size={24} />, label: "Consultants" },
              { icon: <Store size={24} />, label: "Local Retail" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="capability-pill">
                  <div className="capability-icon">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </StaggerGrid>
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
              { icon: <Headset size={24} />, label: "Customer Support Triage" },
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
              title="Dead simple."
              titleHighlight="Three steps."
            />
          </AnimatedSection>

          <div className="process-timeline">
            {[
              {
                step: "Step 1",
                title: "Audit",
                desc: "We dig into your operations for free. You get a report showing exactly where you're bleeding money and what to fix first.",
                icon: <Search size={28} />,
              },
              {
                step: "Step 2",
                title: "Build",
                desc: "We build and deploy custom automations for your business. No templates. Live in weeks, not months.",
                icon: <Zap size={28} />,
              },
              {
                step: "Step 3",
                title: "Scale",
                desc: "We maintain everything, optimize monthly, and prove ROI with hard numbers in your Growth Report.",
                icon: <TrendingUp size={28} />,
              },
            ].map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="process-step">
                  <div className="process-step-marker">
                    <div className="process-step-icon">{step.icon}</div>
                    {i < 2 && <div className="process-step-line" />}
                  </div>
                  <div className="process-step-content">
                    <div className="process-step-month">{step.step}</div>
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

      {/* ── Why Ozio Consulting ── */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Why Us"
              title="5 reasons to pick"
              titleHighlight="Ozio Consulting"
            />
          </AnimatedSection>

          <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { num: "01", title: "We don't sell software.", desc: "We build systems. Custom. For you. Not a SaaS login you'll never use." },
              { num: "02", title: "We prove ROI or you don't pay.", desc: "Every month you get a report showing exact hours saved and dollars returned. If we don't hit 40+ hours, next month is free." },
              { num: "03", title: "We do the work.", desc: "No training manuals. No onboarding. No 'here's your login, good luck.' We build it, run it, maintain it." },
              { num: "04", title: "We know trades.", desc: "Plumbers, electricians, HVAC, landscapers, GCs. We understand dispatch, quoting, follow-ups, and seasonal demand." },
              { num: "05", title: "Free website when you onboard.", desc: "Every client gets a professionally built, mobile-optimized website at no extra cost. No templates." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <GlassCard className="p-6" hoverEffect="border" style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "#38bdf8", flexShrink: 0, lineHeight: 1 }}>
                    {item.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, fontFamily: "Outfit, sans-serif", marginBottom: "0.25rem" }}>{item.title}</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>{item.desc}</p>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="What Clients Say"
              title="Don't take our word"
              titleHighlight="for it."
            />
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                quote: "I got my evenings back. The system handles 80% of tickets without me ever seeing them.",
                name: "D2C Brand Founder",
                industry: "E-Commerce",
                metric: "62 hours saved/month",
              },
              {
                quote: "We went from losing leads overnight to booking jobs before our competitors even check their email.",
                name: "Regional HVAC Dispatcher",
                industry: "HVAC Services",
                metric: "90-second lead response",
              },
              {
                quote: "My agents close more deals because they spend their time with clients instead of typing emails.",
                name: "Boutique Brokerage Owner",
                industry: "Real Estate",
                metric: "$5,800 saved/month",
              },
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <GlassCard className="p-8" hoverEffect="border" style={{ height: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1.25rem" }}>
                    <p style={{ color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.7, fontSize: "0.95rem", flex: 1 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</p>
                          <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>{t.industry}</p>
                        </div>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--success)",
                          background: "rgba(52,211,153,0.1)",
                          border: "1px solid rgba(52,211,153,0.2)",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "100px",
                        }}>
                          {t.metric}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTABanner
        title="Ready to stop"
        titleHighlight="leaving money on the table?"
        subtitle="They say there's no such thing as a free lunch. We're here to prove that wrong. No bullshit, no slides — just a real conversation about your business. We pick up the check."
        buttonText="Let's Do Lunch"
        buttonHref="/schedule"
      />
    </PageLayout>
    </IntroAnimation>
  );
}
