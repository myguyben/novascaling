"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  TrendingUp,
  Mail,
  Sparkles,
} from "lucide-react";

const SOCIAL_LINKS = [
  {
    icon: <Instagram size={20} />,
    href: "https://www.instagram.com/novascaling",
    label: "Instagram",
  },
  {
    icon: <Facebook size={20} />,
    href: "https://www.facebook.com/novascaling",
    label: "Facebook",
  },
  {
    icon: <Youtube size={20} />,
    href: "https://www.youtube.com/@novascaling",
    label: "YouTube",
  },
];

const LINKS = [
  {
    icon: <Calendar size={20} />,
    title: "Book a Free Call",
    desc: "20 min. No pitch, no pressure.",
    href: "/schedule",
    accent: "#38bdf8",
    featured: true,
  },
  {
    icon: <Globe size={20} />,
    title: "Visit Our Website",
    desc: "See what we do and how we do it.",
    href: "https://novascaling.ai",
    accent: "#818cf8",
  },
  {
    icon: <FileText size={20} />,
    title: "Free Operations Audit",
    desc: "Find out where you're bleeding money.",
    href: "/audit",
    accent: "#34d399",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Our Services",
    desc: "Custom automation for SMBs.",
    href: "/services",
    accent: "#f59e0b",
  },
  {
    icon: <Mail size={20} />,
    title: "Email Us",
    desc: "ben@novascaling.ai",
    href: "mailto:ben@novascaling.ai",
    accent: "#64748b",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function LinksPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1.25rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background effects */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(129,140,248,0.08) 40%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{
          width: "100%",
          maxWidth: "440px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Avatar / Logo */}
        <motion.div variants={item}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow:
                "0 0 40px rgba(56,189,248,0.3), 0 0 80px rgba(129,140,248,0.15)",
            }}
          >
            <TrendingUp size={36} color="#030712" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "0.4rem",
            color: "var(--text-primary)",
          }}
        >
          NovaScaling
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "320px",
            marginBottom: "1.25rem",
          }}
        >
          We fix what&apos;s costing trades business owners time and money.
          Vancouver, BC.
        </motion.p>

        {/* Social icons */}
        <motion.div
          variants={item}
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {s.icon}
            </a>
          ))}
        </motion.div>

        {/* Link cards */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {LINKS.map((link) => (
            <motion.a
              key={link.title}
              variants={item}
              href={link.href}
              target={link.href.startsWith("http") || link.href.startsWith("mailto") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: link.featured ? "1.1rem 1.25rem" : "1rem 1.25rem",
                borderRadius: "16px",
                background: link.featured
                  ? "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.08))"
                  : "rgba(255,255,255,0.03)",
                border: link.featured
                  ? "1px solid rgba(56,189,248,0.25)"
                  : "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                textDecoration: "none",
                color: "inherit",
                position: "relative",
                overflow: "hidden",
              }}
              whileHover={{
                y: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.background = link.featured
                  ? "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.14))"
                  : "rgba(255,255,255,0.06)";
                target.style.borderColor = link.featured
                  ? "rgba(56,189,248,0.4)"
                  : `${link.accent}40`;
                target.style.boxShadow = `0 4px 20px ${link.accent}15`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.background = link.featured
                  ? "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.08))"
                  : "rgba(255,255,255,0.03)";
                target.style.borderColor = link.featured
                  ? "rgba(56,189,248,0.25)"
                  : "rgba(255,255,255,0.06)";
                target.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${link.accent}12`,
                  border: `1px solid ${link.accent}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: link.accent,
                  flexShrink: 0,
                }}
              >
                {link.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.15rem",
                  }}
                >
                  {link.title}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {link.desc}
                </div>
              </div>

              {/* Arrow */}
              <ArrowUpRight
                size={16}
                style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Footer branding */}
        <motion.div
          variants={item}
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 2,
              borderRadius: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />
          <a
            href="https://novascaling.ai"
            style={{
              fontSize: "0.7rem",
              color: "var(--text-tertiary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            novascaling.ai
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
