"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Video,
  Coffee,
  Loader2,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const BACKEND_URL = "https://websol-backend.onrender.com";

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

export default function SchedulePage() {
  const [meetingType, setMeetingType] = useState<"video" | "lunch">("lunch");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setStatus("sending");
    try {
      const res = await fetch(`${BACKEND_URL}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: "ozioconsulting",
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          company: form.company || null,
          message: form.message || null,
          meeting_type: meetingType,
          preferred_date: selectedDate.toISOString().split("T")[0],
          preferred_time: selectedTime,
        }),
      });
      if (!res.ok) throw new Error("Failed to book");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  /* ── Calendar helpers ── */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

  function prevMonth() {
    setViewMonth(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewMonth(new Date(year, month + 1, 1));
  }

  function isDisabled(day: number) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    // Disable past dates and weekends (Sun=0, Sat=6)
    return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  }

  function isSameDay(day: number) {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
              <h1 className="audit-success-title">You&apos;re booked.</h1>
              <p className="audit-success-desc">
                We&apos;ll confirm your{" "}
                {meetingType === "lunch" ? "lunch meeting" : "video call"} for{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {selectedTime}. Check your email for details.
              </p>
              <Link href="/" className="btn btn-primary btn-lg">
                Back to Home <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <div className="audit-layout">
              {/* ── Left Column: Sales Copy ── */}
              <motion.div
                className="audit-info"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="audit-title">
                  They say there&apos;s no such thing as a{" "}
                  <span className="text-gradient-hero">free lunch.</span>
                </h1>
                <p className="audit-desc" style={{ fontSize: "1.15rem", lineHeight: 1.7 }}>
                  We&apos;re here to prove that wrong.
                </p>
                <p className="audit-desc" style={{ marginTop: "0.75rem" }}>
                  No bullshit. No slides. We sit down and have a real conversation
                  about your business. If there&apos;s a way we can make life easier
                  for you and you want us to — we work together. If not, we pick up
                  the check and wish each other the best.
                </p>

                <div className="audit-promises">
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>Lunch or coffee — on us</span>
                  </div>
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>No pitch, no slides — just a real conversation</span>
                  </div>
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>We&apos;ll tell you what&apos;s costing you money</span>
                  </div>
                  <div className="audit-promise">
                    <CheckCircle size={20} className="audit-promise-icon" />
                    <span>Not local? We&apos;ll hop on a video call instead</span>
                  </div>
                </div>
              </motion.div>

              {/* ── Right Column: Scheduling Form ── */}
              <motion.form
                className="audit-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Meeting Type Selector */}
                <div className="meeting-type-group">
                  <button
                    type="button"
                    className={`meeting-type-btn${
                      meetingType === "lunch" ? " meeting-type-btn--selected" : ""
                    }`}
                    onClick={() => setMeetingType("lunch")}
                  >
                    <Coffee size={18} />
                    Lunch / Coffee
                  </button>
                  <button
                    type="button"
                    className={`meeting-type-btn${
                      meetingType === "video" ? " meeting-type-btn--selected" : ""
                    }`}
                    onClick={() => setMeetingType("video")}
                  >
                    <Video size={18} />
                    Video Call
                  </button>
                </div>

                {/* Calendar Date Picker */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={prevMonth}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: "0.25rem",
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {monthLabel}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: "0.25rem",
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="calendar-grid" style={{ marginBottom: "4px" }}>
                    {dayHeaders.map((d) => (
                      <div
                        key={d}
                        style={{
                          textAlign: "center",
                          fontSize: "0.75rem",
                          color: "var(--text-muted, var(--text-secondary))",
                          fontWeight: 500,
                          padding: "0.25rem 0",
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="calendar-grid">
                    {/* Empty cells for offset */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {/* Actual days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const disabled = isDisabled(day);
                      const selected = isSameDay(day);
                      const todayClass = isToday(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          className={[
                            "calendar-day",
                            disabled ? "calendar-day--disabled" : "",
                            selected ? "calendar-day--selected" : "",
                            todayClass && !selected ? "calendar-day--today" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => {
                            setSelectedDate(new Date(year, month, day));
                            setSelectedTime("");
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      Select a time
                    </label>
                    <div className="time-slot-grid">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`time-slot${
                            selectedTime === slot ? " time-slot--selected" : ""
                          }`}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Fields */}
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
                    <label htmlFor="company">Company</label>
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
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Anything we should know beforehand?"
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                {status === "error" && (
                  <div className="form-error">
                    Failed to book. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={status === "sending" || !selectedDate || !selectedTime}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={18} className="spin" /> Booking...
                    </>
                  ) : (
                    <>
                      Confirm Booking <ArrowRight size={18} />
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
