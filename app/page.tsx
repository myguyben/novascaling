"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
  Menu,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "How It Works", href: "#process" },
  { label: "Pricing", href: "#pricing" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          <a href="#" className="logo">
            <div className="logo-icon">
              <TrendingUp size={20} />
            </div>
            <span className="logo-text">NovaScaling</span>
          </a>

          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link-item">
                {link.label}
              </a>
            ))}
          </div>

          <a href="#cta" className="btn btn-primary btn-sm">
            Book a Call <ArrowRight size={16} />
          </a>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-menu-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#cta" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Book a Call
            </a>
          </motion.div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-overlay" />
        </div>

        <motion.div className="hero-container" style={{ opacity: heroOpacity, scale: heroScale }}>
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} />
            <span>Fractional Chief AI Officer for SMBs</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Stop drowning in busywork.
            <br />
            <span className="text-gradient-hero">Rise above the grind.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            We deploy custom AI automations that eliminate 40+ hours of manual labor
            per month — so you can focus on growing your business, not running it.
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <a href="#cta" className="btn btn-primary btn-lg">
              Get Your Free AI Audit <ArrowRight size={18} />
            </a>
            <a href="#process" className="btn btn-ghost btn-lg">
              See How It Works
            </a>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
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
            <div className="section-label">The Problem</div>
            <h2 className="section-title">
              You&apos;re stuck in <span className="text-gradient-hero">the mud.</span>
            </h2>
            <p className="section-subtitle">
              SMB founders spend 70% of their time on low-leverage tasks that AI can handle
              in seconds. Meanwhile, the tools that could help are priced for enterprises.
            </p>
          </AnimatedSection>

          <div className="problem-grid">
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
                <div className="problem-card">
                  <div className="problem-icon">{item.icon}</div>
                  <h3 className="problem-card-title">{item.title}</h3>
                  <p className="problem-card-desc">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution Section ── */}
      <section id="solution" className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <div className="section-label">The Solution</div>
            <h2 className="section-title">
              The <span className="text-gradient-hero">A.N.T. System</span>
            </h2>
            <p className="section-subtitle">
              Enterprise-grade AI automation, built for your budget. Not a chatbot.
              Not a template. A fully managed growth engine embedded in your business.
            </p>
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
                <div className="ant-card">
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
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Automate ── */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <div className="section-label">Capabilities</div>
            <h2 className="section-title">
              What we <span className="text-gradient-hero">automate</span>
            </h2>
          </AnimatedSection>

          <div className="capabilities-grid">
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
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">
              From chaos to clarity in <span className="text-gradient-hero">90 days</span>
            </h2>
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
            <div className="section-label">Pricing</div>
            <h2 className="section-title">
              Less than a part-time hire.{" "}
              <span className="text-gradient-hero">10x the output.</span>
            </h2>
            <p className="section-subtitle">
              No setup fees. No long-term contracts. If we don&apos;t save you 40+ hours
              in the first month, the next month is free.
            </p>
          </AnimatedSection>

          <div className="pricing-grid">
            {/* Tier 1 */}
            <AnimatedSection delay={0}>
              <div className="pricing-card">
                <div className="pricing-tier-label">Core Operations</div>
                <div className="pricing-price">
                  $850<span>/mo</span>
                </div>
                <p className="pricing-target">For businesses $100k–$250k revenue</p>
                <ul className="pricing-features">
                  <li>2 core workflow automations</li>
                  <li>Internal Knowledge Agent</li>
                  <li>Monthly Growth Report</li>
                  <li>Email & chat support</li>
                </ul>
                <a href="#cta" className="btn btn-outline" style={{ width: "100%" }}>
                  Get Started
                </a>
              </div>
            </AnimatedSection>

            {/* Tier 2 */}
            <AnimatedSection delay={0.1}>
              <div className="pricing-card pricing-card-featured">
                <div className="pricing-badge">Most Popular</div>
                <div className="pricing-tier-label" style={{ color: "#38bdf8" }}>
                  Growth Engine
                </div>
                <div className="pricing-price">
                  $2,500<span>/mo</span>
                </div>
                <p className="pricing-target">For businesses $250k–$750k revenue</p>
                <ul className="pricing-features">
                  <li>5 core workflow automations</li>
                  <li>Custom AI Support Agent</li>
                  <li>CRM & ecosystem integration</li>
                  <li>Bi-weekly strategy sessions</li>
                  <li>Dynamic ROI dashboard</li>
                  <li>
                    <strong>40-hour guarantee</strong>
                  </li>
                </ul>
                <a href="#cta" className="btn btn-primary" style={{ width: "100%" }}>
                  Get Started <ArrowRight size={16} />
                </a>
              </div>
            </AnimatedSection>

            {/* Tier 3 */}
            <AnimatedSection delay={0.2}>
              <div className="pricing-card">
                <div className="pricing-tier-label">Enterprise Matrix</div>
                <div className="pricing-price">
                  $5,000<span>+/mo</span>
                </div>
                <p className="pricing-target">For businesses scaling to $3M+</p>
                <ul className="pricing-features">
                  <li>Complete operational takeover</li>
                  <li>Custom LLM fine-tuning</li>
                  <li>Multi-agent orchestration</li>
                  <li>SLA deployment guarantees</li>
                  <li>Dedicated Slack channel</li>
                  <li>Weekly CAIO sessions</li>
                </ul>
                <a href="#cta" className="btn btn-outline" style={{ width: "100%" }}>
                  Contact Us
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Trust ── */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <div className="section-label">Why NovaScaling</div>
            <h2 className="section-title">
              Built different from the <span className="text-gradient-hero">&quot;AI agencies&quot;</span>
            </h2>
          </AnimatedSection>

          <div className="trust-grid">
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
                <div className="trust-card">
                  <div className="trust-icon">{item.icon}</div>
                  <h3 className="trust-title">{item.title}</h3>
                  <p className="trust-desc">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="section cta-section">
        <div className="cta-bg">
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />
        </div>
        <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
          <AnimatedSection>
            <div className="cta-content">
              <h2 className="cta-title">
                Ready to escape <span className="text-gradient-hero">the grind?</span>
              </h2>
              <p className="cta-subtitle">
                Get a free AI Bottleneck Audit. We&apos;ll show you exactly how many hours
                and dollars you&apos;re losing to manual work — and how to fix it.
              </p>
              <div className="cta-buttons">
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-xl"
                >
                  Book Your Free Audit <ArrowRight size={20} />
                </a>
              </div>
              <p className="cta-note">No contracts. No setup fees. Cancel anytime.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div className="logo-icon">
                <TrendingUp size={18} />
              </div>
              <span className="logo-text">NovaScaling</span>
            </a>
            <p className="footer-tagline">
              Margin Expansion as a Service.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#solution">A.N.T. System</a>
              <a href="#process">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#cta">Contact</a>
              <a href="/dashboard">Client Portal</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 NovaScaling. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
