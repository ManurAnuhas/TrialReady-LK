import React, { useState } from "react";
import {
  ChevronLeft,
  Edit3,
  CalendarPlus,
  CreditCard,
  Bell,
  MoreHorizontal,
  Check,
  Clock,
  AlertTriangle,
  MapPin,
  Car,
  User,
  FileText,
  Shield,
  Stethoscope,
  Wallet,
  Sparkles,
  ChevronDown,
  Download,
  Plus,
  TrendingUp,
  Circle,
  BookOpen,
  Activity,
} from "lucide-react";

/* â”€â”€â”€ Stage data â”€â”€â”€ */

const STAGES = [
  { id: 1, label: "Registered", state: "completed" },
  { id: 2, label: "Medical", state: "completed" },
  { id: 3, label: "Theory Training", state: "completed" },
  { id: 4, label: "Written Exam", state: "completed", subLabel: "Passed" },
  { id: 5, label: "Learner Permit", state: "active", subLabel: "Active" },
  { id: 6, label: "Practical Training", state: "current" },
  { id: 7, label: "Trial Eligible", state: "pending" },
  { id: 8, label: "Trial Scheduled", state: "pending" },
  { id: 9, label: "Completed", state: "pending" },
] as const;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "sessions", label: "Sessions" },
  { id: "evaluations", label: "Evaluations" },
  { id: "exam-results", label: "Exam Results" },
  { id: "payments", label: "Payments" },
  { id: "ai", label: "Training Recommendations" },
  { id: "activity", label: "Activity" },
];

/* â”€â”€â”€ Reusable card â”€â”€â”€ */

function InfoCard({
  title,
  icon,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "13px 18px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ color: "#64748B", display: "flex" }}>{icon}</div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", flex: 1 }}>{title}</span>
        {badge}
      </div>
      <div style={{ padding: "14px 18px" }}>{children}</div>
    </div>
  );
}

/* â”€â”€â”€ Info row â”€â”€â”€ */

function InfoRow({
  label,
  value,
  mono,
  valueColor,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 0",
        borderBottom: "1px solid #F8FAFC",
      }}
    >
      <span style={{ fontSize: 13, color: "#64748B", flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          color: valueColor || "#1E293B",
          fontWeight: 500,
          textAlign: "right",
          fontFamily: mono ? "'Courier New', monospace" : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* â”€â”€â”€ Status badge inline â”€â”€â”€ */

function StatusPill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        color,
        background: bg,
      }}
    >
      {label}
    </span>
  );
}

/* â”€â”€â”€ Journey timeline â”€â”€â”€ */

