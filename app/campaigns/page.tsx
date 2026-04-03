"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  Mail,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "@/components/auth/AuthGate";

const BACKEND_URL = "https://api.ozioconsulting.com";

interface Campaign {
  id: string;
  name: string;
  status: string;
  from_email: string;
  from_name: string;
  created_at: string;
  stats?: { enrolled: number; replied: number };
}

interface Step {
  id?: string;
  step_number: number;
  delay_days: number;
  subject: string;
  body_html: string;
}

interface SalesLead {
  id: string;
  company_name: string;
  client_email: string | null;
  industry: string | null;
  area: string;
  status: string;
}

type View = "list" | "create" | "detail";

const DEFAULT_STEPS: Step[] = [
  {
    step_number: 1,
    delay_days: 0,
    subject: "Quick question for {{company_name}}",
    body_html: `<p>Hi there,</p>
<p>I came across {{company_name}} and noticed you're doing great work in {{industry}}.</p>
<p>Quick question — how are you currently handling lead follow-ups and scheduling? Most trades businesses we talk to are losing 3-5 jobs a month just from slow response times.</p>
<p>We build custom automation systems specifically for {{industry}} businesses that capture and respond to every lead in under 10 seconds — even nights and weekends.</p>
<p>Would it be worth a 10-minute chat to see if we could help?</p>
<p>Best,<br/>Ben @ Ozio Consulting</p>`,
  },
  {
    step_number: 2,
    delay_days: 3,
    subject: "The $15k question",
    body_html: `<p>Hi again,</p>
<p>Just following up on my last email. Here's a quick stat that might hit home:</p>
<p>The average {{industry}} business loses $3,000–$15,000/year from leads that go cold because nobody responded fast enough. That's money walking straight to competitors.</p>
<p>We recently helped a similar business recover $14,000 in their first month just by automating lead response.</p>
<p>Happy to share how it works if you're curious — no pitch, just a quick walkthrough.</p>
<p>Best,<br/>Ben @ Ozio Consulting</p>`,
  },
  {
    step_number: 3,
    delay_days: 7,
    subject: "How {{company_name}} could book 8 more jobs/month",
    body_html: `<p>Hi,</p>
<p>Last email from me on this — I know you're busy running your business.</p>
<p>Here's what we built for an HVAC company in a similar situation:</p>
<ul>
<li>Leads get an instant text response in under 10 seconds</li>
<li>Estimates get automated follow-ups until they book or say no</li>
<li>Review requests go out after every completed job</li>
</ul>
<p>Result: 8 extra jobs per month, $22,400 in recovered revenue.</p>
<p>If you'd like to see what that could look like for {{company_name}}, I'm happy to do a free 15-minute walkthrough.</p>
<p>Either way — good luck out there.</p>
<p>Best,<br/>Ben @ Ozio Consulting</p>`,
  },
];

