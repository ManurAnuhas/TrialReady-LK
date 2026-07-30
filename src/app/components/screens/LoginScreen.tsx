import React, { useState, useRef } from "react";
import { Eye, EyeOff, Check, Loader2, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import type { Role } from "../shell/Sidebar";
import { BrandMark } from "../shell/BrandMark";

/* â”€â”€â”€ demo accounts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const DEMO_ACCOUNTS = [
  {
    role: "admin" as Role,
    name: "Manura Anuhas",
    title: "Administrator",
    email: "admin@metrodrive.lk",
    password: "demo123",
    initials: "MA",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    role: "instructor" as Role,
    name: "Kasun Silva",
    title: "Instructor",
    email: "instructor@metrodrive.lk",
    password: "demo123",
    initials: "KS",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    role: "student" as Role,
    name: "Loshan Mihisara",
    title: "Student",
    email: "student@metrodrive.lk",
    password: "demo123",
    initials: "LM",
    color: "#0284C7",
    bg: "#E0F2FE",
  },
] as const;

type LoginState = "idle" | "loading" | "error" | "success";

interface LoginScreenProps {
  onLogin: () => void;
}

/* â”€â”€â”€ Journey Illustration SVG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function JourneyIllustration() {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 400 }}>
      {/* Glow circles */}
      <circle cx="360" cy="60" r="100" fill="rgba(37,99,235,0.07)" />
      <circle cx="60" cy="280" r="70" fill="rgba(37,99,235,0.06)" />
      <circle cx="200" cy="170" r="140" fill="rgba(255,255,255,0.025)" />

      {/* Road track */}
      <path d="M 80 310 Q 140 240 185 180 Q 230 120 300 65" stroke="rgba(255,255,255,0.07)" strokeWidth="48" strokeLinecap="round" fill="none" />
      {/* Road surface */}
      <path d="M 80 310 Q 140 240 185 180 Q 230 120 300 65" stroke="rgba(255,255,255,0.04)" strokeWidth="44" strokeLinecap="round" fill="none" />
      {/* Road centre line */}
      <path d="M 80 310 Q 140 240 185 180 Q 230 120 300 65" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="14 11" fill="none" />

      {/* Stage milestone 1 â€” Registered */}
      <circle cx="88" cy="302" r="14" fill="#0F172A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="88" cy="302" r="8" fill="#94A3B8" />
      <circle cx="88" cy="302" r="4" fill="#ffffff" />

      {/* Stage milestone 2 â€” Theory */}
      <circle cx="160" cy="218" r="14" fill="#0F172A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="160" cy="218" r="8" fill="#0284C7" />
      <circle cx="160" cy="218" r="4" fill="#ffffff" />

      {/* Stage milestone 3 â€” Practical */}
      <circle cx="220" cy="148" r="14" fill="#0F172A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="220" cy="148" r="8" fill="#7C3AED" />
      <circle cx="220" cy="148" r="4" fill="#ffffff" />

      {/* Stage milestone 4 â€” Trial Ready */}
      <circle cx="296" cy="72" r="18" fill="#16A34A" opacity="0.95" />
      <circle cx="296" cy="72" r="10" fill="#ffffff" opacity="0.9" />
      {/* checkmark at milestone 4 */}
      <path d="M 291 72 L 294 75 L 301 68" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stage labels */}
      <text x="44" y="328" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="500">Enrolled</text>
      <text x="113" y="238" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="500">Theory</text>
      <text x="238" y="153" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="500">Practical</text>
      <text x="315" y="68" fill="#4ADE80" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="600">Trial ready</text>

      {/* Car â€” simplified side silhouette */}
      <g transform="translate(175, 190) rotate(-38)">
        <rect x="-22" y="-9" width="44" height="17" rx="4" fill="#2563EB" />
        <rect x="-12" y="-17" width="24" height="10" rx="3" fill="#60A5FA" />
        <rect x="-6" y="-17" width="12" height="7" rx="1" fill="rgba(255,255,255,0.35)" />
        <circle cx="-14" cy="9" r="6" fill="#1E293B" />
        <circle cx="14" cy="9" r="6" fill="#1E293B" />
        <circle cx="-14" cy="9" r="2.5" fill="#64748B" />
        <circle cx="14" cy="9" r="2.5" fill="#64748B" />
        {/* Headlight */}
        <rect x="19" y="-4" width="5" height="3" rx="1.5" fill="#FEF3C7" opacity="0.9" />
      </g>

      {/* Floating info card 1 â€” top right */}
      <rect x="308" y="100" width="100" height="46" rx="8" fill="rgba(30,41,59,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="323" cy="116" r="7" fill="#2563EB" opacity="0.9" />
      <rect x="335" y="110" width="52" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="335" y="118" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      <rect x="313" y="128" width="85" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
      <rect x="313" y="135" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />

      {/* Floating info card 2 â€” middle left */}
      <rect x="10" y="180" width="95" height="42" rx="8" fill="rgba(30,41,59,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="20" y="191" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.45)" />
      <rect x="20" y="198" width="35" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      <rect x="20" y="208" width="65" height="5" rx="2.5" fill="#2563EB" opacity="0.6" />

      {/* Sparkles */}
      <path d="M 340 160 L 342 152 L 344 160 L 352 162 L 344 164 L 342 172 L 340 164 L 332 162 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M 50 120 L 51.5 114 L 53 120 L 59 121.5 L 53 123 L 51.5 129 L 50 123 L 44 121.5 Z" fill="rgba(255,255,255,0.15)" />
      <circle cx="380" cy="220" r="3" fill="rgba(255,255,255,0.15)" />
      <circle cx="30" cy="80" r="2.5" fill="rgba(255,255,255,0.12)" />
      <circle cx="120" cy="60" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="370" cy="290" r="2" fill="rgba(255,255,255,0.1)" />

      {/* Road ahead â€” dotted suggestion */}
      <path d="M 296 52 Q 320 30 350 15" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 8" fill="none" />
    </svg>
  );
}