function JourneyTimeline() {
  const PROGRESS = 68;

  const stageStyle = (state: string) => {
    if (state === "completed" || state === "active")
      return { bg: "#16A34A", border: "#16A34A", iconColor: "#ffffff" };
    if (state === "current") return { bg: "#2563EB", border: "#2563EB", iconColor: "#ffffff" };
    return { bg: "#ffffff", border: "#E2E8F0", iconColor: "#94A3B8" };
  };

  const lineColor = (idx: number) => {
    const curr = STAGES[idx];
    const next = STAGES[idx + 1];
    if (!next) return "#E2E8F0";
    if (curr.state === "completed" || curr.state === "active") return "#16A34A";
    return "#E2E8F0";
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "20px 24px 18px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>Licence journey</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
            Stage 6 of 9 Â· Practical Training in progress
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2563EB" }}>{PROGRESS}%</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>Overall progress</div>
        </div>
      </div>

      {/* Stage row */}
      <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 4 }}>
        {STAGES.map((stage, idx) => {
          const style = stageStyle(stage.state);
          return (
            <React.Fragment key={stage.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 72,
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: style.bg,
                    border: `2px solid ${style.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: stage.state === "current" ? "0 0 0 4px #DBEAFE" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {stage.state === "completed" || stage.state === "active" ? (
                    <Check size={13} color={style.iconColor} />
                  ) : stage.state === "current" ? (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#ffffff",
                      }}
                    />
                  ) : (
                    <Circle size={10} color="#CBD5E1" />
                  )}
                </div>

                {/* Label */}
                <div
                  style={{
                    textAlign: "center",
                    maxWidth: 70,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: stage.state === "current" ? 700 : 500,
                      color:
                        stage.state === "current"
                          ? "#2563EB"
                          : stage.state === "completed" || stage.state === "active"
                          ? "#16A34A"
                          : "#94A3B8",
                      lineHeight: 1.3,
                    }}
                  >
                    {stage.label}
                  </div>
                  {"subLabel" in stage && stage.subLabel && (
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: stage.state === "active" ? "#16A34A" : "#64748B",
                        marginTop: 2,
                      }}
                    >
                      {stage.subLabel}
                    </div>
                  )}
                  {stage.state === "current" && (
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#2563EB", marginTop: 2 }}>
                      Current
                    </div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {idx < STAGES.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: lineColor(idx),
                    marginTop: 13,
                    minWidth: 10,
                    transition: "background 0.2s",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "#F1F5F9",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${PROGRESS}%`,
              borderRadius: 3,
              background: "linear-gradient(90deg, #16A34A 0%, #2563EB 100%)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Overview tab â”€â”€â”€ */

function OverviewTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Personal Details */}
      <InfoCard title="Personal details" icon={<User size={15} />}>
        <InfoRow label="NIC" value="2001â€¢â€¢â€¢â€¢5678" mono />
        <InfoRow label="Date of birth" value="16 August 2001" />
        <InfoRow label="Phone" value="+94 77 123 4567" />
        <InfoRow label="Email" value="loshan.mihisara@example.lk" />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0" }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Address</span>
          <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, textAlign: "right" }}>
            Nugegoda, Sri Lanka
          </span>
        </div>
      </InfoCard>

      {/* Training Details */}
      <InfoCard title="Training details" icon={<BookOpen size={15} />}>
        <InfoRow label="Package" value="Standard LV Package" />
        <InfoRow label="Base price" value="LKR 45,000" />
        <InfoRow label="Agreed price" value="LKR 45,000" />
        <InfoRow label="Primary instructor" value="Kasun Silva" />
        <InfoRow label="Registration date" value="05 February 2026" />
      </InfoCard>

      {/* Learner Permit */}
      <InfoCard
        title="Learner permit"
        icon={<Shield size={15} />}
        badge={<StatusPill label="Active" color="#166534" bg="#DCFCE7" />}
      >
        <InfoRow label="Permit number" value="LP-2026-008541" mono />
        <InfoRow label="Issue date" value="05 March 2026" />
        <InfoRow
          label="Expiry date"
          value="05 September 2026"
          valueColor="#F59E0B"
        />
        <InfoRow label="Trial eligible from" value="05 June 2026" />
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              fontSize: 12,
              color: "#1D4ED8",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Clock size={12} />
            Permit expires in 45 days Â· Trial window open
          </div>
        </div>
      </InfoCard>

      {/* Medical Record */}
      <InfoCard
        title="Medical record"
        icon={<Stethoscope size={15} />}
        badge={<StatusPill label="Valid" color="#166534" bg="#DCFCE7" />}
      >
        <InfoRow label="Medical centre" value="Natl. Transport Medical" />
        <InfoRow label="Appointment date" value="15 February 2026" />
        <InfoRow label="Certificate no." value="MED-208541" mono />
        <InfoRow label="Expiry date" value="15 February 2027" />
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              fontSize: 12,
              color: "#16A34A",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Check size={12} />
            Certificate valid for 207 more days
          </div>
        </div>
      </InfoCard>

      {/* Upcoming Session */}
      <InfoCard title="Upcoming session" icon={<CalendarPlus size={15} />}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 9px",
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 600,
                color: "#166534",
                background: "#DCFCE7",
              }}
            >
              <Clock size={10} />
              Practical Training
            </span>
            <span style={{ fontSize: 12, color: "#64748B" }}>Thu, 24 Jul 2026</span>
          </div>
          {[
            { icon: <Clock size={13} />, text: "09:00 AM â€“ 10:00 AM" },
            { icon: <User size={13} />, text: "Kasun Silva" },
            { icon: <Car size={13} />, text: "BAA-4521" },
            { icon: <MapPin size={13} />, text: "Route A â€“ Nugegoda" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                color: "#475569",
                marginBottom: 5,
              }}
            >
              <span style={{ color: "#94A3B8", display: "flex" }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Payment Summary */}
      <InfoCard title="Payment summary" icon={<Wallet size={15} />}>
        <InfoRow label="Agreed price" value="LKR 45,000" />
        <InfoRow label="Total paid" value="LKR 32,500" valueColor="#16A34A" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "7px 0",
          }}
        >
          <span style={{ fontSize: 13, color: "#64748B" }}>Remaining balance</span>
          <span
            style={{
              fontSize: 14,
              color: "#F59E0B",
              fontWeight: 700,
            }}
          >
            LKR 12,500
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div
            style={{ height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden", marginBottom: 5 }}
          >
            <div
              style={{
                height: "100%",
                width: `${(32500 / 45000) * 100}%`,
                borderRadius: 3,
                background: "#16A34A",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#94A3B8",
            }}
          >
            <span>LKR 32,500 paid</span>
            <span>72%</span>
          </div>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: "100%",
            height: 36,
            marginTop: 12,
            borderRadius: 7,
            border: "1.5px solid #E2E8F0",
            background: "#ffffff",
            color: "#475569",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Plus size={13} />
          Record payment
        </button>
      </InfoCard>

      {/* Training recommendation â€“ full width */}
      <div style={{ gridColumn: "1 / -1" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%)",
            border: "1px solid #C4B5FD",
            borderRadius: 12,
            padding: "18px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>
                  Latest approved recommendation
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 5,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#7C3AED",
                    background: "#EDE9FE",
                    border: "1px solid #C4B5FD",
                  }}
                >
                  Reviewed and approved by Kasun Silva
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 1.65,
                  margin: "0 0 6px",
                  fontStyle: "italic",
                }}
              >
                "Improve reverse-parking accuracy and junction observation before the final trial. Student performs
                well on open roads but hesitates at busy intersections. Recommend two additional focused sessions on
                junction navigation before scheduling the trial."
              </p>
              <div style={{ fontSize: 12, color: "#64748B" }}>Generated 18 Jul 2026 Â· Next review due 25 Jul 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Sessions tab (basic) â”€â”€â”€ */

