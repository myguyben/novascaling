"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const BACKEND_URL = "https://websol-backend.onrender.com";

const REVENUE_OPTIONS = [
  "Under $100k",
  "$100k – $250k",
  "$250k – $500k",
  "$500k – $1M",
  "$1M+",
];

export default function AuditPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    revenue: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: "novascaling",
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          service_requested: form.revenue
            ? `${form.company} | Revenue: ${form.revenue}`
            : form.company || null,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
      setStatus("error");
    }
  }

  return (
    <PageLayout>
      <section className="audit-page" style={{ paddingTop: "8rem" }}>
        <div className="audit-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>

        <div className="audit-container">
          {status === "success" ? (
            <motion.div
              className="audit-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="audit-success-icon">
                <CheckCircle size={64} />
              </div>
              <h1 className="audit-success-title">
                You&apos;re on the list.
              </h1>
              <p className="audit-success-desc">
                We&apos;ll review your submission and reach out within 24 hours with
                your custom Bottleneck Audit. Check your inbox.
              </p>
              <a href="/" className="btn btn-primary btn-lg">
                Back to Home <ArrowRight size={18} />
              </a>
            </motion.div>
          ) : (
            <div className="audit-layout">
              <motion.div
                className="audit-info"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="audit-title">
                  Get Your Free{" "}
                  <span className="text-gradient-hero">Efficiency Audit</span>
                </h1>
                <p className="audit-desc">
                  Tell us about your business and we&apos;ll show you exactly how many
                  hours and dollars you&apos;re losing to manual work — and how
                  automation can fix it.
                </p>

                <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Prefer to talk?{" "}
                  <a href="/schedule" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}>
                    Book a free call instead
                  </a>
                </p>

                <div className="audit-promises">
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>Custom report within 24 hours</span>
                  </div>
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>No contracts or commitments</span>
                  </div>
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>Exact hours & dollar savings identified</span>
                  </div>
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>Actionable roadmap you can use immediately</span>
                  </div>
                </div>
              </motion.div>

              <motion.form
                className="audit-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Work Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Acme Inc."
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="revenue">Annual Revenue Range</label>
                  <select
                    id="revenue"
                    name="revenue"
                    value={form.revenue}
                    onChange={handleChange}
                  >
                    <option value="">Select a range</option>
                    {REVENUE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    What&apos;s your biggest operational bottleneck? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="E.g., We spend 3 hours a day manually routing leads from our website to our CRM..."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                {status === "error" && (
                  <div className="form-error">{errorMsg}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={status === "sending"}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={18} className="spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Get My Free Audit — Results in 24h <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
