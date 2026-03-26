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
  ChevronDown,
  Users,
  PhoneCall,
  CalendarCheck,
  Trophy,
  FileSpreadsheet,
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
  notes: string | null;
  industry: string | null;
  list_name: string | null;
  created_at: string;
  updated_at: string;
}

type LeadStatus = "new" | "called" | "meeting" | "not-interested" | "client";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "called", label: "Called" },
  { value: "meeting", label: "Meeting Set" },
  { value: "not-interested", label: "Not Interested" },
  { value: "client", label: "Client" },
];

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

const STATUS_COLORS: Record<string, string> = {
  new: "#64748b",
  called: "#38bdf8",
  meeting: "#f59e0b",
  "not-interested": "#ef4444",
  client: "#34d399",
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
    if (authError) {
      setError(authError.message);
    } else {
      onAuth();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-deep)" }}>
      <div
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}
          >
            <Users size={18} color="#000" />
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--text-primary)" }}>
            NovaScaling Leads
          </h1>
        </div>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          {isSignUp ? "Create your team account" : "Sign in to manage leads"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
            }}
          />
          {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              color: "#000",
              fontFamily: "Inter, sans-serif",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="mt-4 text-sm cursor-pointer bg-transparent border-none"
          style={{ color: "var(--accent)", fontFamily: "Inter, sans-serif" }}
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CSV UPLOAD MODAL
   ══════════════════════════════════════════════ */
function CSVUploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (leads: Partial<SalesLead>[]) => void;
}) {
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
        // Auto-map columns by fuzzy match
        const csvCols = Object.keys(data[0] || {});
        const autoMap: Record<string, string> = {};
        TARGET_FIELDS.forEach((f) => {
          const match = csvCols.find(
            (c) =>
              c.toLowerCase().replace(/[_\s]/g, "") ===
              f.key.toLowerCase().replace(/[_\s]/g, "")
          );
          if (match) autoMap[f.key] = match;
        });
        setMapping(autoMap);
      },
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
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
  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--text-primary)",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl"
        style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text-primary)" }}>
            <FileSpreadsheet size={20} className="inline mr-2" style={{ color: "var(--accent)" }} />
            Upload Leads CSV
          </h2>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}>
            <X size={20} />
          </button>
        </div>

        {parsed.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl cursor-pointer transition-colors"
            style={{
              border: "2px dashed rgba(56,189,248,0.3)",
              background: "rgba(56,189,248,0.03)",
            }}
          >
            <Upload size={32} style={{ color: "var(--accent)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Drop CSV here or click to browse
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Supports .csv files
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              {fileName} — {parsed.length} rows found
            </p>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="List name (e.g. Landscaping - March 2026)"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-32 px-3 py-2 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {TARGET_FIELDS.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <span className="text-xs w-32 shrink-0" style={{ color: "var(--text-secondary)" }}>
                    {field.label}{field.required ? " *" : ""}
                  </span>
                  <select
                    value={mapping[field.key] || ""}
                    onChange={(e) => setMapping((m) => ({ ...m, [field.key]: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
                    style={inputStyle}
                  >
                    <option value="">— skip —</option>
                    {csvCols.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setParsed([]); setMapping({}); setFileName(""); }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-secondary)",
                }}
              >
                Reset
              </button>
              <button
                onClick={doUpload}
                disabled={!mapping.company_name}
                className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all"
                style={{
                  background: mapping.company_name ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "rgba(255,255,255,0.05)",
                  color: mapping.company_name ? "#000" : "var(--text-tertiary)",
                }}
              >
                Import {parsed.length} Leads
              </button>
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
function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (lead: Partial<SalesLead>) => void;
}) {
  const [form, setForm] = useState({
    company_name: "",
    phone: "",
    address: "",
    area: "other",
    area_label: "",
    rating: "",
    review_count: "",
    industry: "",
    notes: "",
  });

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

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--text-primary)",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div
        className="w-full max-w-md p-6 rounded-3xl"
        style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text-primary)" }}>
            Add Lead
          </h2>
          <button onClick={onClose} className="cursor-pointer bg-transparent border-none" style={{ color: "var(--text-secondary)" }}>
            <X size={20} />
          </button>
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
          <button
            type="submit"
            className="mt-2 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#000" }}
          >
            Add Lead
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-[slideIn_0.3s_ease-out]"
      style={{
        background: "linear-gradient(135deg, #34d399, #38bdf8)",
        color: "#000",
        boxShadow: "0 8px 30px rgba(52,211,153,0.3)",
      }}
    >
      <Trophy size={16} />
      {message}
    </div>
  );
}

