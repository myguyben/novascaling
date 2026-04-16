"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AuthGate } from "@/components/auth/AuthGate";
import Papa from "papaparse";
import {
  Search,
  Upload,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Star,
  LogOut,
  X,
  Users,
  PhoneCall,
  Trophy,
  FileSpreadsheet,
  Flame,
  Mail,
  MessageSquareReply,
  Send,
  Bell,
  ChevronDown,
  ChevronUp,
  UserPlus,
  MessageSquare,
  Loader2,
  History,
  AlertTriangle,
} from "lucide-react";

/* ── Types ── */
interface SalesLead {
  id: string;
  company_name: string;
  contact_name: string | null;
  phone: string | null;
  address: string | null;
  area: string;
  area_label: string | null;
  rating: number | null;
  review_count: number;
  status: string;
  contacted: boolean;
  hot: boolean;
  notes: string | null;
  industry: string | null;
  list_name: string | null;
  client_email: string | null;
  initial_message_id: string | null;
  hot_email_sent_at: string | null;
  follow_up_count: number;
  last_follow_up_at: string | null;
  responded: boolean;
  reply_text: string | null;
  reply_from: string | null;
  reply_subject: string | null;
  replied_at: string | null;
  sms_sent_at: string | null;
  sms_follow_up_count: number;
  last_sms_at: string | null;
  hot_sequence_step: number;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  sent:        { bg: "rgba(59,130,246,0.1)",  text: "#3b82f6" },
  queued:      { bg: "rgba(148,163,184,0.1)", text: "#94a3b8" },
  deferred:    { bg: "rgba(245,158,11,0.1)",  text: "#f59e0b" },
  delivered:   { bg: "rgba(34,197,94,0.1)",   text: "#22c55e" },
  opened:      { bg: "rgba(168,85,247,0.1)",  text: "#a855f7" },
  clicked:     { bg: "rgba(236,72,153,0.1)",  text: "#ec4899" },
  bounced:     { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  failed:      { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  undelivered: { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  dropped:     { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  spam:        { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  unsubscribed:       { bg: "rgba(251,146,60,0.1)",  text: "#fb923c" },
  group_unsubscribe:  { bg: "rgba(251,146,60,0.1)",  text: "#fb923c" },
};

function statusColor(status: string) {
  return STATUS_COLORS[status] || { bg: "rgba(148,163,184,0.1)", text: "#94a3b8" };
}

const FAILED_STATUSES = ["bounced", "failed", "undelivered", "dropped", "spam", "group_unsubscribe"];

interface FailedSends {
  emails: number;
  sms: number;
}

const AREA_OPTIONS = [
  { value: "nv", label: "North Van" },
  { value: "van", label: "Vancouver" },
  { value: "sa", label: "Service Area" },
  { value: "other", label: "Other" },
];

const AREA_COLORS: Record<string, { bg: string; text: string }> = {
  nv: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  van: { bg: "rgba(234,88,12,0.15)", text: "#ea580c" },
  sa: { bg: "rgba(251,191,36,0.12)", text: "#f59e0b" },
  other: { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
};

/* Auth gate removed — now using shared AuthGate component from @/components/auth/AuthGate */

/* ══════════════════════════════════════════════
   CSV UPLOAD MODAL
   ══════════════════════════════════════════════ */
function CSVUploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (leads: Partial<SalesLead>[]) => void }) {
  const [parsed, setParsed] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState("");
  const [listName, setListName] = useState("");
  const [industry, setIndustry] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const TARGET_FIELDS = [
    { key: "company_name", label: "Company Name", required: true },
    { key: "contact_name", label: "Contact Name" },
    { key: "client_email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "area", label: "Area (nv/van/sa/other)" },
    { key: "area_label", label: "Area Label" },
    { key: "rating", label: "Rating" },
    { key: "review_count", label: "Review Count" },
    { key: "notes", label: "Notes" },
  ];

  function handleFile(file: File) {
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data as Record<string, string>[];
        setParsed(data);
        const csvCols = Object.keys(data[0] || {});
        const autoMap: Record<string, string> = {};
        TARGET_FIELDS.forEach((f) => {
          const match = csvCols.find((c) => c.toLowerCase().replace(/[_\s]/g, "") === f.key.toLowerCase().replace(/[_\s]/g, ""));
          if (match) autoMap[f.key] = match;
        });
        setMapping(autoMap);
      },
    });
  }

  function doUpload() {
    const leads = parsed.map((row) => {
      const lead: Record<string, unknown> = {};
      Object.entries(mapping).forEach(([target, source]) => {
        if (source && row[source] !== undefined) {
          if (target === "rating") lead[target] = parseFloat(row[source]) || null;
          else if (target === "review_count") lead[target] = parseInt(row[source]) || 0;
          else lead[target] = row[source] || null;
        }
      });
      if (listName) lead.list_name = listName;
      if (industry) lead.industry = industry;
      if (!lead.area) lead.area = "other";
      lead.status = "new";
      return lead as Partial<SalesLead>;
    });
    onUpload(leads.filter((l) => l.company_name));
  }

  const csvCols = Object.keys(parsed[0] || {});
  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>
            <FileSpreadsheet size={20} className="inline mr-2" style={{ color: "var(--accent)" }} />Upload Leads CSV
          </h2>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>
        {parsed.length === 0 ? (
          <div onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl cursor-pointer" style={{ border: "2px dashed rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.03)" }}>
            <Upload size={32} style={{ color: "var(--accent)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Drop CSV here or click to browse</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{fileName} — {parsed.length} rows</p>
            <div className="flex gap-3 mb-4">
              <input type="text" placeholder="List name (e.g. Landscaping - March 2026)" value={listName} onChange={(e) => setListName(e.target.value)} className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
              <input type="text" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-32 px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {TARGET_FIELDS.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <span className="text-xs w-32 shrink-0" style={{ color: "var(--text-secondary)" }}>{field.label}{field.required ? " *" : ""}</span>
                  <select value={mapping[field.key] || ""} onChange={(e) => setMapping((m) => ({ ...m, [field.key]: e.target.value }))} className="flex-1 px-3 py-2 rounded-xl text-sm outline-none cursor-pointer" style={inputStyle}>
                    <option value="">— skip —</option>
                    {csvCols.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setParsed([]); setMapping({}); setFileName(""); }} className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>Reset</button>
              <button onClick={doUpload} disabled={!mapping.company_name} className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer" style={{ background: mapping.company_name ? "linear-gradient(135deg, #f59e0b, #ea580c)" : "rgba(255,255,255,0.05)", color: mapping.company_name ? "#000" : "var(--text-tertiary)" }}>Import {parsed.length} Leads</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD LEAD MODAL
   ══════════════════════════════════════════════ */
function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Partial<SalesLead>) => void }) {
  const [form, setForm] = useState({ company_name: "", contact_name: "", phone: "", address: "", area: "other", area_label: "", rating: "", review_count: "", industry: "", notes: "", client_email: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      company_name: form.company_name,
      contact_name: form.contact_name || null,
      phone: form.phone || null,
      address: form.address || null,
      area: form.area,
      area_label: form.area_label || AREA_OPTIONS.find((a) => a.value === form.area)?.label || null,
      rating: form.rating ? parseFloat(form.rating) : null,
      review_count: form.review_count ? parseInt(form.review_count) : 0,
      industry: form.industry || null,
      notes: form.notes || null,
      client_email: form.client_email || null,
      status: "new",
    });
  }

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md p-6 rounded-3xl" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>Add Lead</h2>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input required placeholder="Company Name *" value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input placeholder="Contact Name (e.g. Dave Smith)" value={form.contact_name} onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <div className="flex gap-3">
            <select value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl text-sm outline-none cursor-pointer" style={inputStyle}>
              {AREA_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <input placeholder="Area label" value={form.area_label} onChange={(e) => setForm((f) => ({ ...f, area_label: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>
          <div className="flex gap-3">
            <input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
            <input type="number" min="0" placeholder="Reviews" value={form.review_count} onChange={(e) => setForm((f) => ({ ...f, review_count: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>
          <input type="email" placeholder="Lead's Email (for outreach)" value={form.client_email} onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input placeholder="Industry" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <button type="submit" className="mt-2 py-3 rounded-xl font-bold text-sm cursor-pointer" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", color: "#000" }}>Add Lead</button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-[slideIn_0.3s_ease-out]" style={{ background: "linear-gradient(135deg, #d4a853, #f59e0b)", color: "#000", boxShadow: "0 8px 30px rgba(212,168,83,0.3)" }}>
      <Trophy size={16} />{message}
    </div>
  );
}

/* ══════════════════════════════════════════════
   REPLY MODAL
   ══════════════════════════════════════════════ */
function ReplyModal({ lead, onClose }: { lead: SalesLead; onClose: () => void }) {
  const repliedDate = lead.replied_at ? new Date(lead.replied_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-6" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>
              Reply from {lead.company_name}
            </h2>
            {repliedDate && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{repliedDate}</p>}
          </div>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>

        {lead.reply_from && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>From</span>
            <p className="text-sm mt-0.5" style={{ color: "var(--accent)" }}>{lead.reply_from}</p>
          </div>
        )}

        {lead.reply_subject && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Subject</span>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{lead.reply_subject}</p>
          </div>
        )}

        <div className="mt-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Message</span>
          <p className="text-sm mt-2 whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {lead.reply_text || "No message content captured."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   OUTREACH HISTORY MODAL
   ══════════════════════════════════════════════ */
interface EmailSend {
  id: string;
  lead_id: string;
  to_email: string;
  subject: string | null;
  body_text: string | null;
  status: string;
  sent_at: string;
}
interface SmsSend {
  id: string;
  lead_id: string;
  phone: string;
  message: string;
  status: string;
  sent_at: string;
}

interface SequenceSend {
  id: string;
  step_number: number;
  channel: string;
  status: string;
  scheduled_for: string;
  sent_at: string | null;
}

function OutreachModal({ lead, onClose }: { lead: SalesLead; onClose: () => void }) {
  const [emails, setEmails] = useState<(EmailSend & { source?: string })[]>([]);
  const [sms, setSms] = useState<SmsSend[]>([]);
  const [sequenceSteps, setSequenceSteps] = useState<SequenceSend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: directEmails }, { data: smsData }, { data: enrollments }, { data: seqSteps }] = await Promise.all([
          supabase.from("email_sends").select("*").eq("lead_id", lead.id).order("sent_at", { ascending: false }),
          supabase.from("sms_sends").select("*").eq("lead_id", lead.id).order("sent_at", { ascending: false }),
          supabase.from("campaign_enrollments").select("id, campaign_id").eq("lead_id", lead.id),
          supabase.from("hot_sequence_sends").select("*").eq("lead_id", lead.id).order("step_number"),
        ]);

        if (seqSteps) setSequenceSteps(seqSteps);

        // Fetch campaign sends for this lead
        let campaignEmails: (EmailSend & { source: string })[] = [];
        if (enrollments && enrollments.length > 0) {
          const enrollmentIds = enrollments.map((e) => e.id);
          const { data: cSends } = await supabase.from("campaign_sends").select("id, enrollment_id, step_id, status, sent_at").in("enrollment_id", enrollmentIds).order("sent_at", { ascending: false });
          if (cSends && cSends.length > 0) {
            const stepIds = [...new Set(cSends.map((s) => s.step_id))];
            const { data: steps } = await supabase.from("campaign_steps").select("id, subject, body_html").in("id", stepIds);
            const stepsMap = new Map((steps || []).map((s) => [s.id, s]));
            campaignEmails = cSends.map((s) => {
              const step = stepsMap.get(s.step_id);
              return {
                id: s.id,
                lead_id: lead.id,
                to_email: lead.client_email || "",
                subject: step?.subject || "Campaign Email",
                body_text: step?.body_html ? step.body_html.replace(/<[^>]*>/g, "") : null,
                status: s.status,
                sent_at: s.sent_at,
                source: "campaign",
              };
            });
          }
        }

        const allEmails = [
          ...(directEmails || []).map((e) => ({ ...e, source: "direct" })),
          ...campaignEmails,
        ].sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

        setEmails(allEmails);
        setSms(smsData || []);
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, [lead.id, lead.client_email]);

  const allItems = [
    ...emails.map((e) => ({ type: "email" as const, date: e.sent_at, ...e })),
    ...sms.map((s) => ({ type: "sms" as const, date: s.sent_at, ...s })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const seqStatusColor: Record<string, { bg: string; color: string }> = {
    sent: { bg: "#22c55e", color: "#fff" },
    scheduled: { bg: "#f59e0b", color: "#000" },
    failed: { bg: "#ef4444", color: "#fff" },
    cancelled: { bg: "#64748b", color: "#fff" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-6" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>
              Outreach History — {lead.company_name}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{allItems.length} messages sent</p>
          </div>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>

        {/* Sequence timeline */}
        {sequenceSteps.length > 0 && (
          <div className="mb-4 p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={13} style={{ color: "#ef4444" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#ef4444" }}>Hot Sequence</span>
            </div>
            <div className="flex items-center gap-1">
              {sequenceSteps.map((step, i) => {
                const sc = seqStatusColor[step.status] || seqStatusColor.cancelled;
                return (
                  <div key={step.id} className="flex items-center gap-1">
                    <div title={`Step ${step.step_number} (${step.channel}) — ${step.status}${step.status === "scheduled" ? ` for ${new Date(step.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}`} className="flex items-center justify-center rounded-full text-[9px] font-bold cursor-default" style={{ width: 24, height: 24, background: sc.bg, color: sc.color }}>
                      {step.channel === "email" ? "E" : "S"}{step.step_number}
                    </div>
                    {i < sequenceSteps.length - 1 && <div style={{ width: 12, height: 1, background: "rgba(255,255,255,0.1)" }} />}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-2">
              {[{ label: "Sent", color: "#22c55e" }, { label: "Scheduled", color: "#f59e0b" }, { label: "Failed", color: "#ef4444" }, { label: "Cancelled", color: "#64748b" }].map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reply section */}
        {lead.responded && lead.reply_text && (
          <div className="mb-4 p-4 rounded-2xl" style={{ background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareReply size={13} style={{ color: "#d4a853" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#d4a853" }}>Reply Received</span>
              {lead.replied_at && <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{new Date(lead.replied_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>}
            </div>
            {lead.reply_from && <p className="text-xs mb-1" style={{ color: "var(--accent)" }}>{lead.reply_from}</p>}
            {lead.reply_subject && <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{lead.reply_subject}</p>}
            <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{lead.reply_text}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : allItems.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: "var(--text-tertiary)" }}>No outreach sent yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {allItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 mb-2">
                  {item.type === "email" ? (
                    <Mail size={13} style={{ color: "#f59e0b" }} />
                  ) : (
                    <MessageSquare size={13} style={{ color: "#22c55e" }} />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.type === "email" ? "#f59e0b" : "#22c55e" }}>
                    {item.type === "email" ? "Email" : "SMS"}
                  </span>
                  {"source" in item && item.source === "campaign" && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa" }}>campaign</span>}
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: statusColor(item.status).bg, color: statusColor(item.status).text }}>{item.status}</span>
                </div>
                {item.type === "email" && (
                  <>
                    <p className="text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>To: {(item as EmailSend & { type: "email" }).to_email}</p>
                    {(item as EmailSend & { type: "email" }).subject && (
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{(item as EmailSend & { type: "email" }).subject}</p>
                    )}
                    <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{(item as EmailSend & { type: "email" }).body_text}</p>
                  </>
                )}
                {item.type === "sms" && (
                  <>
                    <p className="text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>To: {(item as SmsSend & { type: "sms" }).phone}</p>
                    <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{(item as SmsSend & { type: "sms" }).message}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ALL EMAILS MODAL
   ══════════════════════════════════════════════ */
function AllEmailsModal({ leads, onClose }: { leads: SalesLead[]; onClose: () => void }) {
  const [emails, setEmails] = useState<(EmailSend & { source?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    (async () => {
      // Fetch direct emails
      const { data: directEmails } = await supabase.from("email_sends").select("*").order("sent_at", { ascending: false });

      // Fetch campaign emails: enrollments → sends → steps
      let campaignEmails: (EmailSend & { source: string })[] = [];
      const { data: enrollments } = await supabase.from("campaign_enrollments").select("id, lead_id, campaign_id");
      if (enrollments && enrollments.length > 0) {
        const enrollmentIds = enrollments.map((e) => e.id);
        const { data: cSends } = await supabase.from("campaign_sends").select("id, enrollment_id, step_id, status, sent_at").in("enrollment_id", enrollmentIds).order("sent_at", { ascending: false });
        if (cSends && cSends.length > 0) {
          const stepIds = [...new Set(cSends.map((s) => s.step_id))];
          const { data: steps } = await supabase.from("campaign_steps").select("id, subject, body_html").in("id", stepIds);
          const stepsMap = new Map((steps || []).map((s) => [s.id, s]));
          const enrollMap = new Map(enrollments.map((e) => [e.id, e]));

          campaignEmails = cSends.map((s) => {
            const step = stepsMap.get(s.step_id);
            const enrollment = enrollMap.get(s.enrollment_id);
            const lead = leads.find((l) => l.id === enrollment?.lead_id);
            return {
              id: s.id,
              lead_id: enrollment?.lead_id || "",
              to_email: lead?.client_email || "",
              subject: step?.subject || "Campaign Email",
              body_text: step?.body_html ? step.body_html.replace(/<[^>]*>/g, "") : null,
              status: s.status,
              sent_at: s.sent_at,
              source: "campaign",
            };
          });
        }
      }

      const all = [
        ...(directEmails || []).map((e) => ({ ...e, source: "direct" })),
        ...campaignEmails,
      ].sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
      setEmails(all);
      setLoading(false);
    })();
  }, [leads]);

  const leadsMap = new Map(leads.map((l) => [l.id, l.company_name]));
  const q = searchQ.toLowerCase();
  const filtered = emails.filter((e) => {
    if (!q) return true;
    const company = leadsMap.get(e.lead_id) || "";
    return company.toLowerCase().includes(q) || (e.to_email || "").toLowerCase().includes(q) || (e.subject || "").toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>
              <Mail size={18} className="inline mr-2" style={{ color: "#f59e0b" }} />All Emails Sent
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{emails.length} total emails</p>
          </div>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>

        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search by company, email, subject..." className="w-full pl-8 pr-4 py-2 rounded-xl text-xs outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: "var(--text-tertiary)" }}>No emails found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((email) => (
              <div key={email.id} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Mail size={13} style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--text-primary)", fontFamily: "Cormorant Garamond, serif" }}>
                    {leadsMap.get(email.lead_id) || "Unknown Lead"}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(email.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                  {email.source === "campaign" && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa" }}>campaign</span>}
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: statusColor(email.status).bg, color: statusColor(email.status).text }}>{email.status}</span>
                </div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>To: {email.to_email}</p>
                {email.subject && <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{email.subject}</p>}
                {email.body_text && <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{email.body_text}</p>}
              </div>
            ))}
            <p className="text-center text-[10px] mt-2" style={{ color: "var(--text-tertiary)" }}>Showing {filtered.length} of {emails.length} emails</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ALL SMS MODAL
   ══════════════════════════════════════════════ */
function AllSmsModal({ leads, onClose }: { leads: SalesLead[]; onClose: () => void }) {
  const [messages, setMessages] = useState<SmsSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("sms_sends").select("*").order("sent_at", { ascending: false });
      if (data) setMessages(data);
      setLoading(false);
    })();
  }, []);

  const leadsMap = new Map(leads.map((l) => [l.id, l.company_name]));
  const q = searchQ.toLowerCase();
  const filtered = messages.filter((m) => {
    if (!q) return true;
    const company = leadsMap.get(m.lead_id) || "";
    return company.toLowerCase().includes(q) || (m.phone || "").includes(q) || (m.message || "").toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>
              <MessageSquare size={18} className="inline mr-2" style={{ color: "#22c55e" }} />All SMS Sent
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{messages.length} total messages</p>
          </div>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>

        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search by company, phone, message..." className="w-full pl-8 pr-4 py-2 rounded-xl text-xs outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: "var(--text-tertiary)" }}>No SMS messages found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <MessageSquare size={13} style={{ color: "#22c55e" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--text-primary)", fontFamily: "Cormorant Garamond, serif" }}>
                    {leadsMap.get(msg.lead_id) || "Unknown Lead"}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(msg.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: statusColor(msg.status).bg, color: statusColor(msg.status).text }}>{msg.status}</span>
                </div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>To: {msg.phone}</p>
                <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{msg.message}</p>
              </div>
            ))}
            <p className="text-center text-[10px] mt-2" style={{ color: "var(--text-tertiary)" }}>Showing {filtered.length} of {messages.length} messages</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HOT SEQUENCE SETTINGS MODAL
   ══════════════════════════════════════════════ */
interface SequenceTemplate {
  id: string;
  step_number: number;
  channel: "email" | "sms";
  delay_days: number;
  subject: string | null;
  body_text: string;
  body_html: string | null;
}

function HotSequenceModal({ onClose }: { onClose: () => void }) {
  const [templates, setTemplates] = useState<SequenceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch("https://api.ozioconsulting.com/api/hot-sequence/templates", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (data.templates) setTemplates(data.templates);
      setLoading(false);
    })();
  }, []);

  function updateTemplate(stepNumber: number, field: string, value: string | number) {
    setTemplates((prev) =>
      prev.map((t) => (t.step_number === stepNumber ? { ...t, [field]: value } : t))
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    // Auto-generate body_html from body_text for email steps
    const payload = templates.map((t) => ({
      ...t,
      body_html: t.channel === "email"
        ? t.body_text.split("\n").map((line: string) => line.trim() === "" ? "" : `<p>${line}</p>`).join("\n")
        : null,
    }));
    const res = await fetch("https://api.ozioconsulting.com/api/hot-sequence/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ templates: payload }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) setSaved(true);
  }

  function insertMergeField(stepNumber: number, field: string) {
    setTemplates((prev) =>
      prev.map((t) => (t.step_number === stepNumber ? { ...t, body_text: t.body_text + field } : t))
    );
  }

  const channelLabels: Record<string, { icon: string; label: string; color: string }> = {
    email: { icon: "mail", label: "Email", color: "#f59e0b" },
    sms: { icon: "sms", label: "SMS", color: "#22c55e" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text-primary)" }}>
              <Flame size={18} className="inline mr-2" style={{ color: "#ef4444" }} />Hot Lead Sequence
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>3 emails + 2 texts — sent automatically when a lead is marked hot</p>
          </div>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {templates.map((tmpl) => {
              const ch = channelLabels[tmpl.channel];
              return (
                <div key={tmpl.step_number} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>{tmpl.step_number}</span>
                    {tmpl.channel === "email" ? <Mail size={14} style={{ color: ch.color }} /> : <MessageSquare size={14} style={{ color: ch.color }} />}
                    <span className="text-xs font-bold" style={{ color: ch.color }}>{ch.label}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Delay:</span>
                      <input
                        type="number"
                        min={0}
                        value={tmpl.delay_days}
                        onChange={(e) => updateTemplate(tmpl.step_number, "delay_days", parseInt(e.target.value) || 0)}
                        className="w-14 px-2 py-1 rounded-lg text-xs text-center outline-none"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}
                      />
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>days</span>
                    </div>
                  </div>

                  {tmpl.channel === "email" && (
                    <input
                      type="text"
                      value={tmpl.subject || ""}
                      onChange={(e) => updateTemplate(tmpl.step_number, "subject", e.target.value)}
                      placeholder="Subject line..."
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none mb-2"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}
                    />
                  )}

                  <textarea
                    value={tmpl.body_text}
                    onChange={(e) => updateTemplate(tmpl.step_number, "body_text", e.target.value)}
                    rows={tmpl.channel === "sms" ? 3 : 5}
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-vertical"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Insert:</span>
                    {["{{company_name}}", "{{contact_name}}", "{{industry}}"].map((field) => (
                      <button
                        key={field}
                        onClick={() => insertMergeField(tmpl.step_number, field)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer border-none"
                        style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
                      >
                        {field}
                      </button>
                    ))}
                    {tmpl.channel === "sms" && (
                      <span className="ml-auto text-[10px]" style={{ color: "var(--text-tertiary)" }}>{tmpl.body_text.length}/160 chars</span>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer border-none transition-all"
              style={{
                background: saved ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #f59e0b, #ea580c)",
                color: saved ? "#22c55e" : "#000",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Saving..." : saved ? "Saved" : "Save Sequence Templates"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LEAD ROW — Full width, checkbox-driven
   ══════════════════════════════════════════════ */
function LeadRow({
  lead,
  onUpdate,
  onLocalUpdate,
  onDelete,
  onSmsClick,
  onHotOutreach,
  onMarkResponded,
  hotSending,
  failedSends,
}: {
  lead: SalesLead;
  onUpdate: (id: string, data: Partial<SalesLead>) => void;
  onLocalUpdate: (id: string, data: Partial<SalesLead>) => void;
  onDelete: (id: string) => void;
  onSmsClick: (lead: SalesLead) => void;
  onHotOutreach: (lead: SalesLead) => void;
  onMarkResponded: (lead: SalesLead) => void;
  hotSending: string | null;
  failedSends?: FailedSends;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [email, setEmail] = useState(lead.client_email || "");
  const [contactName, setContactName] = useState(lead.contact_name || "");
  const [showReply, setShowReply] = useState(false);
  const [showOutreach, setShowOutreach] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handleAction(key: string, fn: () => Promise<void> | void) {
    if (actionLoading) return;
    setActionLoading(key);
    try { await fn(); } finally { setActionLoading(null); }
  }
  const notesTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const emailTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const contactNameTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const areaColor = AREA_COLORS[lead.area] || AREA_COLORS.other;

  function handleNotesChange(value: string) {
    setNotes(value);
    if (notesTimeout.current) clearTimeout(notesTimeout.current);
    notesTimeout.current = setTimeout(() => onUpdate(lead.id, { notes: value }), 800);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailTimeout.current) clearTimeout(emailTimeout.current);
    emailTimeout.current = setTimeout(() => onUpdate(lead.id, { client_email: value || null }), 800);
  }

  function handleContactNameChange(value: string) {
    setContactName(value);
    if (contactNameTimeout.current) clearTimeout(contactNameTimeout.current);
    contactNameTimeout.current = setTimeout(() => onUpdate(lead.id, { contact_name: value || null }), 800);
  }

  useEffect(() => { setNotes(lead.notes || ""); }, [lead.notes]);
  useEffect(() => { setEmail(lead.client_email || ""); }, [lead.client_email]);
  useEffect(() => { setContactName(lead.contact_name || ""); }, [lead.contact_name]);

  const contacted = lead.contacted;
  const hot = lead.hot;
  const isClient = lead.status === "client";

  return (
    <div
      className="w-full rounded-2xl p-4 md:p-5 transition-all duration-200"
      style={{
        background: isClient
          ? "rgba(212,168,83,0.04)"
          : hot
          ? "rgba(239,68,68,0.04)"
          : "rgba(255,255,255,0.02)",
        border: isClient
          ? "1px solid rgba(212,168,83,0.15)"
          : hot
          ? "1px solid rgba(239,68,68,0.12)"
          : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {showReply && <ReplyModal lead={lead} onClose={() => setShowReply(false)} />}
      {showOutreach && <OutreachModal lead={lead} onClose={() => setShowOutreach(false)} />}

      {/* Mobile: stacked. Desktop: single row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

        {/* Contacted checkbox */}
        <button
          onClick={() => handleAction("contacted", () => onUpdate(lead.id, { contacted: !contacted }))}
          disabled={!!actionLoading}
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none self-start md:self-center"
          style={{
            background: contacted ? "linear-gradient(135deg, #f59e0b, #ea580c)" : "rgba(255,255,255,0.06)",
            border: contacted ? "none" : "2px solid rgba(255,255,255,0.15)",
            opacity: actionLoading === "contacted" ? 0.5 : 1,
          }}
          title={contacted ? "Mark as not contacted" : "Mark as contacted"}
        >
          {actionLoading === "contacted" ? <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-tertiary)" }} /> : contacted && <span style={{ color: "#000", fontSize: "14px", fontWeight: 800, lineHeight: 1 }}>&#10003;</span>}
        </button>

        {/* Company name + area badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-[15px] font-bold leading-tight truncate"
              style={{
                color: contacted ? "var(--text-secondary)" : "var(--text-primary)",
                fontFamily: "Cormorant Garamond, serif",
                textDecoration: contacted ? "line-through" : "none",
                opacity: contacted && !hot ? 0.6 : 1,
              }}
            >
              {lead.company_name}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ background: areaColor.bg, color: areaColor.text }}>
              {lead.area_label || AREA_OPTIONS.find((a) => a.value === lead.area)?.label || lead.area}
            </span>
            {isClient && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ background: "rgba(212,168,83,0.15)", color: "#d4a853" }}>
                Client
              </span>
            )}
            {failedSends && (failedSends.emails > 0 || failedSends.sms > 0) && (
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
                title={[
                  failedSends.emails > 0 ? `${failedSends.emails} email${failedSends.emails > 1 ? "s" : ""} failed` : "",
                  failedSends.sms > 0 ? `${failedSends.sms} SMS failed` : "",
                ].filter(Boolean).join(", ")}
              >
                <AlertTriangle size={10} />
                {[
                  failedSends.emails > 0 ? `${failedSends.emails} email${failedSends.emails > 1 ? "s" : ""}` : "",
                  failedSends.sms > 0 ? `${failedSends.sms} SMS` : "",
                ].filter(Boolean).join(" + ")} failed
              </span>
            )}
          </div>

          {lead.contact_name && (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
              {lead.contact_name}
            </div>
          )}

          {/* Phone + address + rating — single line on desktop */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {lead.phone ? (
              <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: "var(--accent)" }}>
                <Phone size={12} />{lead.phone}
              </a>
            ) : (
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>No phone</span>
            )}
            {lead.address && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <MapPin size={10} />{lead.address}
              </span>
            )}
            {lead.rating !== null && lead.rating !== undefined && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                <Star size={10} fill="#f59e0b" color="#f59e0b" />{lead.rating} ({lead.review_count})
              </span>
            )}
            {lead.updated_at && lead.updated_at !== lead.created_at && (
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                Updated {new Date(lead.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        {/* Email + Notes inputs */}
        <div className="flex flex-col gap-1.5 w-full md:w-56 lg:w-72 shrink-0">
          <div className="relative">
            <Mail size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Lead's email..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg text-xs outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)", color: email ? "var(--accent)" : "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <input
            type="text"
            value={contactName}
            onChange={(e) => handleContactNameChange(e.target.value)}
            placeholder="Contact name..."
            className="w-full px-3 py-1.5 rounded-lg text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Notes..."
            className="w-full px-3 py-1.5 rounded-lg text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}
          />
        </div>

        {/* Action buttons + follow-up status */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Hot lead toggle */}
          <button
            onClick={async () => {
              if (hotSending) return;
              if (hot) {
                if (window.confirm("Un-hot this lead? This cancels any scheduled follow-ups. Re-hotting will restart the sequence.")) {
                  handleAction("hot", async () => {
                    const token = (await supabase.auth.getSession()).data.session?.access_token;
                    const res = await fetch(`https://api.ozioconsulting.com/api/leads/${lead.id}/unhot`, {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                      onLocalUpdate(lead.id, { hot: false, hot_email_sent_at: null, hot_sequence_step: 0 });
                    }
                  });
                }
              } else {
                onHotOutreach(lead);
              }
            }}
            disabled={!!hotSending || !!actionLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{
              background: hot ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
              color: hot ? "#ef4444" : "var(--text-tertiary)",
              opacity: hotSending === lead.id ? 0.5 : 1,
            }}
            title={hot ? "Unmark as hot lead" : "Mark as hot lead (sends email + SMS)"}
          >
            {hotSending === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} fill={hot ? "#ef4444" : "none"} />}
            <span className="hidden sm:inline">{hotSending === lead.id ? "Sending..." : "Hot"}</span>
          </button>

          {/* Outreach history */}
          <button
            onClick={() => setShowOutreach(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{ background: "rgba(245,158,11,0.08)", color: "var(--accent)" }}
            title="View outreach history (emails + texts sent)"
          >
            <History size={14} />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Responded toggle / view reply */}
          {hot && lead.hot_email_sent_at && (
            lead.responded ? (
              <button
                onClick={() => setShowReply(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
                style={{ background: "rgba(212,168,83,0.15)", color: "#d4a853" }}
                title="Click to view reply"
              >
                <MessageSquareReply size={14} />
                <span className="hidden sm:inline">Replied</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction("responded", () => onMarkResponded(lead))}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-tertiary)", opacity: actionLoading === "responded" ? 0.5 : 1 }}
                title="Mark as responded (stops follow-ups)"
              >
                {actionLoading === "responded" ? <Loader2 size={14} className="animate-spin" /> : <MessageSquareReply size={14} />}
                <span className="hidden sm:inline">No Reply</span>
              </button>
            )
          )}

          {/* Sequence progress indicator */}
          {hot && lead.hot_email_sent_at && (
            <span className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold" style={{
              background: lead.responded ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
              color: lead.responded ? "#22c55e" : "var(--accent)",
            }}>
              <Send size={10} />
              {lead.responded ? "Replied" : `${lead.hot_sequence_step || 0}/5 sent`}
            </span>
          )}

          {/* SMS button */}
          {lead.phone && (
            <button
              onClick={() => onSmsClick(lead)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
              style={{
                background: lead.sms_follow_up_count > 0 ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
                color: lead.sms_follow_up_count > 0 ? "#f59e0b" : "var(--text-tertiary)",
              }}
              title="Send SMS"
            >
              <MessageSquare size={14} />
              {lead.sms_follow_up_count > 0 ? (
                <span className="hidden sm:inline">{lead.sms_follow_up_count}/3</span>
              ) : (
                <span className="hidden sm:inline">SMS</span>
              )}
            </button>
          )}

          {/* SMS timestamp */}
          {lead.last_sms_at && (
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              SMS {new Date(lead.last_sms_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}

          {/* Mark as client */}
          <button
            onClick={() => handleAction("client", () => onUpdate(lead.id, { status: isClient ? "new" : "client" }))}
            disabled={!!actionLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{
              background: isClient ? "rgba(212,168,83,0.15)" : "rgba(255,255,255,0.04)",
              color: isClient ? "#d4a853" : "var(--text-tertiary)",
              opacity: actionLoading === "client" ? 0.5 : 1,
            }}
            title={isClient ? "Remove client status" : "Mark as client (sends notification)"}
          >
            {actionLoading === "client" ? <Loader2 size={14} className="animate-spin" /> : <Trophy size={14} />}
            <span className="hidden sm:inline">Won</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => handleAction("delete", () => onDelete(lead.id))}
            disabled={!!actionLoading}
            className="p-2 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
            style={{ color: "var(--text-tertiary)", opacity: actionLoading === "delete" ? 0.5 : 1 }}
            title="Delete lead"
          >
            {actionLoading === "delete" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOTIFICATION RECIPIENTS PANEL
   ══════════════════════════════════════════════ */
interface Recipient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notify_email: boolean;
  notify_sms: boolean;
}

function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [adding, setAdding] = useState(false);
  const [newR, setNewR] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    supabase.from("notification_recipients").select("*").order("created_at").then(({ data }) => {
      if (data) setRecipients(data);
    });
  }, []);

  async function toggleField(id: string, field: "notify_email" | "notify_sms", current: boolean) {
    await supabase.from("notification_recipients").update({ [field]: !current }).eq("id", id);
    setRecipients((prev) => prev.map((r) => r.id === id ? { ...r, [field]: !current } : r));
  }

  async function updateField(id: string, field: "email" | "phone", value: string) {
    await supabase.from("notification_recipients").update({ [field]: value || null }).eq("id", id);
    setRecipients((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value || null } : r));
  }

  async function addRecipient() {
    if (!newR.name) return;
    const { data } = await supabase.from("notification_recipients").insert({
      name: newR.name,
      email: newR.email || null,
      phone: newR.phone || null,
      notify_email: !!newR.email,
      notify_sms: !!newR.phone,
    }).select().single();
    if (data) setRecipients((prev) => [...prev, data]);
    setNewR({ name: "", email: "", phone: "" });
    setAdding(false);
  }

  async function removeRecipient(id: string) {
    await supabase.from("notification_recipients").delete().eq("id", id);
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  }

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" };

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer border-none transition-all"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2">
          <Bell size={14} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "Cormorant Garamond, serif" }}>
            Notification Recipients
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            ({recipients.filter((r) => r.notify_email || r.notify_sms).length} active)
          </span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: "var(--text-tertiary)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-tertiary)" }} />}
      </button>

      {open && (
        <div className="mt-2 rounded-2xl p-4 sm:p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
            These people get notified when a lead is marked Hot, Won, or Replies.
          </p>

          <div className="flex flex-col gap-3">
            {recipients.map((r) => (
              <div key={r.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                {/* Name */}
                <span className="text-sm font-bold shrink-0 w-20" style={{ color: "var(--text-primary)", fontFamily: "Cormorant Garamond, serif" }}>{r.name}</span>

                {/* Email + checkbox */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => toggleField(r.id, "notify_email", r.notify_email)}
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center cursor-pointer border-none"
                    style={{
                      background: r.notify_email ? "linear-gradient(135deg, #f59e0b, #ea580c)" : "rgba(255,255,255,0.06)",
                      border: r.notify_email ? "none" : "2px solid rgba(255,255,255,0.15)",
                    }}
                    title={r.notify_email ? "Disable email notifications" : "Enable email notifications"}
                  >
                    {r.notify_email && <span style={{ color: "#000", fontSize: "11px", fontWeight: 800 }}>&#10003;</span>}
                  </button>
                  <Mail size={12} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                  <input
                    type="email"
                    defaultValue={r.email || ""}
                    onBlur={(e) => updateField(r.id, "email", e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 min-w-0 px-2 py-1 rounded-lg text-xs outline-none"
                    style={inputStyle}
                  />
                </div>

                {/* Phone + checkbox */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => toggleField(r.id, "notify_sms", r.notify_sms)}
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center cursor-pointer border-none"
                    style={{
                      background: r.notify_sms ? "linear-gradient(135deg, #f59e0b, #ea580c)" : "rgba(255,255,255,0.06)",
                      border: r.notify_sms ? "none" : "2px solid rgba(255,255,255,0.15)",
                    }}
                    title={r.notify_sms ? "Disable SMS notifications" : "Enable SMS notifications"}
                  >
                    {r.notify_sms && <span style={{ color: "#000", fontSize: "11px", fontWeight: 800 }}>&#10003;</span>}
                  </button>
                  <Phone size={12} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                  <input
                    type="tel"
                    defaultValue={r.phone || ""}
                    onBlur={(e) => updateField(r.id, "phone", e.target.value)}
                    placeholder="+16041234567"
                    className="flex-1 min-w-0 px-2 py-1 rounded-lg text-xs outline-none"
                    style={inputStyle}
                  />
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeRecipient(r.id)}
                  className="shrink-0 p-1.5 rounded-lg cursor-pointer bg-transparent border-none self-start sm:self-center"
                  style={{ color: "var(--text-tertiary)" }}
                  title="Remove recipient"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add new */}
          {adding ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.03)", border: "1px solid rgba(245,158,11,0.1)" }}>
              <input placeholder="Name *" value={newR.name} onChange={(e) => setNewR((n) => ({ ...n, name: e.target.value }))} className="px-3 py-2 rounded-lg text-xs outline-none sm:w-28" style={inputStyle} />
              <input type="email" placeholder="Email" value={newR.email} onChange={(e) => setNewR((n) => ({ ...n, email: e.target.value }))} className="px-3 py-2 rounded-lg text-xs outline-none flex-1" style={inputStyle} />
              <input type="tel" placeholder="+16041234567" value={newR.phone} onChange={(e) => setNewR((n) => ({ ...n, phone: e.target.value }))} className="px-3 py-2 rounded-lg text-xs outline-none flex-1" style={inputStyle} />
              <div className="flex gap-2">
                <button onClick={addRecipient} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer border-none" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", color: "#000" }}>Add</button>
                <button onClick={() => { setAdding(false); setNewR({ name: "", email: "", phone: "" }); }} className="px-3 py-2 rounded-lg text-xs cursor-pointer border-none" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border-none"
              style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)" }}
            >
              <UserPlus size={13} /> Add Recipient
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function LeadsPage() {
  return (
    <AuthGate title="Ozio Consulting Leads">
      <LeadsContent />
    </AuthGate>
  );
}

function LeadsContent() {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [hotSending, setHotSending] = useState<string | null>(null);
  const [showSms, setShowSms] = useState(false);
  const [smsLead, setSmsLead] = useState<SalesLead | null>(null);
  const [smsMessage, setSmsMessage] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [showAllSms, setShowAllSms] = useState(false);
  const [failedByLead, setFailedByLead] = useState<Record<string, FailedSends>>({});
  const [showSequenceEditor, setShowSequenceEditor] = useState(false);

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase.from("sales_leads").select("*").order("created_at", { ascending: true });
    if (data) setLeads(data);
    setLoading(false);
  }, []);

  const fetchFailedSends = useCallback(async () => {
    const [{ data: failedEmails }, { data: failedSms }, { data: failedCampaign }] = await Promise.all([
      supabase.from("email_sends").select("lead_id, status").in("status", FAILED_STATUSES),
      supabase.from("sms_sends").select("lead_id, status").in("status", FAILED_STATUSES),
      supabase.from("campaign_sends").select("status, enrollment:campaign_enrollments!inner(lead_id)").in("status", FAILED_STATUSES),
    ]);
    const map: Record<string, FailedSends> = {};
    for (const e of failedEmails || []) {
      if (!map[e.lead_id]) map[e.lead_id] = { emails: 0, sms: 0 };
      map[e.lead_id].emails++;
    }
    for (const c of (failedCampaign || []) as unknown as { status: string; enrollment: { lead_id: string }[] }[]) {
      const lid = c.enrollment?.[0]?.lead_id;
      if (!lid) continue;
      if (!map[lid]) map[lid] = { emails: 0, sms: 0 };
      map[lid].emails++;
    }
    for (const s of failedSms || []) {
      if (!map[s.lead_id]) map[s.lead_id] = { emails: 0, sms: 0 };
      map[s.lead_id].sms++;
    }
    setFailedByLead(map);
  }, []);

  useEffect(() => { fetchLeads(); fetchFailedSends(); }, [fetchLeads, fetchFailedSends]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("sales_leads_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales_leads" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setLeads((prev) => [...prev, payload.new as SalesLead]);
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new as SalesLead;
          setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
          if (updated.status === "client") setToast(`${updated.company_name} is now a client!`);
        } else if (payload.eventType === "DELETE") {
          setLeads((prev) => prev.filter((l) => l.id !== (payload.old as { id: string }).id));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "email_sends" }, () => { fetchFailedSends(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "sms_sends" }, () => { fetchFailedSends(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_sends" }, () => { fetchFailedSends(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchFailedSends]);

  async function updateLead(id: string, data: Partial<SalesLead>) {
    await supabase.from("sales_leads").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
  }
  // Update local state only — for when the backend has already written to DB
  // and realtime may lag or drop the event (e.g. after backend /unhot).
  function localUpdateLead(id: string, data: Partial<SalesLead>) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  }
  async function deleteLead(id: string) {
    await supabase.from("sales_leads").delete().eq("id", id);
  }

  async function hotOutreach(lead: SalesLead) {
    if (hotSending) return;
    if (!lead.client_email && !lead.phone) {
      setToast("Add an email or phone number first");
      return;
    }
    setHotSending(lead.id);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch("https://api.ozioconsulting.com/api/leads/hot-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lead_id: lead.id }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.already_sent) {
          setToast(`${lead.company_name} — outreach already sent`);
        } else {
          const parts: string[] = [];
          if (data.email_sent) parts.push("email");
          if (data.sms_sent) parts.push("SMS");
          setToast(`${lead.company_name} marked hot — ${parts.join(" + ")} sent`);
        }
      } else {
        setToast(`Error: ${data.error}`);
      }
    } catch {
      setToast("Failed to send outreach");
    }
    setHotSending(null);
  }

  async function markResponded(lead: SalesLead) {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(`https://api.ozioconsulting.com/api/leads/${lead.id}/mark-responded`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.ok) localUpdateLead(lead.id, { responded: true });
      setToast(`${lead.company_name} marked as responded — follow-ups cancelled`);
    } catch {
      setToast("Failed to mark as responded");
    }
  }

  function openSmsModal(lead: SalesLead) {
    const templates = [
      `Hey, this is Luke from Ozio Consulting. Joel mentioned he chatted with you recently. Would you be open to grabbing a quick coffee this week? We pick up the tab. Book here: ozioconsulting.com/schedule`,
      `Hey, just following up. We help trades businesses automate lead follow-ups, scheduling, and reviews. Happy to show you how over coffee -- no strings attached. ozioconsulting.com/schedule`,
      `Last text from me. If you ever want to chat about automating the stuff that eats your week, the offer stands. ozioconsulting.com/schedule -- Luke, Ozio Consulting`,
    ];
    const step = Math.min(lead.sms_follow_up_count || 0, 2);
    setSmsLead(lead);
    setSmsMessage(templates[step]);
    setShowSms(true);
  }

  async function sendSms() {
    if (!smsLead) return;
    setSmsSending(true);
    try {
      const res = await fetch("https://api.ozioconsulting.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
        body: JSON.stringify({ lead_id: smsLead.id, message: smsMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setToast(`SMS sent to ${smsLead.company_name}`);
        setShowSms(false);
      } else {
        setToast(`Failed: ${data.error}`);
      }
    } catch {
      setToast("Failed to send SMS");
    }
    setSmsSending(false);
  }
  async function addLead(lead: Partial<SalesLead>) {
    await supabase.from("sales_leads").insert(lead);
    setShowAdd(false);
  }
  async function uploadLeads(newLeads: Partial<SalesLead>[]) {
    const BATCH = 50;
    for (let i = 0; i < newLeads.length; i += BATCH) {
      await supabase.from("sales_leads").insert(newLeads.slice(i, i + BATCH));
    }
    setShowUpload(false);
    setToast(`Imported ${newLeads.length} leads`);
  }

  // Filter + search
  const filtered = leads.filter((l) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "contacted" && l.contacted) ||
      (filter === "hot" && l.hot) ||
      (filter === "new" && !l.contacted && !l.hot) ||
      (filter === "client" && l.status === "client") ||
      (filter === "has_notes" && l.notes && l.notes.trim() !== "") ||
      filter === l.area;
    const q = search.toLowerCase();
    const matchesSearch = !q || l.company_name.toLowerCase().includes(q) || (l.contact_name || "").toLowerCase().includes(q) || (l.phone || "").includes(q) || (l.address || "").toLowerCase().includes(q) || (l.notes || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: leads.length,
    contacted: leads.filter((l) => l.contacted).length,
    hot: leads.filter((l) => l.hot).length,
    client: leads.filter((l) => l.status === "client").length,
    notes: leads.filter((l) => l.notes && l.notes.trim() !== "").length,
  };

  const FILTER_PILLS = [
    { key: "all", label: `All ${stats.total}` },
    { key: "new", label: "Untouched" },
    { key: "contacted", label: `Contacted ${stats.contacted}` },
    { key: "hot", label: `Hot ${stats.hot}` },
    { key: "client", label: `Won ${stats.client}` },
    { key: "has_notes", label: `Has Notes ${stats.notes}` },
    { key: "nv", label: "North Van" },
    { key: "van", label: "Vancouver" },
    { key: "sa", label: "Service Area" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* SMS Modal */}
      {showSms && smsLead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "2rem" }} onClick={() => setShowSms(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "var(--bg-surface)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700 }}>Send SMS</h2>
              <button onClick={() => setShowSms(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: "1rem", padding: "0.6rem 0.8rem", borderRadius: 10, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{smsLead.company_name}</span>
              <span style={{ color: "#f59e0b", marginLeft: "0.75rem" }}>{smsLead.phone}</span>
              {smsLead.sms_follow_up_count > 0 && (
                <span style={{ color: "var(--text-tertiary)", marginLeft: "0.75rem" }}>SMS {smsLead.sms_follow_up_count}/3 sent</span>
              )}
            </div>
            <textarea
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              rows={5}
              style={{ width: "100%", padding: "0.75rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", outline: "none", marginBottom: "0.5rem", resize: "vertical" }}
            />
            <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginBottom: "1rem" }}>{smsMessage.length}/160 characters {smsMessage.length > 160 ? `(${Math.ceil(smsMessage.length / 160)} segments)` : ""}</p>
            <button
              onClick={sendSms}
              disabled={smsSending || !smsMessage.trim()}
              style={{ width: "100%", padding: "0.75rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f59e0b, #ea580c)", color: "#000", fontWeight: 700, fontSize: "0.85rem", cursor: smsSending ? "wait" : "pointer", opacity: smsSending ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              {smsSending ? <><Loader2 size={14} className="spin" /> Sending...</> : <><MessageSquare size={14} /> Send SMS</>}
            </button>
          </div>
        </div>
      )}
      {showUpload && <CSVUploadModal onClose={() => setShowUpload(false)} onUpload={uploadLeads} />}
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onAdd={addLead} />}
      {showAllEmails && <AllEmailsModal leads={leads} onClose={() => setShowAllEmails(false)} />}
      {showAllSms && <AllSmsModal leads={leads} onClose={() => setShowAllSms(false)} />}
      {showSequenceEditor && <HotSequenceModal onClose={() => setShowSequenceEditor(false)} />}

      {/* Header */}
      <header className="px-4 pt-5 pb-4 sm:px-6 md:px-8" style={{ background: "var(--bg-surface)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}>
                <Users size={16} color="#000" />
              </div>
              <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 800, fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "var(--text-primary)" }}>Sales Leads</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", color: "#000", boxShadow: "0 0 15px rgba(245,158,11,0.3)" }}>
                <Upload size={13} /><span className="hidden sm:inline">Upload CSV</span>
              </button>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}>
                <Plus size={13} /><span className="hidden sm:inline">Add</span>
              </button>
              <button onClick={() => setShowAllEmails(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", color: "#f59e0b" }} title="View all emails sent">
                <Mail size={13} /><span className="hidden sm:inline">Emails</span>
              </button>
              <button onClick={() => setShowAllSms(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", color: "#22c55e" }} title="View all SMS sent">
                <MessageSquare size={13} /><span className="hidden sm:inline">SMS</span>
              </button>
              <button onClick={() => setShowSequenceEditor(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }} title="Edit hot lead follow-up sequence">
                <Flame size={13} /><span className="hidden sm:inline">Sequence</span>
              </button>
              <button onClick={() => supabase.auth.signOut()} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--text-tertiary)" }} title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>Ozio Consulting · Real-time Lead Tracker</p>

          {/* Stats */}
          <div className="flex gap-5 sm:gap-8">
            {[
              { icon: <Users size={13} />, num: stats.total, label: "Total" },
              { icon: <PhoneCall size={13} />, num: stats.contacted, label: "Contacted" },
              { icon: <Flame size={13} />, num: stats.hot, label: "Hot" },
              { icon: <Trophy size={13} />, num: stats.client, label: "Won" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--accent)", lineHeight: 1 }}>{s.num}</div>
                <div className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--text-tertiary)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-3 sm:px-6 md:px-8" style={{ background: "rgba(10,15,30,0.8)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company, contact, phone, address, notes..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }} />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-4 py-3 sm:px-6 md:px-8 flex gap-2 overflow-x-auto" style={{ background: "rgba(10,15,30,0.5)", borderBottom: "1px solid rgba(255,255,255,0.03)", scrollbarWidth: "none" }}>
        {FILTER_PILLS.map((p) => (
          <button
            key={p.key}
            onClick={() => setFilter(p.key)}
            className="shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide cursor-pointer transition-all border whitespace-nowrap"
            style={filter === p.key ? { background: "linear-gradient(135deg, #f59e0b, #ea580c)", color: "#000", border: "1px solid transparent" } : { background: "rgba(255,255,255,0.04)", color: "var(--text-tertiary)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Leads List — full width */}
      <div className="px-4 py-4 sm:px-6 md:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid var(--accent)", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{leads.length === 0 ? "No leads yet. Upload a CSV or add one manually." : "No leads match your filter."}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onUpdate={updateLead} onLocalUpdate={localUpdateLead} onDelete={deleteLead} onSmsClick={(l) => openSmsModal(l)} onHotOutreach={(l) => hotOutreach(l)} onMarkResponded={(l) => markResponded(l)} hotSending={hotSending} failedSends={failedByLead[lead.id]} />
            ))}
            <p className="text-center text-[11px] mt-4 pb-4" style={{ color: "var(--text-tertiary)" }}>Showing {filtered.length} of {leads.length} leads</p>
          </div>
        )}
      </div>

      {/* Notification Recipients */}
      <NotificationsPanel />

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
