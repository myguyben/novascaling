"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, Loader2 } from "lucide-react";

const ALLOWED_DOMAIN = "ozioconsulting.com";

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
}

export function AuthGate({ children, title = "Ozio Consulting" }: AuthGateProps) {
  const [state, setState] = useState<"loading" | "login" | "authed" | "denied">("loading");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const userEmail = data.session?.user?.email;
      if (!userEmail) {
        setState("login");
      } else if (userEmail.endsWith(`@${ALLOWED_DOMAIN}`)) {
        setState("authed");
      } else {
        setState("denied");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        setState("login");
      } else if (userEmail.endsWith(`@${ALLOWED_DOMAIN}`)) {
        setState("authed");
      } else {
        setState("denied");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setError(`Only @${ALLOWED_DOMAIN} emails are allowed.`);
      return;
    }

    setSubmitting(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      setSubmitting(false);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess("Account created! You can now sign in.");
        setMode("signin");
        setPassword("");
      }
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (authError) {
        setError(authError.message);
      }
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setState("login");
  }

  if (state === "loading") {
    return (
      <div style={containerStyle}>
        <Loader2 size={24} className="spin" style={{ color: "var(--text-secondary)" }} />
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={iconWrapStyle}>
            <Lock size={20} color="#ef4444" />
          </div>
          <h1 style={headingStyle}>Access Denied</h1>
          <p style={subStyle}>
            This page is restricted to @{ALLOWED_DOMAIN} accounts.
          </p>
          <button onClick={handleSignOut} style={btnSecondaryStyle}>
            Sign out and try a different account
          </button>
        </div>
      </div>
    );
  }

  if (state === "login") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={16} color="#030712" />
            </div>
            <h1 style={headingStyle}>{title}</h1>
          </div>
          <p style={{ ...subStyle, marginBottom: "1.5rem" }}>
            {mode === "signin" ? "Sign in" : "Create an account"} with your @{ALLOWED_DOMAIN} email
          </p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="email"
              placeholder="you@ozioconsulting.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.8rem", margin: 0 }}>{error}</p>
            )}
            {success && (
              <p style={{ color: "#d4a853", fontSize: "0.8rem", margin: 0 }}>{success}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...btnPrimaryStyle,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting ? (mode === "signup" ? "Creating account..." : "Signing in...") : (mode === "signup" ? "Create Account" : "Sign In")}
            </button>
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setSuccess(""); }}
              style={{ background: "none", border: "none", color: "#f59e0b", fontSize: "0.8rem", cursor: "pointer", padding: "0.25rem 0" }}
            >
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  background: "var(--bg-deep)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 400,
  padding: "2rem",
  borderRadius: 24,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "Cormorant Garamond, serif",
  fontWeight: 700,
  fontSize: "1.3rem",
  color: "var(--text-primary)",
  margin: 0,
};

const subStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.85rem",
  margin: 0,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
  color: "var(--text-primary)",
  fontSize: "0.85rem",
  fontFamily: "Inter, sans-serif",
  outline: "none",
};

const btnPrimaryStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #f59e0b, #ea580c)",
  color: "#030712",
  fontWeight: 700,
  fontSize: "0.85rem",
  fontFamily: "Inter, sans-serif",
};

const btnSecondaryStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.6rem 1rem",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
  color: "var(--text-secondary)",
  fontSize: "0.8rem",
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
};

const iconWrapStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 14,
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1rem",
};