/* ══════════════════════════════════════════════
   LEAD CARD
   ══════════════════════════════════════════════ */
function LeadCard({
  lead,
  onUpdate,
  onDelete,
}: {
  lead: SalesLead;
  onUpdate: (id: string, data: Partial<SalesLead>) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [showDelete, setShowDelete] = useState(false);
  const notesTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const areaColor = AREA_COLORS[lead.area] || AREA_COLORS.other;

  function handleNotesChange(value: string) {
    setNotes(value);
    if (notesTimeout.current) clearTimeout(notesTimeout.current);
    notesTimeout.current = setTimeout(() => {
      onUpdate(lead.id, { notes: value });
    }, 800);
  }

  useEffect(() => {
    setNotes(lead.notes || "");
  }, [lead.notes]);

  return (
    <div
      className="group rounded-2xl p-4 transition-all duration-300 hover:translate-y-[-1px]"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Row 1: Name + Badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>
          {lead.company_name}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{ background: areaColor.bg, color: areaColor.text }}
          >
            {lead.area_label || AREA_OPTIONS.find((a) => a.value === lead.area)?.label || lead.area}
          </span>
          {showDelete && (
            <button
              onClick={() => onDelete(lead.id)}
              className="cursor-pointer bg-transparent border-none transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              title="Delete lead"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Phone */}
      {lead.phone ? (
        <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 mb-2 text-sm font-bold" style={{ color: "var(--accent)" }}>
          <Phone size={13} />
          {lead.phone}
        </a>
      ) : (
        <p className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>No phone listed</p>
      )}

      {/* Row 3: Address + Rating */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {lead.address && (
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <MapPin size={11} />
            {lead.address}
          </span>
        )}
        {lead.rating !== null && lead.rating !== undefined ? (
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            <Star size={11} fill="#f59e0b" color="#f59e0b" />
            {lead.rating} ({lead.review_count})
          </span>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>No rating</span>
        )}
      </div>

      {/* Row 4: Status + Notes */}
      <div className="flex gap-2 items-center">
        <div className="relative shrink-0">
          <select
            value={lead.status}
            onChange={(e) => onUpdate(lead.id, { status: e.target.value })}
            className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-semibold cursor-pointer outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${STATUS_COLORS[lead.status] || "#64748b"}40`,
              color: STATUS_COLORS[lead.status] || "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
        </div>
        <input
          type="text"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Notes..."
          className="flex-1 min-w-0 px-3 py-1.5 rounded-lg text-xs outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.04)",
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN LEADS PAGE
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

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    const { data } = await supabase
      .from("sales_leads")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchLeads();
  }, [authed, fetchLeads]);

  // Realtime subscription
  useEffect(() => {
    if (!authed) return;

    const channel = supabase
      .channel("sales_leads_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales_leads" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLeads((prev) => [...prev, payload.new as SalesLead]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as SalesLead;
            setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
            if (updated.status === "client") {
              setToast(`${updated.company_name} is now a client!`);
            }
          } else if (payload.eventType === "DELETE") {
            const old = payload.old as { id: string };
            setLeads((prev) => prev.filter((l) => l.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authed]);

  // CRUD operations
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

  async function uploadLeads(leads: Partial<SalesLead>[]) {
    const BATCH = 50;
    for (let i = 0; i < leads.length; i += BATCH) {
      await supabase.from("sales_leads").insert(leads.slice(i, i + BATCH));
    }
    setShowUpload(false);
    setToast(`Imported ${leads.length} leads`);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthed(false);
  }

  // Filter + search
  const filtered = leads.filter((l) => {
    const matchesFilter =
      filter === "all" ||
      filter === l.area ||
      filter === l.status;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      l.company_name.toLowerCase().includes(q) ||
      (l.phone || "").includes(q) ||
      (l.address || "").toLowerCase().includes(q) ||
      (l.notes || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: leads.length,
    called: leads.filter((l) => l.status === "called").length,
    meeting: leads.filter((l) => l.status === "meeting").length,
    client: leads.filter((l) => l.status === "client").length,
  };

  // Loading / Auth gate
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-deep)" }}>
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }
  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />;

  const FILTER_PILLS = [
    { key: "all", label: `All ${stats.total}` },
    { key: "nv", label: "North Van" },
    { key: "van", label: "Vancouver" },
    { key: "sa", label: "Service Area" },
    { key: "called", label: "Called" },
    { key: "meeting", label: "Meeting Set" },
    { key: "client", label: "Clients" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {showUpload && <CSVUploadModal onClose={() => setShowUpload(false)} onUpload={uploadLeads} />}
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onAdd={addLead} />}

      {/* ── Header ── */}
      <header
        className="px-5 pt-6 pb-5 md:px-10"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}
              >
                <Users size={16} color="#000" />
              </div>
              <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "var(--text-primary)" }}>
                Sales Leads
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 hover:translate-y-[-1px]"
                style={{
                  background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                  color: "#000",
                  boxShadow: "0 0 15px rgba(56,189,248,0.3)",
                }}
              >
                <Upload size={13} />
                <span className="hidden sm:inline">Upload CSV</span>
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-primary)",
                }}
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Add</span>
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl cursor-pointer bg-transparent border-none transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
            NovaScaling · Real-time Lead Tracker
          </p>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { icon: <Users size={14} />, num: stats.total, label: "Total" },
              { icon: <PhoneCall size={14} />, num: stats.called, label: "Called" },
              { icon: <CalendarCheck size={14} />, num: stats.meeting, label: "Meeting Set" },
              { icon: <Trophy size={14} />, num: stats.client, label: "Clients" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: "Outfit, sans-serif", color: "var(--accent)", lineHeight: 1 }}
                >
                  {s.num}
                </div>
                <div className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--text-tertiary)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Search ── */}
      <div className="px-5 py-3 md:px-10" style={{ background: "rgba(10,15,30,0.8)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="max-w-6xl mx-auto relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, address, notes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div
        className="px-5 py-3 md:px-10 flex gap-2 overflow-x-auto"
        style={{
          background: "rgba(10,15,30,0.5)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          scrollbarWidth: "none",
        }}
      >
        <div className="max-w-6xl mx-auto flex gap-2 w-full">
          {FILTER_PILLS.map((p) => (
            <button
              key={p.key}
              onClick={() => setFilter(p.key)}
              className="shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide cursor-pointer transition-all border whitespace-nowrap"
              style={
                filter === p.key
                  ? { background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#000", border: "1px solid transparent" }
                  : { background: "rgba(255,255,255,0.04)", color: "var(--text-tertiary)", border: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Leads List ── */}
      <div className="px-5 py-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid var(--accent)", borderTopColor: "transparent" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {leads.length === 0 ? "No leads yet. Upload a CSV or add one manually." : "No leads match your search."}
              </p>
            </div>
          ) : (
            <>
              {/* Group by area */}
              {(() => {
                const groups: Record<string, SalesLead[]> = {};
                filtered.forEach((l) => {
                  const key = l.area;
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(l);
                });
                const areaOrder = ["nv", "van", "sa", "other"];
                return areaOrder
                  .filter((a) => groups[a]?.length)
                  .map((areaKey) => (
                    <div key={areaKey} className="mb-6">
                      <h2
                        className="text-[10px] font-bold uppercase tracking-[2px] mb-3 px-1"
                        style={{ color: "var(--accent)", fontFamily: "Outfit, sans-serif" }}
                      >
                        {AREA_OPTIONS.find((a) => a.value === areaKey)?.label || areaKey}
                      </h2>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {groups[areaKey].map((lead) => (
                          <LeadCard key={lead.id} lead={lead} onUpdate={updateLead} onDelete={deleteLead} />
                        ))}
                      </div>
                    </div>
                  ));
              })()}

              <p className="text-center text-[11px] mt-6 pb-6" style={{ color: "var(--text-tertiary)" }}>
                Showing {filtered.length} of {leads.length} leads
              </p>
            </>
          )}
        </div>
      </div>

      {/* Keyframe for toast */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
