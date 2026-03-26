"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
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
  nv: { bg: "rgba(56,189,248,0.15)", text: "#38bdf8" },
  van: { bg: "rgba(129,140,248,0.15)", text: "#818cf8" },
  sa: { bg: "rgba(251,191,36,0.12)", text: "#f59e0b" },
  other: { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
};

/* ══════════════════════════════════════════════
   AUTH GATE
   ══════════════════════════════════════════════ */
function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) setError(authError.message);
    else onAuth();
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--text-primary)",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-deep)" }}>
      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}>
            <Users size={18} color="#000" />
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--text-primary)" }}>NovaScaling Leads</h1>
        </div>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>{isSignUp ? "Create your team account" : "Sign in to manage leads"}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#000", opacity: loading ? 0.6 : 1 }}>{loading ? "..." : isSignUp ? "Create Account" : "Sign In"}</button>
        </form>
        <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="mt-4 text-sm cursor-pointer bg-transparent border-none" style={{ color: "var(--accent)" }}>{isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}</button>
      </div>
    </div>
  );
}

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
          <h2 className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text-primary)" }}>
            <FileSpreadsheet size={20} className="inline mr-2" style={{ color: "var(--accent)" }} />Upload Leads CSV
          </h2>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>
        {parsed.length === 0 ? (
          <div onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl cursor-pointer" style={{ border: "2px dashed rgba(56,189,248,0.3)", background: "rgba(56,189,248,0.03)" }}>
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
              <button onClick={doUpload} disabled={!mapping.company_name} className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer" style={{ background: mapping.company_name ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "rgba(255,255,255,0.05)", color: mapping.company_name ? "#000" : "var(--text-tertiary)" }}>Import {parsed.length} Leads</button>
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
  const [form, setForm] = useState({ company_name: "", phone: "", address: "", area: "other", area_label: "", rating: "", review_count: "", industry: "", notes: "" });

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
      status: "new",
    });
  }

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md p-6 rounded-3xl" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text-primary)" }}>Add Lead</h2>
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
          <input placeholder="Industry" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          <button type="submit" className="mt-2 py-3 rounded-xl font-bold text-sm cursor-pointer" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#000" }}>Add Lead</button>
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
    <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-[slideIn_0.3s_ease-out]" style={{ background: "linear-gradient(135deg, #34d399, #38bdf8)", color: "#000", boxShadow: "0 8px 30px rgba(52,211,153,0.3)" }}>
      <Trophy size={16} />{message}
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
  const notesTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const areaColor = AREA_COLORS[lead.area] || AREA_COLORS.other;

  function handleNotesChange(value: string) {
    setNotes(value);
    if (notesTimeout.current) clearTimeout(notesTimeout.current);
    notesTimeout.current = setTimeout(() => onUpdate(lead.id, { notes: value }), 800);
  }

  useEffect(() => { setNotes(lead.notes || ""); }, [lead.notes]);

  const contacted = lead.contacted;
  const hot = lead.hot;
  const isClient = lead.status === "client";

  return (
    <div
      className="w-full rounded-2xl p-4 md:p-5 transition-all duration-200"
      style={{
        background: isClient
          ? "rgba(52,211,153,0.04)"
          : hot
          ? "rgba(239,68,68,0.04)"
          : "rgba(255,255,255,0.02)",
        border: isClient
          ? "1px solid rgba(52,211,153,0.15)"
          : hot
          ? "1px solid rgba(239,68,68,0.12)"
          : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Mobile: stacked. Desktop: single row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

        {/* Contacted checkbox */}
        <button
          onClick={() => onUpdate(lead.id, { contacted: !contacted })}
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none self-start md:self-center"
          style={{
            background: contacted ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "rgba(255,255,255,0.06)",
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
                fontFamily: "Outfit, sans-serif",
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
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
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
          </div>
        </div>

        {/* Notes input */}
        <input
          type="text"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Notes..."
          className="w-full md:w-48 lg:w-64 px-3 py-2 rounded-lg text-xs outline-none shrink-0"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}
        />

        {/* Action buttons: Hot + Client + Delete */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hot lead toggle */}
          <button
            onClick={() => onUpdate(lead.id, { hot: !hot })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{
              background: hot ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
              color: hot ? "#ef4444" : "var(--text-tertiary)",
            }}
            title={hot ? "Unmark as hot lead" : "Mark as hot lead"}
          >
            <Flame size={14} fill={hot ? "#ef4444" : "none"} />
            <span className="hidden sm:inline">Hot</span>
          </button>

          {/* Mark as client */}
          <button
            onClick={() => onUpdate(lead.id, { status: isClient ? "new" : "client" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border-none transition-all"
            style={{
              background: isClient ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)",
              color: isClient ? "#34d399" : "var(--text-tertiary)",
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
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function LeadsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAuthed(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase.from("sales_leads").select("*").order("created_at", { ascending: true });
    if (data) setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) fetchLeads(); }, [authed, fetchLeads]);

  // Realtime
  useEffect(() => {
    if (!authed) return;
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
  }, [authed]);

  async function updateLead(id: string, data: Partial<SalesLead>) {
    await supabase.from("sales_leads").update(data).eq("id", id);
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

  if (authed === null) return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-deep)" }}><div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid var(--accent)", borderTopColor: "transparent" }} /></div>;
  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />;

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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}>
                <Users size={16} color="#000" />
              </div>
              <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "var(--text-primary)" }}>Sales Leads</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:translate-y-[-1px]" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#000", boxShadow: "0 0 15px rgba(56,189,248,0.3)" }}>
                <Upload size={13} /><span className="hidden sm:inline">Upload CSV</span>
              </button>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}>
                <Plus size={13} /><span className="hidden sm:inline">Add</span>
              </button>
              <button onClick={() => supabase.auth.signOut().then(() => setAuthed(false))} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--text-tertiary)" }} title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>NovaScaling · Real-time Lead Tracker</p>

          {/* Stats */}
          <div className="flex gap-5 sm:gap-8">
            {[
              { icon: <Users size={13} />, num: stats.total, label: "Total" },
              { icon: <PhoneCall size={13} />, num: stats.contacted, label: "Contacted" },
              { icon: <Flame size={13} />, num: stats.hot, label: "Hot" },
              { icon: <Trophy size={13} />, num: stats.client, label: "Won" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--accent)", lineHeight: 1 }}>{s.num}</div>
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
            style={filter === p.key ? { background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#000", border: "1px solid transparent" } : { background: "rgba(255,255,255,0.04)", color: "var(--text-tertiary)", border: "1px solid rgba(255,255,255,0.06)" }}
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

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