export default function CampaignsPage() {
  const [view, setView] = useState<View>("list");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create form
  const [newName, setNewName] = useState("Trades Cold Outreach");
  const [newFromEmail, setNewFromEmail] = useState("outreach@ozioconsulting.com");
  const [newFromName, setNewFromName] = useState("Ben @ Ozio Consulting");
  const [newSteps, setNewSteps] = useState<Step[]>(DEFAULT_STEPS);
  const [creating, setCreating] = useState(false);

  // Enroll
  const [showEnroll, setShowEnroll] = useState(false);
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [enrolling, setEnrolling] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState("");

  // Auth token
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setToken(data.session?.access_token || null);
    });
  }, []);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const enriched = await Promise.all(
        data.map(async (c) => {
          const { count: enrolled } = await supabase.from("campaign_enrollments").select("*", { count: "exact", head: true }).eq("campaign_id", c.id);
          const { count: replied } = await supabase.from("campaign_enrollments").select("*", { count: "exact", head: true }).eq("campaign_id", c.id).eq("status", "replied");
          return { ...c, stats: { enrolled: enrolled || 0, replied: replied || 0 } };
        })
      );
      setCampaigns(enriched);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  async function fetchDetail(id: string) {
    setDetailLoading(true);
    setSelectedId(id);
    setView("detail");

    const { data: campaign } = await supabase.from("campaigns").select("*").eq("id", id).single();
    const { data: steps } = await supabase.from("campaign_steps").select("*").eq("campaign_id", id).order("step_number");
    const { data: enrollments } = await supabase
      .from("campaign_enrollments")
      .select("*, sales_leads(company_name, client_email), campaign_sends(id, step_id, status, sent_at)")
      .eq("campaign_id", id)
      .order("enrolled_at", { ascending: false });

    setDetail({ ...campaign, steps: steps || [], enrollments: enrollments || [] });
    setDetailLoading(false);
  }

  async function createCampaign() {
    setCreating(true);
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({ name: newName, from_email: newFromEmail, from_name: newFromName })
      .select()
      .single();

    if (error || !campaign) { setCreating(false); return; }

    const stepRows = newSteps.map((s, i) => ({
      campaign_id: campaign.id,
      step_number: i + 1,
      delay_days: s.delay_days,
      subject: s.subject,
      body_html: s.body_html,
    }));

    await supabase.from("campaign_steps").insert(stepRows);
    setCreating(false);
    setView("list");
    fetchCampaigns();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("campaigns").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    fetchCampaigns();
    if (detail?.id === id) setDetail({ ...detail, status });
  }

  async function fetchLeadsForEnroll() {
    const { data } = await supabase
      .from("sales_leads")
      .select("id, company_name, client_email, industry, area, status")
      .not("client_email", "is", null)
      .order("company_name");
    setLeads(data || []);
  }

  async function enrollSelected() {
    if (!selectedId || selectedLeads.size === 0) return;
    setEnrolling(true);

    const now = new Date();
    const rows = Array.from(selectedLeads).map((lid) => ({
      campaign_id: selectedId,
      lead_id: lid,
      current_step: 0,
      status: "active",
      next_send_at: now.toISOString(),
    }));

    await supabase.from("campaign_enrollments").upsert(rows, { onConflict: "campaign_id,lead_id" });
    setEnrolling(false);
    setShowEnroll(false);
    setSelectedLeads(new Set());
    fetchDetail(selectedId);
  }

  async function processNow() {
    try {
      await fetch(`${BACKEND_URL}/api/campaigns/process`, { method: "POST" });
      if (selectedId) fetchDetail(selectedId);
    } catch {}
  }

  const statusColor: Record<string, string> = {
    draft: "#64748b",
    active: "#d4a853",
    paused: "#f59e0b",
    completed: "#d4a853",
  };

  const filteredLeads = leads.filter((l) =>
    !leadsFilter || l.company_name.toLowerCase().includes(leadsFilter.toLowerCase()) ||
    (l.industry || "").toLowerCase().includes(leadsFilter.toLowerCase())
  );

  return (
    <AuthGate title="Email Campaigns">
      <div style={{ minHeight: "100vh", background: "var(--bg-deep)", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {view !== "list" && (
                <button onClick={() => { setView("list"); setDetail(null); }} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
                  {view === "create" ? "New Campaign" : view === "detail" ? (detail?.name || "Loading...") : "Email Campaigns"}
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {view === "list" ? `${campaigns.length} campaigns` : view === "create" ? "Set up your drip sequence" : ""}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {view === "list" && (
                <>
                  <button onClick={fetchCampaigns} style={btnGhost}><RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh</button>
                  <button onClick={() => setView("create")} style={btnPrimary}><Plus size={14} /> New Campaign</button>
                </>
              )}
              {view === "detail" && detail && (
                <>
                  {detail.status === "draft" && <button onClick={() => updateStatus(detail.id, "active")} style={btnPrimary}><Play size={14} /> Activate</button>}
                  {detail.status === "active" && <button onClick={() => updateStatus(detail.id, "paused")} style={btnGhost}><Pause size={14} /> Pause</button>}
                  {detail.status === "paused" && <button onClick={() => updateStatus(detail.id, "active")} style={btnPrimary}><Play size={14} /> Resume</button>}
                  <button onClick={() => { setShowEnroll(true); fetchLeadsForEnroll(); }} style={btnGhost}><Users size={14} /> Enroll Leads</button>
                  <button onClick={processNow} style={btnGhost}><Send size={14} /> Send Now</button>
                </>
              )}
            </div>
          </div>

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: "var(--text-secondary)", gap: "0.75rem" }}>
                <Loader2 size={20} className="spin" /> Loading...
              </div>
            ) : campaigns.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                <Mail size={40} style={{ marginBottom: "1rem", opacity: 0.4 }} />
                <p style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "1rem" }}>No campaigns yet</p>
                <button onClick={() => setView("create")} style={btnPrimary}><Plus size={14} /> Create Your First Campaign</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => fetchDetail(c.id)}
                    style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, fontSize: "1.1rem" }}>{c.name}</span>
                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: 100, fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: statusColor[c.status] || "#64748b", background: `${statusColor[c.status] || "#64748b"}15`, border: `1px solid ${statusColor[c.status] || "#64748b"}30` }}>
                          {c.status}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                        {c.stats?.enrolled || 0} enrolled &middot; {c.stats?.replied || 0} replied &middot; {c.from_email}
                      </p>
                    </div>
                    <ChevronRight size={18} style={{ color: "var(--text-tertiary)" }} />
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── CREATE VIEW ── */}
          {view === "create" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Campaign Info */}
              <div style={{ ...cardStyle }}>
                <h3 style={cardTitle}>Campaign Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Campaign Name</label>
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>From Email</label>
                    <input value={newFromEmail} onChange={(e) => setNewFromEmail(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>From Name</label>
                    <input value={newFromName} onChange={(e) => setNewFromName(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Steps */}
              {newSteps.map((step, i) => (
                <div key={i} style={{ ...cardStyle }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={cardTitle}>Step {i + 1} {i === 0 ? "(Sent immediately)" : `(${step.delay_days} days after previous)`}</h3>
                    {newSteps.length > 1 && (
                      <button onClick={() => setNewSteps(newSteps.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Subject Line</label>
                      <input
                        value={step.subject}
                        onChange={(e) => {
                          const updated = [...newSteps];
                          updated[i] = { ...updated[i], subject: e.target.value };
                          setNewSteps(updated);
                        }}
                        style={inputStyle}
                      />
                    </div>
                    {i > 0 && (
                      <div>
                        <label style={labelStyle}>Delay (days)</label>
                        <input
                          type="number"
                          min={1}
                          value={step.delay_days}
                          onChange={(e) => {
                            const updated = [...newSteps];
                            updated[i] = { ...updated[i], delay_days: Number(e.target.value) };
                            setNewSteps(updated);
                          }}
                          style={inputStyle}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Email Body (HTML)</label>
                    <textarea
                      value={step.body_html}
                      onChange={(e) => {
                        const updated = [...newSteps];
                        updated[i] = { ...updated[i], body_html: e.target.value };
                        setNewSteps(updated);
                      }}
                      rows={8}
                      style={{ ...inputStyle, minHeight: 160, fontFamily: "monospace", fontSize: "0.8rem" }}
                    />
                  </div>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
                    Merge fields: {"{{company_name}}"}, {"{{industry}}"}
                  </p>
                </div>
              ))}

              <button
                onClick={() => setNewSteps([...newSteps, { step_number: newSteps.length + 1, delay_days: 7, subject: "", body_html: "" }])}
                style={{ ...btnGhost, alignSelf: "flex-start" }}
              >
                <Plus size={14} /> Add Step
              </button>

              <button onClick={createCampaign} disabled={creating || !newName || newSteps.some((s) => !s.subject || !s.body_html)} style={{ ...btnPrimary, alignSelf: "flex-start", opacity: creating ? 0.6 : 1 }}>
                {creating ? <><Loader2 size={14} className="spin" /> Creating...</> : <><Mail size={14} /> Create Campaign</>}
              </button>
            </div>
          )}

          {/* ── DETAIL VIEW ── */}
          {view === "detail" && (
            detailLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: "var(--text-secondary)", gap: "0.75rem" }}>
                <Loader2 size={20} className="spin" /> Loading...
              </div>
            ) : detail && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Enrollment Stats */}
                <div style={{ ...cardStyle }}>
                  <h3 style={cardTitle}>Enrollment Status</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5rem" }}>
                    {[
                      { label: "Enrolled", value: detail.enrollments?.length || 0, color: "#f59e0b" },
                      { label: "Active", value: detail.enrollments?.filter((e: any) => e.status === "active").length || 0, color: "#d4a853" },
                      { label: "Completed", value: detail.enrollments?.filter((e: any) => e.status === "completed").length || 0, color: "#d4a853" },
                      { label: "Replied", value: detail.enrollments?.filter((e: any) => e.status === "replied").length || 0, color: "#f59e0b" },
                      { label: "Bounced", value: detail.enrollments?.filter((e: any) => e.status === "bounced").length || 0, color: "#ef4444" },
                      { label: "Unsubscribed", value: detail.enrollments?.filter((e: any) => e.status === "unsubscribed").length || 0, color: "#ef4444" },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: "0.75rem", borderRadius: 12, background: `${s.color}10`, border: `1px solid ${s.color}25`, textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps with delivery stats */}
                <div style={{ ...cardStyle }}>
                  <h3 style={cardTitle}>Sequence Steps — Delivery Stats</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {(detail.steps || []).map((step: any, i: number) => (
                      <div key={step.id} style={{ padding: "1rem", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f59e0b" }}>Step {step.step_number} — {step.delay_days === 0 ? "Immediate" : `Day ${step.delay_days}`}</span>
                        </div>
                        <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{step.subject}</p>
                        {step.stats && step.stats.total > 0 && (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {[
                              { label: "Sent", value: step.stats.total, color: "#64748b" },
                              { label: "Delivered", value: step.stats.delivered, color: "#d4a853" },
                              { label: "Opened", value: step.stats.opened, color: "#f59e0b" },
                              { label: "Clicked", value: step.stats.clicked, color: "#f59e0b" },
                              { label: "Bounced", value: step.stats.bounced, color: "#ef4444" },
                              { label: "Spam", value: step.stats.spam, color: "#ef4444" },
                              { label: "Dropped", value: step.stats.dropped, color: "#ef4444" },
                            ].filter((s) => s.value > 0).map((s, j) => (
                              <span key={j} style={{ padding: "0.15rem 0.5rem", borderRadius: 6, fontSize: "0.65rem", fontWeight: 600, color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                                {s.value} {s.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enrolled Leads */}
                <div style={{ ...cardStyle }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={cardTitle}>Enrolled Leads ({detail.enrollments?.length || 0})</h3>
                  </div>
                  {(detail.enrollments || []).length === 0 ? (
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>No leads enrolled yet. Click "Enroll Leads" to add contacts.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {(detail.enrollments || []).map((e: any) => {
                        const sends = (e.campaign_sends || []).sort((a: any, b: any) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
                        const deliveryColors: Record<string, string> = {
                          sent: "#64748b", delivered: "#d4a853", opened: "#f59e0b", clicked: "#f59e0b",
                          bounced: "#ef4444", spam: "#ef4444", dropped: "#ef4444", deferred: "#64748b",
                          unsubscribed: "#ef4444", group_unsubscribe: "#ef4444",
                        };
                        return (
                          <div key={e.id} style={{ padding: "0.75rem", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sends.length > 0 ? "0.5rem" : 0 }}>
                              <div style={{ fontSize: "0.85rem" }}>
                                <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{e.sales_leads?.company_name || "Unknown"}</span>
                                <span style={{ color: "var(--text-secondary)", marginLeft: "0.75rem" }}>{e.sales_leads?.client_email}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>Step {e.current_step}/{detail.steps?.length || 0}</span>
                                <span style={{ padding: "0.15rem 0.5rem", borderRadius: 100, fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase", color: statusColor[e.status] || "#64748b", background: `${statusColor[e.status] || "#64748b"}15`, border: `1px solid ${statusColor[e.status] || "#64748b"}30` }}>
                                  {e.status}
                                </span>
                              </div>
                            </div>
                            {sends.length > 0 && (
                              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                {sends.map((s: any, si: number) => {
                                  const stepNum = detail.steps?.findIndex((st: any) => st.id === s.step_id) + 1 || "?";
                                  const color = deliveryColors[s.status] || "#64748b";
                                  return (
                                    <span key={s.id} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.15rem 0.45rem", borderRadius: 6, fontSize: "0.6rem", fontWeight: 600, color, background: `${color}12`, border: `1px solid ${color}25` }}>
                                      S{stepNum}: {s.status}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* ── ENROLL MODAL ── */}
          <AnimatePresence>
            {showEnroll && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "2rem" }}
                onClick={() => setShowEnroll(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: "100%", maxWidth: 600, maxHeight: "80vh", overflow: "auto", background: "var(--bg-surface)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "2rem" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", fontWeight: 700 }}>Enroll Leads</h2>
                    <button onClick={() => setShowEnroll(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}><X size={20} /></button>
                  </div>

                  <input
                    placeholder="Filter by company or industry..."
                    value={leadsFilter}
                    onChange={(e) => setLeadsFilter(e.target.value)}
                    style={{ ...inputStyle, marginBottom: "1rem" }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{selectedLeads.size} selected of {filteredLeads.length} leads with email</span>
                    <button
                      onClick={() => {
                        if (selectedLeads.size === filteredLeads.length) setSelectedLeads(new Set());
                        else setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
                      }}
                      style={{ ...btnGhost, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                    >
                      {selectedLeads.size === filteredLeads.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: 300, overflowY: "auto", marginBottom: "1.5rem" }}>
                    {filteredLeads.map((l) => (
                      <label key={l.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0.6rem", borderRadius: 8, background: selectedLeads.has(l.id) ? "rgba(245,158,11,0.06)" : "transparent", cursor: "pointer", fontSize: "0.85rem" }}>
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(l.id)}
                          onChange={() => {
                            const next = new Set(selectedLeads);
                            if (next.has(l.id)) next.delete(l.id); else next.add(l.id);
                            setSelectedLeads(next);
                          }}
                          style={{ accentColor: "#f59e0b" }}
                        />
                        <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{l.company_name}</span>
                        <span style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>{l.client_email}</span>
                      </label>
                    ))}
                  </div>

                  <button onClick={enrollSelected} disabled={enrolling || selectedLeads.size === 0} style={{ ...btnPrimary, width: "100%", justifyContent: "center", opacity: enrolling || selectedLeads.size === 0 ? 0.5 : 1 }}>
                    {enrolling ? <><Loader2 size={14} className="spin" /> Enrolling...</> : <><Users size={14} /> Enroll {selectedLeads.size} Leads</>}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <style jsx global>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </AuthGate>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const cardTitle: React.CSSProperties = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--text-secondary)",
  fontWeight: 600,
  marginBottom: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
  marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text-primary)",
  fontSize: "0.85rem",
  fontFamily: "Inter, sans-serif",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 1rem",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #f59e0b, #ea580c)",
  color: "#000",
  fontWeight: 700,
  fontSize: "0.8rem",
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 1rem",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.06)",
  color: "var(--text-secondary)",
  fontWeight: 500,
  fontSize: "0.8rem",
  cursor: "pointer",
};
