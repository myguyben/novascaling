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
} from "lucide-react";

/* ── Types ── */
interface SalesLead {
  id: string;
  company_name: string;
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
  created_at: string;
  updated_at: string;
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
  const [form, setForm] = useState({ company_name: "", phone: "", address: "", area: "other", area_label: "", rating: "", review_count: "", industry: "", notes: "", client_email: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      company_name: form.company_name,
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
   LEAD ROW — Full width, checkbox-driven
   ══════════════════════════════════════════════ */
function LeadRow({
  lead,
  onUpdate,
  onDelete,
}: {
  lead: SalesLead;
  onUpdate: (id: string, data: Partial<SalesLead>) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [email, setEmail] = useState(lead.client_email || "");
  const [showReply, setShowReply] = useState(false);
  const notesTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const emailTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
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

  useEffect(() => { setNotes(lead.notes || ""); }, [lead.notes]);
  useEffect(() => { setEmail(lead.client_email || ""); }, [lead.client_email]);

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

      {/* Mobile: stacked. Desktop: single row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

        {/* Contacted checkbox */}
        <button
          onClick={() => onUpdate(lead.id, { contacted: !contacted })}
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none self-start md:self-center"
          style={{
            background: contacted ? "linear-gradient(135deg, #f59e0b, #ea580c)" : "rgba(255,255,255,0.06)",
            border: contacted ? "none" : "2px solid rgba(255,255,255,0.15)",
          }}
          title={contacted ? "Mark as not contacted" : "Mark as contacted"}
        >
          {contacted && <span style={{ color: "#000", fontSize: "14px", fontWeight: 800, lineHeight: 1 }}>&#10003;</span>}
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
          </div>

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
            onClick={() => onUpdate(lead.id, { hot: !hot })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{
              background: hot ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
              color: hot ? "#ef4444" : "var(--text-tertiary)",
            }}
            title={hot ? "Unmark as hot lead" : "Mark as hot lead (sends outreach email)"}
          >
            <Flame size={14} fill={hot ? "#ef4444" : "none"} />
            <span className="hidden sm:inline">Hot</span>
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
                onClick={() => onUpdate(lead.id, { responded: true })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-tertiary)" }}
                title="Mark as responded (stops follow-ups)"
              >
                <MessageSquareReply size={14} />
                <span className="hidden sm:inline">No Reply</span>
              </button>
            )
          )}

          {/* Follow-up indicator */}
          {hot && lead.hot_email_sent_at && !lead.responded && (
            <span className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(245,158,11,0.08)", color: "var(--accent)" }}>
              <Send size={10} />
              {lead.follow_up_count + 1}/5 emails
            </span>
          )}

          {/* Mark as client */}
          <button
            onClick={() => onUpdate(lead.id, { status: isClient ? "new" : "client" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{
              background: isClient ? "rgba(212,168,83,0.15)" : "rgba(255,255,255,0.04)",
              color: isClient ? "#d4a853" : "var(--text-tertiary)",
            }}
            title={isClient ? "Remove client status" : "Mark as client (sends notification)"}
          >
            <Trophy size={14} />
            <span className="hidden sm:inline">Won</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            title="Delete lead"
          >
            <Trash2 size={14} />
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

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase.from("sales_leads").select("*").order("created_at", { ascending: true });
    if (data) setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

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
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function updateLead(id: string, data: Partial<SalesLead>) {
    await supabase.from("sales_leads").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
  }
  async function deleteLead(id: string) {
    await supabase.from("sales_leads").delete().eq("id", id);
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
      filter === l.area;
    const q = search.toLowerCase();
    const matchesSearch = !q || l.company_name.toLowerCase().includes(q) || (l.phone || "").includes(q) || (l.address || "").toLowerCase().includes(q) || (l.notes || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: leads.length,
    contacted: leads.filter((l) => l.contacted).length,
    hot: leads.filter((l) => l.hot).length,
    client: leads.filter((l) => l.status === "client").length,
  };


  const FILTER_PILLS = [
    { key: "all", label: `All ${stats.total}` },
    { key: "new", label: "Untouched" },
    { key: "contacted", label: `Contacted ${stats.contacted}` },
    { key: "hot", label: `Hot ${stats.hot}` },
    { key: "client", label: `Won ${stats.client}` },
    { key: "nv", label: "North Van" },
    { key: "van", label: "Vancouver" },
    { key: "sa", label: "Service Area" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {showUpload && <CSVUploadModal onClose={() => setShowUpload(false)} onUpload={uploadLeads} />}
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onAdd={addLead} />}

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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, address, notes..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }} />
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
              <LeadRow key={lead.id} lead={lead} onUpdate={updateLead} onDelete={deleteLead} />
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
