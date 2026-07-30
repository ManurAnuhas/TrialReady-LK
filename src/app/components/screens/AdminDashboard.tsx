import React, { useState, useEffect } from "react";
import {
  Users, UserCheck, Calendar, Award, CreditCard, FileText,
  UserPlus, CalendarPlus, Wallet, TrendingUp, TrendingDown,
  AlertTriangle, Clock, CheckCircle2, Activity, ArrowRight,
  Car, MapPin, MoreVertical, Sparkles, Bell, RefreshCw,
  ChevronRight, Download,
} from "lucide-react";

/* â”€â”€â”€ Skeleton components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function SkeletonBox({ width, height, radius = 6, style = {} }: { width?: number | string; height: number; radius?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ width: width ?? "100%", height, borderRadius: radius, background: "#F1F5F9", animation: "dashPulse 1.5s ease-in-out infinite", ...style }} />
  );
}

function MetricCardSkeleton() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 22px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <SkeletonBox width={44} height={44} radius={10} />
        <SkeletonBox width={60} height={22} radius={5} />
      </div>
      <SkeletonBox width={80} height={30} radius={4} style={{ marginBottom: 8 }} />
      <SkeletonBox width="70%" height={14} radius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width="50%" height={12} radius={4} />
    </div>
  );
}

/* â”€â”€â”€ colour helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 5,
        background: bg,
        fontSize: 11,
        fontWeight: 500,
        color,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

/* â”€â”€â”€ Metric card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function MetricCard({
  label,
  value,
  sub,
  icon,
  accent,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "22px 22px 18px",
        boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: "default",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(15,23,42,0.09)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(15,23,42,0.05)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: accent + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 12,
              fontWeight: 500,
              color: trendUp ? "#16A34A" : "#DC2626",
              background: trendUp ? "#DCFCE7" : "#FEE2E2",
              padding: "3px 8px",
              borderRadius: 5,
            }}
          >
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#1E293B", lineHeight: 1, marginBottom: 5 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 12, color: "#94A3B8" }}>{sub}</div>
    </div>
  );
}

/* â”€â”€â”€ Quick Action button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function QuickAction({
  icon,
  label,
  color,
  bg,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 48,
        padding: "0 18px",
        borderRadius: 10,
        border: `1.5px solid ${hov ? color : color + "40"}`,
        background: hov ? bg : bg + "70",
        cursor: "pointer",
        color,
        fontSize: 14,
        fontWeight: 600,
        transition: "all 0.15s",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      {label}
    </button>
  );
}

/* â”€â”€â”€ Schedule table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const scheduleRows = [
  {
    time: "08:30 AM",
    type: "Practical training",
    student: "Loshan Mihisara",
    instructor: "Kasun Silva",
    vehicle: "BAA-4521 Â· Suzuki Alto",
    location: "Training Yard A",
    status: { label: "Confirmed", color: "#16A34A", bg: "#DCFCE7" },
  },
  {
    time: "10:00 AM",
    type: "Theory class",
    student: "Group A â€” 12 students",
    instructor: "Malini Fernando",
    vehicle: "Not required",
    location: "Room 03",
    status: { label: "Scheduled", color: "#0284C7", bg: "#E0F2FE" },
  },
  {
    time: "01:30 PM",
    type: "Trial preparation",
    student: "Ravishka Rathnayake",
    instructor: "Kasun Silva",
    vehicle: "CAG-8820 Â· Toyota Aqua",
    location: "Werahera route",
    status: { label: "Confirmed", color: "#16A34A", bg: "#DCFCE7" },
  },
];

function ScheduleTable({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 14px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B", margin: "0 0 2px" }}>Today's schedule</h3>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Wednesday, 22 July 2026 Â· 3 sessions</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onToast("Downloading schedule PDFâ€¦", "info")}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 7,
              border: "1px solid #E2E8F0",
              background: "transparent",
              color: "#475569",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "inherit",
            }}
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => onToast("Session scheduled", "success")}
            style={{
              height: 34,
              padding: "0 14px",
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
            + Add session
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Time", "Session", "Student / group", "Instructor", "Vehicle", "Location", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#64748B",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row, i) => (
              <tr
                key={row.time}
                style={{ borderBottom: i < scheduleRows.length - 1 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "#FAFBFD"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "16px 14px", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Clock size={13} color="#94A3B8" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{row.time}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 14px" }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#1E293B",
                      background: "#F8FAFC",
                      padding: "3px 8px",
                      borderRadius: 5,
                      border: "1px solid #E2E8F0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.type}
                  </span>
                </td>
                <td style={{ padding: "16px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#DBEAFE",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2563EB",
                        flexShrink: 0,
                      }}
                    >
                      {row.student.startsWith("Group") ? "G" : row.student.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, whiteSpace: "nowrap" }}>{row.student}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 14px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>{row.instructor}</td>
                <td style={{ padding: "16px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B", whiteSpace: "nowrap" }}>
                    {row.vehicle !== "Not required" && <Car size={12} color="#94A3B8" />}
                    {row.vehicle}
                  </div>
                </td>
                <td style={{ padding: "16px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B", whiteSpace: "nowrap" }}>
                    <MapPin size={12} color="#94A3B8" />
                    {row.location}
                  </div>
                </td>
                <td style={{ padding: "16px 14px" }}>
                  <Badge {...row.status} />
                </td>
                <td style={{ padding: "16px 14px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => onToast(`Viewing ${row.student}'s session`, "info")}
                      style={{
                        height: 30,
                        padding: "0 10px",
                        borderRadius: 6,
                        border: "1px solid #E2E8F0",
                        background: "transparent",
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#475569",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => onToast(`${row.student}'s session updated`, "success")}
                      style={{
                        height: 30,
                        padding: "0 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "#EFF6FF",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#2563EB",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "#94A3B8" }}>3 of 27 sessions shown for today</span>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 500,
            color: "#2563EB",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          View full calendar <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Student Journey Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const journeyStages = [
  { stage: "Registered", count: 34, color: "#94A3B8", bg: "#F1F5F9" },
  { stage: "Medical pending", count: 18, color: "#F59E0B", bg: "#FEF3C7" },
  { stage: "Theory training", count: 47, color: "#0284C7", bg: "#E0F2FE" },
  { stage: "Learner permit active", count: 63, color: "#2563EB", bg: "#DBEAFE" },
  { stage: "Practical training", count: 52, color: "#7C3AED", bg: "#EDE9FE" },
  { stage: "Trial eligible", count: 21, color: "#16A34A", bg: "#DCFCE7" },
  { stage: "Completed", count: 13, color: "#22C55E", bg: "#F0FDF4" },
];

const total = journeyStages.reduce((s, x) => s + x.count, 0);

function JourneyOverview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "22px 24px",
        boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
            Student journey overview
          </h3>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
            {total} students across all licence stages
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color: "#16A34A",
            fontWeight: 500,
          }}
        >
          <TrendingUp size={13} />
          <span>+12 this month</span>
        </div>
      </div>

      {/* Segmented bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", gap: 2 }}>
          {journeyStages.map((s) => (
            <div
              key={s.stage}
              title={`${s.stage}: ${s.count}`}
              style={{
                flex: s.count,
                background: s.color,
                borderRadius: 2,
                transition: "flex 0.5s",
                cursor: "default",
              }}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {journeyStages.map((s) => {
          const pct = Math.round((s.count / total) * 100);
          return (
            <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Label */}
              <div
                style={{
                  minWidth: 168,
                  fontSize: 13,
                  color: "#475569",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: s.color,
                    flexShrink: 0,
                  }}
                />
                {s.stage}
              </div>
              {/* Bar */}
              <div
                style={{
                  flex: 1,
                  height: 20,
                  background: "#F8FAFC",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #F1F5F9",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: s.color,
                    borderRadius: 4,
                    transition: "width 0.6s ease",
                    opacity: 0.85,
                  }}
                />
              </div>
              {/* Count */}
              <div
                style={{
                  minWidth: 24,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1E293B",
                  textAlign: "right",
                }}
              >
                {s.count}
              </div>
              {/* Pct */}
              <div
                style={{
                  minWidth: 36,
                  fontSize: 11,
                  color: "#94A3B8",
                  textAlign: "right",
                }}
              >
                {pct}%
              </div>
              {/* Badge */}
              <div
                style={{
                  minWidth: 28,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: s.bg,
                    color: s.color,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {s.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #F1F5F9", textAlign: "right" }}>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 500,
            color: "#2563EB",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          View detailed report <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Alerts & Reminders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const alertItems = [
  { icon: <FileText size={14} />, text: "5 learner permits expire this week", type: "warning", action: "Review" },
  { icon: <Users size={14} />, text: "8 students have missing documents", type: "error", action: "View" },
  { icon: <CreditCard size={14} />, text: "4 payments are overdue", type: "error", action: "Collect" },
  { icon: <Car size={14} />, text: "3 vehicles require maintenance", type: "warning", action: "Schedule" },
  { icon: <Sparkles size={14} />, text: "6 training recommendations await approval", type: "info", action: "Review" },
];

const alertCfg = {
  warning: { color: "#F59E0B", bg: "#FEF3C7", dot: "#F59E0B" },
  error: { color: "#DC2626", bg: "#FEE2E2", dot: "#DC2626" },
  info: { color: "#0284C7", bg: "#E0F2FE", dot: "#0284C7" },
};

function AlertsPanel({ onToast }: { onToast: (msg: string, type?: string) => void }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          padding: "16px 18px 12px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={14} color="#F59E0B" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: 0 }}>Alerts & reminders</h3>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#FEE2E2",
            color: "#DC2626",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {alertItems.length}
        </span>
      </div>

      <div style={{ padding: "8px 0" }}>
        {alertItems.map((item, i) => {
          const cfg = alertCfg[item.type as keyof typeof alertCfg];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 18px",
                borderBottom: i < alertItems.length - 1 ? "1px solid #F8FAFC" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#FAFBFD"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: cfg.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cfg.color,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <span style={{ flex: 1, fontSize: 13, color: "#475569", lineHeight: 1.4 }}>{item.text}</span>
              <button
                onClick={() => onToast(`${item.action}: ${item.text.toLowerCase()}`, item.type === "info" ? "info" : "warning")}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: cfg.color,
                  background: cfg.bg,
                  border: "none",
                  borderRadius: 5,
                  padding: "4px 10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {item.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* â”€â”€â”€ Recent Activity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const activityItems = [
  {
    icon: <CreditCard size={14} />,
    text: "Payment recorded for Loshan Mihisara",
    detail: "LKR 5,500 Â· Session fee",
    time: "10 min ago",
    color: "#16A34A",
    bg: "#DCFCE7",
    initials: "MA",
  },
  {
    icon: <Award size={14} />,
    text: "Written examination passed by Ravishka Rathnayake",
    detail: "Score: 88/100",
    time: "1 hour ago",
    color: "#0284C7",
    bg: "#E0F2FE",
    initials: "MF",
  },
  {
    icon: <UserPlus size={14} />,
    text: "Lasindu Dilshan registered",
    detail: "30-hour package Â· Manual",
    time: "2 hours ago",
    color: "#7C3AED",
    bg: "#EDE9FE",
    initials: "MA",
  },
  {
    icon: <CheckCircle2 size={14} />,
    text: "Recommendation approved by Kasun Silva",
    detail: "For Nethmi Wijesinghe Â· Trial exam",
    time: "Yesterday",
    color: "#2563EB",
    bg: "#DBEAFE",
    initials: "KS",
  },
];

function RecentActivity() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          padding: "16px 18px 12px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={14} color="#2563EB" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: 0 }}>Recent activity</h3>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 500,
            color: "#64748B",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div style={{ padding: "4px 0" }}>
        {activityItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 18px",
              borderBottom: i < activityItems.length - 1 ? "1px solid #F8FAFC" : "none",
              alignItems: "flex-start",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#FAFBFD"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.color,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.4, fontWeight: 500 }}>{item.text}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{item.detail}</div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94A3B8",
                whiteSpace: "nowrap",
                marginTop: 2,
                flexShrink: 0,
              }}
            >
              {item.time}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid #F1F5F9",
          textAlign: "center",
        }}
      >
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 500,
            color: "#2563EB",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          View all activity <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface ToastItem { id: number; msg: string; type: string; }

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  const cfg: Record<string, { color: string; bg: string; border: string }> = {
    success: { color: "#16A34A", bg: "#DCFCE7", border: "#BBF7D0" },
    error: { color: "#DC2626", bg: "#FEE2E2", border: "#FECACA" },
    warning: { color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A" },
    info: { color: "#0284C7", bg: "#E0F2FE", border: "#BAE6FD" },
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999, maxWidth: 340 }}>
      {toasts.map((t) => {
        const c = cfg[t.type] ?? cfg.info;
        return (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 10,
              background: c.bg,
              border: `1px solid ${c.border}`,
              boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
              fontSize: 13,
              fontWeight: 500,
              color: c.color,
              animation: "slideIn 0.2s ease",
            }}
          >
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{t.msg}</span>
            <button
              onClick={() => onDismiss(t.id)}
              style={{ border: "none", background: "none", cursor: "pointer", color: c.color, display: "flex", padding: 0, fontSize: 16 }}
            >
              Ã—
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* â”€â”€â”€ Main dashboard export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function AdminDashboard({ onNavigate }: { onNavigate?: (nav: string) => void }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const pushToast = (msg: string, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dashPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* â”€â”€ Welcome banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 9px",
                borderRadius: 5,
                background: "#DCFCE7",
                fontSize: 11,
                fontWeight: 600,
                color: "#16A34A",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", animation: "pulse 2s infinite" }} />
              System active Â· 22 July 2026
            </div>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1E293B", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Administrator dashboard
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>
            Good morning, Manura. Here is today's driving-school overview.
          </p>
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
          <QuickAction
            icon={<UserPlus size={16} />}
            label="Register student"
            color="#2563EB"
            bg="#DBEAFE"
            onClick={() => onNavigate?.("Students")}
          />
          <QuickAction
            icon={<CalendarPlus size={16} />}
            label="Schedule session"
            color="#7C3AED"
            bg="#EDE9FE"
            onClick={() => onNavigate?.("Calendar")}
          />
          <QuickAction
            icon={<Wallet size={16} />}
            label="Record payment"
            color="#16A34A"
            bg="#DCFCE7"
            onClick={() => onNavigate?.("Payments")}
          />
          <QuickAction
            icon={<UserCheck size={16} />}
            label="Add instructor"
            color="#0284C7"
            bg="#E0F2FE"
            onClick={() => onNavigate?.("Instructors")}
          />
        </div>
      </div>

      {/* â”€â”€ Metric cards 3 Ã— 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              label="Total students"
              value="248"
              sub="+12 enrolled this month"
              icon={<Users size={20} />}
              accent="#2563EB"
              trend="+5.1%"
              trendUp
            />
            <MetricCard
              label="Active instructors"
              value="18"
              sub="16 available today"
              icon={<UserCheck size={20} />}
              accent="#16A34A"
              trend="+2 new"
              trendUp
            />
            <MetricCard
              label="Today's sessions"
              value="27"
              sub="18 practical Â· 9 theory"
              icon={<Calendar size={20} />}
              accent="#7C3AED"
              trend="+3 vs avg"
              trendUp
            />
            <MetricCard
              label="Upcoming trials"
              value="14"
              sub="Within the next 7 days"
              icon={<Award size={20} />}
              accent="#F59E0B"
              trend="+4 this week"
              trendUp
            />
            <MetricCard
              label="Outstanding payments"
              value="LKR 485,000"
              sub="42 students with balance"
              icon={<CreditCard size={20} />}
              accent="#DC2626"
              trend="â†‘ LKR 32k"
              trendUp={false}
            />
            <MetricCard
              label="Expiring permits"
              value="9"
              sub="Within the next 30 days"
              icon={<FileText size={20} />}
              accent="#0284C7"
              trend="5 this week"
              trendUp={false}
            />
          </>
        )}
      </div>

      {/* â”€â”€ Urgent alerts strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { icon: <AlertTriangle size={13} />, text: "9 students have learner permits expiring within 45 days.", action: "Review", color: "#92400E", bg: "#FFFBEB", border: "#FDE68A", nav: "Students" },
            { icon: <FileText size={13} />, text: "3 students are missing required documents for DMT application.", action: "Review", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", nav: "Students" },
            { icon: <CreditCard size={13} />, text: "18 students have overdue payments totalling LKR 485,000.", action: "Review", color: "#991B1B", bg: "#FFF5F5", border: "#FECACA", nav: "Payments" },
          ].map(({ icon, text, action, color, bg, border, nav }) => (
            <div key={nav + text} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", borderRadius: 9, background: bg, border: `1px solid ${border}`, flex: "1 1 280px" }}>
              <span style={{ color, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 12, color, flex: 1, lineHeight: 1.4 }}>{text}</span>
              <button onClick={() => onNavigate?.(nav)} style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 5, border: "none", background: color, color: "#ffffff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{action}</button>
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Schedule + Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 20,
          marginBottom: 20,
          alignItems: "start",
        }}
      >
        <ScheduleTable onToast={pushToast} />

        {/* Right column: Alerts + Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AlertsPanel onToast={pushToast} />
          <RecentActivity />
        </div>
      </div>
      )}

      {/* â”€â”€ Student Journey â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && <JourneyOverview />}

      {/* bottom spacer */}
      <div style={{ height: 32 }} />
    </div>
  );
}


