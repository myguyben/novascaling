"use client";

import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/animations/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import PricingCard from "@/components/ui/PricingCard";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ROICalculator from "@/components/ui/ROICalculator";
import CTABanner from "@/components/ui/CTABanner";
import { PRICING_TIERS, FAQ_ITEMS } from "@/lib/constants";

const COMPARISON_FEATURES = [
  { name: "Workflow Automations", tiers: ["2", "5", "Unlimited"] },
  { name: "Internal Knowledge Agent", tiers: ["\u2713", "\u2713", "\u2713"] },
  { name: "Monthly Growth Report", tiers: ["\u2713", "\u2713", "\u2713"] },
  { name: "Custom AI Support Agent", tiers: ["\u2014", "\u2713", "\u2713"] },
  { name: "CRM & Ecosystem Integration", tiers: ["\u2014", "\u2713", "\u2713"] },
  { name: "Strategy Sessions", tiers: ["\u2014", "Bi-weekly", "Weekly"] },
  { name: "Dynamic ROI Dashboard", tiers: ["\u2014", "\u2713", "\u2713"] },
  { name: "40-Hour Guarantee", tiers: ["\u2014", "\u2713", "\u2713"] },
  { name: "Custom LLM Fine-Tuning", tiers: ["\u2014", "\u2014", "\u2713"] },
  { name: "Multi-Agent Orchestration", tiers: ["\u2014", "\u2014", "\u2713"] },
  { name: "SLA Guarantees", tiers: ["\u2014", "\u2014", "\u2713"] },
  { name: "Dedicated Slack Channel", tiers: ["\u2014", "\u2014", "\u2713"] },
];

export default function PricingPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "10rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Pricing"
              title="Transparent pricing."
              titleHighlight="No surprises."
              subtitle="Less than a part-time hire. 10x the output. No setup fees, no long-term contracts."
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section section-dark" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          <div className="pricing-grid">
            {PRICING_TIERS.map((tier, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <PricingCard {...tier} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="ROI Calculator"
              title="See how much you'll"
              titleHighlight="save"
              subtitle="Plug in your numbers and see the math for yourself."
            />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <ROICalculator />
          </AnimatedSection>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Compare Plans"
              title="Feature"
              titleHighlight="comparison"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <GlassCard className="overflow-hidden" hoverEffect="border">
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "1.25rem 1.5rem",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        Feature
                      </th>
                      {["Core ($850)", "Growth ($2,500)", "Enterprise ($5,000+)"].map(
                        (label, i) => (
                          <th
                            key={i}
                            style={{
                              textAlign: "center",
                              padding: "1.25rem 1rem",
                              color: i === 1 ? "#38bdf8" : "var(--text-primary)",
                              fontWeight: 600,
                              borderBottom: "1px solid var(--glass-border)",
                              fontFamily: "Outfit, sans-serif",
                              fontSize: "0.95rem",
                            }}
                          >
                            {label}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((feature, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            color: "var(--text-secondary)",
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                          }}
                        >
                          {feature.name}
                        </td>
                        {feature.tiers.map((val, j) => (
                          <td
                            key={j}
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                              borderBottom: "1px solid rgba(255,255,255,0.03)",
                              color:
                                val === "\u2713"
                                  ? "#34d399"
                                  : val === "\u2014"
                                  ? "var(--text-tertiary)"
                                  : "var(--text-primary)",
                              fontWeight: val === "\u2713" ? 700 : 400,
                              fontSize: val === "\u2713" ? "1.1rem" : "0.9rem",
                            }}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Performance Guarantee */}
      <section className="section">
        <div className="section-container">
          <AnimatedSection>
            <GlassCard
              className="p-10 md:p-14 text-center"
              hoverEffect="glow"
            >
              <Sparkles size={32} style={{ color: "#34d399", marginBottom: "1.5rem", display: "inline-block" }} />
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  fontFamily: "Outfit, sans-serif",
                  marginBottom: "1rem",
                }}
              >
                The Performance Wedge Guarantee
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: 650,
                  margin: "0 auto 2rem",
                }}
              >
                On our Growth Engine and Enterprise tiers: if we don&apos;t mathematically
                prove we saved you at least <strong style={{ color: "#34d399" }}>40 hours of manual labor</strong> in
                our Monthly Growth Payload report, your next month is{" "}
                <strong style={{ color: "#34d399" }}>completely free</strong>.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                {["No setup fees", "No long-term contracts", "Cancel anytime"].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <CheckCircle size={16} style={{ color: "#34d399" }} />
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-dark">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="FAQ"
              title="Common"
              titleHighlight="questions"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <FAQAccordion items={FAQ_ITEMS} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTABanner
        title="Ready to see the"
        titleHighlight="math for yourself?"
        subtitle="Get a free AI Bottleneck Audit with exact savings projections for your business."
        buttonText="Book Your Free Audit"
        buttonHref="/audit"
      />
    </PageLayout>
  );
}
