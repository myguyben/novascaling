"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  Coffee,
  Filter,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  TrendingUp,
  User,
  Video,
  XCircle,
  Building2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "@/components/auth/AuthGate";

interface ScheduleRequest {
  id: string;
  site_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  meeting_type: "video" | "lunch";
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Pending" },
  confirmed: { color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)", label: "Confirmed" },
  completed: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)", label: "Completed" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "Cancelled" },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCreatedAt(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isUpcoming(dateStr: string) {
  const date = new Date(dateStr + "T23:59:59");
  return date >= new Date();
}

export default function SchedulingPage() {
  const [requests, setRequests] = useState<ScheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("schedule_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setRequests(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id);
    const { error } = await supabase
      .from("schedule_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
    setUpdating(null);
  }

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("schedule_requests_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_requests" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRequests((prev) => [payload.new as ScheduleRequest, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setRequests((prev) =>
              prev.map((r) =>
                r.id === (payload.new as ScheduleRequest).id
                  ? (payload.new as ScheduleRequest)
                  : r
              )
            );
          } else if (payload.eventType === "DELETE") {
            setRequests((prev) =>
              prev.filter((r) => r.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    confirmed: requests.filter((r) => r.status === "confirmed").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  const upcoming = requests.filter(
    (r) => isUpcoming(r.preferred_date) && r.status !== "cancelled" && r.status !== "completed"
  );

  return (
    <AuthGate title="Scheduling">
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={18} color="#030712" />
              </div>
            </Link>
            <div>
              <h1
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                Scheduling
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                {requests.length} total requests &middot; {upcoming.length} upcoming
              </p>
            </div>
          </div>

          <button
            onClick={fetchRequests}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          {(["pending", "confirmed", "completed", "cancelled"] as const).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div
                key={s}
                style={{
                  padding: "1rem",
                  borderRadius: 14,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                    color: cfg.color,
                  }}
                >
                  {counts[s]}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {cfg.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginBottom: "1.5rem",
            padding: "0.3rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.06)",
            overflowX: "auto",
          }}
        >
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 10,
                border: "none",
                background: filter === s ? "rgba(255,255,255,0.1)" : "transparent",
                color: filter === s ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
              }}
            >
              {s === "all" ? `All (${counts.all})` : `${s} (${counts[s]})`}
            </button>
          ))}
        </div>

        {/* Request List */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "4rem 0",
              color: "var(--text-secondary)",
              gap: "0.75rem",
            }}
          >
            <Loader2 size={20} className="spin" />
            Loading requests...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "var(--text-tertiary)",
            }}
          >
            <Calendar size={40} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>
              {filter === "all" ? "No scheduling requests yet." : `No ${filter} requests.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((req) => {
                const sc = getStatusConfig(req.status);
                const upcoming = isUpcoming(req.preferred_date);

                return (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      padding: "1.25rem",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${upcoming && req.status === "pending" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`,
                      transition: "border-color 0.2s",
                    }}
                  >
                    {/* Top Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                        marginBottom: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: req.meeting_type === "lunch" ? "rgba(245,158,11,0.12)" : "rgba(56,189,248,0.12)",
                            border: `1px solid ${req.meeting_type === "lunch" ? "rgba(245,158,11,0.25)" : "rgba(56,189,248,0.25)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: req.meeting_type === "lunch" ? "#f59e0b" : "#38bdf8",
                            flexShrink: 0,
                          }}
                        >
                          {req.meeting_type === "lunch" ? <Coffee size={18} /> : <Video size={18} />}
                        </div>
                        <div>
                          <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "1rem" }}>
                            {req.name}
                          </div>
                          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                            {req.meeting_type === "lunch" ? "Lunch / Coffee" : "Video Call"} &middot; {formatCreatedAt(req.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span
                        style={{
                          padding: "0.3rem 0.75rem",
                          borderRadius: 100,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: sc.color,
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "0.5rem 1.5rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        <Calendar size={14} style={{ flexShrink: 0 }} />
                        {formatDate(req.preferred_date)} at {req.preferred_time}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        <Mail size={14} style={{ flexShrink: 0 }} />
                        {req.email}
                      </div>
                      {req.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                          <Phone size={14} style={{ flexShrink: 0 }} />
                          {req.phone}
                        </div>
                      )}
                      {req.company && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                          <Building2 size={14} style={{ flexShrink: 0 }} />
                          {req.company}
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {req.message && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          padding: "0.6rem 0.75rem",
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          marginBottom: "0.75rem",
                          color: "var(--text-secondary)",
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                        }}
                      >
                        <MessageSquare size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                        {req.message}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {req.status === "pending" && (
                        <>
                          <ActionButton
                            label="Confirm"
                            color="#38bdf8"
                            icon={<CheckCircle size={14} />}
                            loading={updating === req.id}
                            onClick={() => updateStatus(req.id, "confirmed")}
                          />
                          <ActionButton
                            label="Cancel"
                            color="#ef4444"
                            icon={<XCircle size={14} />}
                            loading={updating === req.id}
                            onClick={() => updateStatus(req.id, "cancelled")}
                          />
                        </>
                      )}
                      {req.status === "confirmed" && (
                        <>
                          <ActionButton
                            label="Completed"
                            color="#34d399"
                            icon={<CheckCircle size={14} />}
                            loading={updating === req.id}
                            onClick={() => updateStatus(req.id, "completed")}
                          />
                          <ActionButton
                            label="Cancel"
                            color="#ef4444"
                            icon={<XCircle size={14} />}
                            loading={updating === req.id}
                            onClick={() => updateStatus(req.id, "cancelled")}
                          />
                        </>
                      )}
                      {(req.status === "completed" || req.status === "cancelled") && (
                        <ActionButton
                          label="Reopen"
                          color="#64748b"
                          icon={<RefreshCw size={14} />}
                          loading={updating === req.id}
                          onClick={() => updateStatus(req.id, "pending")}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style jsx global>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </AuthGate>
  );
}

function ActionButton({
  label,
  color,
  icon,
  loading,
  onClick,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.85rem",
        borderRadius: 10,
        fontSize: "0.78rem",
        fontWeight: 600,
        border: `1px solid ${color}30`,
        background: `${color}10`,
        color,
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "all 0.2s",
      }}
    >
      {loading ? <Loader2 size={14} className="spin" /> : icon}
      {label}
    </button>
  );
}