const SESSION_DATA = [
  { date: "24 Jul 2026", type: "Practical Training", instructor: "Kasun Silva", vehicle: "BAA-4521", status: "upcoming", duration: "1 hr" },
  { date: "22 Jul 2026", type: "Practical Training", instructor: "Kasun Silva", vehicle: "BAA-4521", status: "completed", duration: "1 hr" },
  { date: "17 Jul 2026", type: "Practical Training", instructor: "Kasun Silva", vehicle: "BAA-4521", status: "completed", duration: "1.5 hrs" },
  { date: "12 Jul 2026", type: "Practical Training", instructor: "Kasun Silva", vehicle: "CAG-8820", status: "completed", duration: "1 hr" },
  { date: "05 Jul 2026", type: "Practical Training", instructor: "Kasun Silva", vehicle: "BAA-4521", status: "completed", duration: "1 hr" },
  { date: "28 Jun 2026", type: "Theory Class", instructor: "Kasun Silva", vehicle: "â€”", status: "completed", duration: "2 hrs" },
];

function SessionsTab() {
  return (
    <div
      style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}
    >
      <div
        style={{
          padding: "13px 18px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Session history</span>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 7,
            border: "1.5px solid #E2E8F0",
            background: "#ffffff",
            color: "#64748B",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Download size={12} />
          Export
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Date", "Type", "Instructor", "Vehicle", "Duration", "Status"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "9px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "left",
                  background: "#F8FAFC",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SESSION_DATA.map((s, i) => (
            <tr
              key={i}
              style={{ borderTop: i > 0 ? "1px solid #F8FAFC" : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "11px 16px", fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{s.date}</td>
              <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569" }}>{s.type}</td>
              <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569" }}>{s.instructor}</td>
              <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569", fontFamily: "monospace" }}>{s.vehicle}</td>
              <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569" }}>{s.duration}</td>
              <td style={{ padding: "11px 16px" }}>
                <span
                  style={{
                    padding: "3px 9px",
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: s.status === "upcoming" ? "#1D4ED8" : "#166534",
                    background: s.status === "upcoming" ? "#DBEAFE" : "#DCFCE7",
                  }}
                >
                  {s.status === "upcoming" ? "Upcoming" : "Completed"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* â”€â”€â”€ Payments tab â”€â”€â”€ */

const PAYMENT_DATA = [
  { date: "05 Feb 2026", description: "Registration & initial payment", amount: 15000, method: "Cash", receipt: "RCP-0241" },
  { date: "10 Mar 2026", description: "Instalment 2", amount: 10000, method: "Bank Transfer", receipt: "RCP-0289" },
  { date: "15 Apr 2026", description: "Instalment 3", amount: 7500, method: "Cash", receipt: "RCP-0312" },
];

function PaymentsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {[
          { label: "Agreed price", value: "LKR 45,000", color: "#1E293B" },
          { label: "Total paid", value: "LKR 32,500", color: "#16A34A" },
          { label: "Remaining", value: "LKR 12,500", color: "#F59E0B" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: "14px 18px",
            }}
          >
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div
        style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}
      >
        <div
          style={{
            padding: "13px 18px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Payment history</span>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 7,
              border: "none",
              background: "#2563EB",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Plus size={12} />
            Record payment
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Date", "Description", "Amount", "Method", "Receipt"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "9px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    textAlign: "left",
                    background: "#F8FAFC",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENT_DATA.map((p, i) => (
              <tr key={i} style={{ borderTop: i > 0 ? "1px solid #F8FAFC" : "none" }}>
                <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569" }}>{p.date}</td>
                <td style={{ padding: "11px 16px", fontSize: 13, color: "#1E293B" }}>{p.description}</td>
                <td style={{ padding: "11px 16px", fontSize: 13, color: "#16A34A", fontWeight: 600 }}>
                  LKR {p.amount.toLocaleString()}
                </td>
                <td style={{ padding: "11px 16px", fontSize: 13, color: "#475569" }}>{p.method}</td>
                <td style={{ padding: "11px 16px", fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>
                  {p.receipt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid #E2E8F0",
            background: "#F8FAFC",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 13, color: "#64748B" }}>Next payment due: 31 July 2026</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>LKR 12,500 remaining</span>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Training Recommendations tab â”€â”€â”€ */

const AI_RECS = [
  {
    confidence: 94,
    approved: true,
    approvedBy: "Kasun Silva",
    date: "18 Jul 2026",
    category: "Practical skills",
    rec: "Improve reverse-parking accuracy and junction observation before the final trial. Student performs well on open roads but hesitates at busy intersections. Recommend two additional focused sessions on junction navigation.",
  },
  {
    confidence: 88,
    approved: true,
    approvedBy: "Kasun Silva",
    date: "05 Jul 2026",
    category: "Theory knowledge",
    rec: "Review road-sign recognition â€” particularly temporary construction signs and lane-closure signals. Performance in theory mock tests shows a consistent 8% gap in this specific area.",
  },
  {
    confidence: 79,
    approved: false,
    approvedBy: null,
    date: "25 Jun 2026",
    category: "Trial readiness",
    rec: "Student is approaching trial readiness. Suggest scheduling mock trial session before the official attempt to build confidence. Anxiety indicators are observed during lane-change manoeuvres at high speed.",
  },
];

function AITab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {AI_RECS.map((rec, i) => (
        <div
          key={i}
          style={{
            background: "#ffffff",
            border: `1px solid ${rec.approved ? "#C4B5FD" : "#E2E8F0"}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "13px 18px",
              borderBottom: `1px solid ${rec.approved ? "#EDE9FE" : "#F1F5F9"}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: rec.approved ? "#FAFBFF" : "#FAFBFC",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={15} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{rec.category}</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>{rec.date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  borderRadius: 5,
                  background: "#F1F5F9",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                <TrendingUp size={10} />
                {rec.confidence}% confidence
              </div>
              {rec.approved ? (
                <span
                  style={{
                    padding: "3px 9px",
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#7C3AED",
                    background: "#EDE9FE",
                  }}
                >
                  Approved Â· {rec.approvedBy}
                </span>
              ) : (
                <span
                  style={{
                    padding: "3px 9px",
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#F59E0B",
                    background: "#FEF3C7",
                  }}
                >
                  Pending review
                </span>
              )}
            </div>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
              "{rec.rec}"
            </p>
            {!rec.approved && (
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  style={{
                    padding: "7px 14px",
                    borderRadius: 7,
                    border: "none",
                    background: "#7C3AED",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Approve
                </button>
                <button
                  style={{
                    padding: "7px 14px",
                    borderRadius: 7,
                    border: "1px solid #E2E8F0",
                    background: "#ffffff",
                    color: "#64748B",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* â”€â”€â”€ More actions dropdown â”€â”€â”€ */

function MoreActionsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 38,
          padding: "0 14px",
          borderRadius: 8,
          border: "1.5px solid #E2E8F0",
          background: "#ffffff",
          color: "#475569",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <MoreHorizontal size={15} />
        More
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 4px)",
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              zIndex: 50,
              minWidth: 180,
              padding: 4,
            }}
          >
            {["Download student record", "Print profile", "Transfer instructor", "Archive student", "Delete record"].map(
              (item, i) => (
                <button
                  key={item}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 7,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    color: i === 4 ? "#DC2626" : "#1E293B",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = i === 4 ? "#FEF2F2" : "#F8FAFC")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* â”€â”€â”€ Main export â”€â”€â”€ */

export function StudentProfile({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      {/* Breadcrumb + back */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            height: 34,
            padding: "0 12px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            background: "#ffffff",
            color: "#64748B",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <ChevronLeft size={14} />
          Students
        </button>
        <span style={{ color: "#CBD5E1", fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: "#64748B" }}>Loshan Mihisara</span>
        <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "monospace", marginLeft: 4 }}>
          STD-2026-0048
        </span>
      </div>

      {/* Profile header */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: "22px 24px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #DBEAFE, #EDE9FE)",
            border: "3px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
            color: "#2563EB",
            flexShrink: 0,
          }}
        >
          KP
        </div>

        {/* Name + badges */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>
              Loshan Mihisara
            </h1>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#166534",
                background: "#DCFCE7",
              }}
            >
              Active
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                color: "#64748B",
                fontFamily: "monospace",
                background: "#F1F5F9",
                padding: "2px 8px",
                borderRadius: 5,
              }}
            >
              STD-2026-0048
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 500,
                color: "#1D4ED8",
                background: "#DBEAFE",
              }}
            >
              Light Vehicle
            </span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Â·</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>Instructor: Kasun Silva</span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Â·</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>Registered 05 Feb 2026</span>
          </div>
        </div>

        {/* Header actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Edit3 size={14} />
            Edit profile
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <CalendarPlus size={14} />
            Schedule session
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <CreditCard size={14} />
            Record payment
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Bell size={14} />
            Notify
          </button>
          <MoreActionsMenu />
        </div>
      </div>

      {/* Journey timeline */}
      <JourneyTimeline />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #E2E8F0",
          marginBottom: 18,
          gap: 0,
          background: "#ffffff",
          borderRadius: "12px 12px 0 0",
          border: "1px solid #E2E8F0",
          borderBottomWidth: 0,
          padding: "0 4px",
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "12px 14px",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#2563EB" : "#64748B",
              borderBottom: `2px solid ${activeTab === tab.id ? "#2563EB" : "transparent"}`,
              marginBottom: -1,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "sessions" && <SessionsTab />}
      {activeTab === "payments" && <PaymentsTab />}
      {activeTab === "ai" && <AITab />}
      {(activeTab === "documents" ||
        activeTab === "evaluations" ||
        activeTab === "exam-results" ||
        activeTab === "activity") && (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <FileText size={22} color="#94A3B8" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
            {TABS.find((t) => t.id === activeTab)?.label}
          </div>
          <div style={{ fontSize: 13, color: "#64748B" }}>
            Additional records will be available after the relevant documents are added.
          </div>
        </div>
      )}
    </div>
  );
}