/* â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleDemoSelect = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setLoginState("idle");
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter your email and password.");
      setLoginState("error");
      return;
    }
    setLoginState("loading");
    setErrorMsg("");

    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        (a) => a.email === email.trim().toLowerCase() && a.password === password
      );
      if (match) {
        setLoginState("success");
        if (match.role === "admin") {
          setTimeout(() => onLogin(), 900);
        } else {
          setLoginState("error");
          setErrorMsg("This account is not available in the current submission.");
        }
      } else {
        setLoginState("error");
        setErrorMsg("Incorrect email or password. Select an account below and try again.");
      }
    }, 1600);
  };

  const inputStyle = (field: string, hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    height: 48,
    borderRadius: 8,
    border: `1.5px solid ${
      hasError && loginState === "error"
        ? "#DC2626"
        : focusedField === field
        ? "#2563EB"
        : "#E2E8F0"
    }`,
    background: "#F8FAFC",
    padding: "0 44px 0 14px",
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
    boxShadow:
      focusedField === field && !(hasError && loginState === "error")
        ? "0 0 0 3px rgba(37,99,235,0.12)"
        : hasError && loginState === "error" && focusedField === field
        ? "0 0 0 3px rgba(220,38,38,0.12)"
        : "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* â”€â”€ Left panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        style={{
          flex: "0 0 48%",
          background: "linear-gradient(145deg, #0F172A 0%, #0F2563 60%, #0F172A 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "40px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <BrandMark tone="light" />
        </div>

        {/* Illustration */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, marginTop: 24 }}>
          <JourneyIllustration />
        </div>

        {/* Headline + copy */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.35,
              margin: "0 0 14px",
              letterSpacing: "-0.02em",
            }}
          >
            Manage every learner's journey from registration to trial readiness.
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
            A smarter driving-school management platform designed for Sri Lanka.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Track every licence stage",
              "Schedule instructors and vehicles",
              "Review learner progress and trial readiness",
            ].map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: "rgba(37,99,235,0.25)",
                    border: "1px solid rgba(37,99,235,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} color="#60A5FA" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 400 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ Right panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        style={{
          flex: 1,
          background: "#F8FAFC",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Centered content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 52px",
            maxWidth: 520,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Login card */}
          <div
            style={{
              width: "100%",
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: "36px 36px 32px",
              boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
                Sign in to your TrialReady LK account
              </p>
            </div>

            {/* Success state overlay */}
            {loginState === "success" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 0",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#DCFCE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={28} color="#16A34A" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#16A34A" }}>Sign-in successful!</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Redirecting to your dashboardâ€¦</div>
              </div>
            )}

            {loginState !== "success" && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>Email address</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setLoginState("idle"); }}
                      placeholder="you@metrodrive.lk"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle("email", true), paddingLeft: 14, paddingRight: 14 }}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotSent(!forgotSent)}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: forgotSent ? "#16A34A" : "#2563EB",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {forgotSent ? "âœ“ Reset link sent" : "Forgot password?"}
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginState("idle"); }}
                      placeholder="Enter your password"
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle("password", true), paddingLeft: 14 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#94A3B8",
                        display: "flex",
                        padding: 4,
                      }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      border: `2px solid ${rememberMe ? "#2563EB" : "#CBD5E1"}`,
                      background: rememberMe ? "#2563EB" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}
                  >
                    {rememberMe && <Check size={12} color="#ffffff" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 400 }}>Remember me for 30 days</span>
                </label>

                {/* Error message */}
                {loginState === "error" && errorMsg && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "10px 12px",
                      background: "#FEE2E2",
                      border: "1px solid #FECACA",
                      borderRadius: 8,
                    }}
                  >
                    <AlertCircle size={15} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.5 }}>{errorMsg}</span>
                  </div>
                )}

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={loginState === "loading"}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    border: "none",
                    background: loginState === "loading" ? "#93C5FD" : "#2563EB",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: loginState === "loading" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "background 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (loginState !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.background = "#1D4ED8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (loginState !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.background = "#2563EB";
                    }
                  }}
                >
                  {loginState === "loading" ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Signing inâ€¦
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Demo accounts */}
          <div style={{ width: "100%", marginTop: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#94A3B8",
                  whiteSpace: "nowrap",
                }}
              >
                <Shield size={12} />
                Quick access â€” demo accounts
              </div>
              <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected = email === acc.email;
                return (
                  <button
                    key={acc.role}
                    onClick={() => handleDemoSelect(acc)}
                    style={{
                      padding: "14px 12px",
                      borderRadius: 10,
                      border: `1.5px solid ${isSelected ? acc.color : "#E2E8F0"}`,
                      background: isSelected ? acc.bg + "60" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = acc.color + "80";
                        (e.currentTarget as HTMLButtonElement).style.background = acc.bg + "30";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                        (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: acc.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: acc.color,
                        }}
                      >
                        {acc.initials}
                      </div>
                      {isSelected && <Check size={14} color={acc.color} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: acc.color, fontWeight: 500, marginTop: 1 }}>{acc.title}</div>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3, wordBreak: "break-all" }}>{acc.email}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 10 }}>
              Select an account to fill the login details. Password: <strong style={{ color: "#64748B" }}>demo123</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 40px",
            borderTop: "1px solid #F1F5F9",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            Â© 2026 TrialReady LK. All rights reserved.
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

