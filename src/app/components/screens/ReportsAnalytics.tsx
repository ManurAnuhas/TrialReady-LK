import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { Download, Printer, Calendar, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

/* ─── Data ─── */

const REVENUE = [
  { month: "Jan", revenue: 520000, target: 600000 },
  { month: "Feb", revenue: 580000, target: 600000 },
  { month: "Mar", revenue: 645000, target: 650000 },
  { month: "Apr", revenue: 490000, target: 650000 },
  { month: "May", revenue: 720000, target: 700000 },
  { month: "Jun", revenue: 810000, target: 700000 },
  { month: "Jul", revenue: 685000, target: 700000 },
];

const REGISTRATIONS = [
  { month: "Jan", count: 14 },
  { month: "Feb", count: 18 },
  { month: "Mar", count: 22 },
  { month: "Apr", count: 16 },
  { month: "May", count: 28 },
  { month: "Jun", count: 31 },
  { month: "Jul", count: 24 },
];

const JOURNEY_STAGES = [
  { name: "Registration", value: 12, color: "#94A3B8" },
  { name: "Medical & Permit", value: 18, color: "#60A5FA" },
  { name: "Theory Training", value: 24, color: "#34D399" },
  { name: "Practical Training", value: 47, color: "#2563EB" },
  { name: "Written Exam", value: 22, color: "#8B5CF6" },
  { name: "Practical Trial", value: 15, color: "#F59E0B" },
  { name: "Completed", value: 85, color: "#16A34A" },
];

const INSTRUCTOR_UTIL = [
  { name: "Kasun Silva", utilisation: 94, sessions: 32 },
  { name: "Malini Fernando", utilisation: 78, sessions: 26 },
  { name: "Priya Dissanayake", utilisation: 100, sessions: 34 },
  { name: "Ruwan Jayasinghe", utilisation: 0, sessions: 0 },
];

const VEHICLE_UTIL = [
  { name: "BAA-4521", utilisation: 82, sessions: 28 },
  { name: "CAG-8820", utilisation: 91, sessions: 31 },
  { name: "CAB-3187", utilisation: 65, sessions: 22 },
  { name: "CBE-3310", utilisation: 74, sessions: 25 },
  { name: "CBK-9012", utilisation: 58, sessions: 20 },
];

const PAYMENT_STATUS = [
  { name: "Completed", value: 156, color: "#16A34A" },
  { name: "Pending", value: 32, color: "#F59E0B" },
  { name: "Overdue", value: 18, color: "#DC2626" },
];

const WRITTEN_PASSRATE = [
  { month: "Jan", pass: 78, fail: 22 },
  { month: "Feb", pass: 82, fail: 18 },
  { month: "Mar", pass: 75, fail: 25 },
  { month: "Apr", pass: 88, fail: 12 },
  { month: "May", pass: 84, fail: 16 },
  { month: "Jun", pass: 91, fail: 9 },
  { month: "Jul", pass: 86, fail: 14 },
];

const PRACTICAL_PASSRATE = [
  { month: "Jan", pass: 70, fail: 30 },
  { month: "Feb", pass: 74, fail: 26 },
  { month: "Mar", pass: 72, fail: 28 },
  { month: "Apr", pass: 79, fail: 21 },
  { month: "May", pass: 76, fail: 24 },
  { month: "Jun", pass: 83, fail: 17 },
  { month: "Jul", pass: 81, fail: 19 },
];

const OUTSTANDING_BALANCES = [
  { range: "< LKR 5k", count: 12 },
  { range: "LKR 5–15k", count: 24 },
  { range: "LKR 15–30k", count: 18 },
  { range: "LKR 30–50k", count: 8 },
  { range: "> LKR 50k", count: 3 },
];

const EXPIRY_DATA = [
  { month: "Aug 2026", permits: 8, medical: 5 },
  { month: "Sep 2026", permits: 14, medical: 9 },
  { month: "Oct 2026", permits: 11, medical: 12 },
  { month: "Nov 2026", permits: 6, medical: 7 },
  { month: "Dec 2026", permits: 3, medical: 4 },
];

/* ─── Helpers ─── */

const fmtLKR = (v: number) => `LKR ${(v / 1000).toFixed(0)}k`;

const customTooltipStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontSize: 12,
  color: "#1E293B",
  padding: "8px 12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#64748B" }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function KPI({ label, value, trend, trendDir }: { label: string; value: string; trend: string; trendDir: "up" | "down" }) {
  const positive = trendDir === "up";
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: positive ? "#16A34A" : "#DC2626" }}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  );
}

/* ─── Main export ─── */

type ReportType = "all" | "revenue" | "students" | "instructors" | "exams" | "expiry";

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("2026-01 to 2026-07");
  const [reportType, setReportType] = useState<ReportType>("all");

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 28px 0 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Reports & Analytics</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>Performance overview for Metro Drive Academy · Jan – Jul 2026</div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 5, height: 38, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Printer size={13} />Print
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, height: 38, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Download size={13} />Export CSV
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, height: 38, padding: "0 14px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Download size={13} />Export PDF
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 22, display: "flex", gap: 10, alignItems: "center" }}>
        <Calendar size={14} color="#94A3B8" />
        <select style={selectStyle} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option>2026-01 to 2026-07</option>
          <option>2026-04 to 2026-07</option>
          <option>2025-08 to 2026-07</option>
        </select>
        <select style={selectStyle} value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)}>
          <option value="all">All reports</option>
          <option value="revenue">Revenue</option>
          <option value="students">Students</option>
          <option value="instructors">Instructors & Vehicles</option>
          <option value="exams">Exams & Trials</option>
          <option value="expiry">Expiry tracking</option>
        </select>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        <KPI label="Total revenue (Jan–Jul)" value="LKR 4.45M" trend="+12% vs same period 2025" trendDir="up" />
        <KPI label="Students registered" value="153" trend="+18% vs same period 2025" trendDir="up" />
        <KPI label="Written exam pass rate" value="84%" trend="+6pp vs same period 2025" trendDir="up" />
        <KPI label="Practical trial pass rate" value="76%" trend="+4pp vs same period 2025" trendDir="up" />
      </div>

      {/* Row 1 — Revenue trend + Registrations */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Revenue trend" subtitle="Monthly collected vs target (LKR)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE} margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtLKR} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`LKR ${v.toLocaleString()}`, ""]} contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="4 3" strokeWidth={1.5} fill="none" name="Target" />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revenueGrad)" name="Collected" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="New registrations by month" subtitle="Students registered">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REGISTRATIONS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 — Journey stages + Payment status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Students by journey stage" subtitle="Current distribution across 7 stages">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={JOURNEY_STAGES} layout="vertical" margin={{ top: 4, right: 16, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} width={78} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="value" name="Students" radius={[0, 4, 4, 0]}>
                {JOURNEY_STAGES.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment collection status" subtitle="Total payment records">
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={PAYMENT_STATUS} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {PAYMENT_STATUS.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PAYMENT_STATUS.map(s => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{s.name}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{PAYMENT_STATUS.reduce((s, p) => s + p.value, 0)}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Total records</div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 3 — Instructor + Vehicle utilisation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Instructor utilisation" subtitle="% of available slots used (this month)">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INSTRUCTOR_UTIL.map(ins => (
              <div key={ins.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{ins.name}</span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{ins.utilisation}% · {ins.sessions} sessions</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{ width: `${ins.utilisation}%`, height: "100%", borderRadius: 4, background: ins.utilisation === 100 ? "#DC2626" : ins.utilisation >= 80 ? "#F59E0B" : "#16A34A" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Vehicle utilisation" subtitle="% of available slots used (this month)">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VEHICLE_UTIL.map(v => (
              <div key={v.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{v.name}</span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{v.utilisation}% · {v.sessions} sessions</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{ width: `${v.utilisation}%`, height: "100%", borderRadius: 4, background: v.utilisation >= 90 ? "#DC2626" : v.utilisation >= 70 ? "#F59E0B" : "#16A34A" }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Row 4 — Written + Practical pass rate */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Written examination pass rate" subtitle="Monthly pass vs fail (%)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WRITTEN_PASSRATE} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis unit="%" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748B" }} />
              <Bar dataKey="pass" name="Passed" fill="#16A34A" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="fail" name="Failed" fill="#FCA5A5" radius={[0, 0, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Practical trial pass rate" subtitle="Monthly pass vs fail (%)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PRACTICAL_PASSRATE} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis unit="%" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748B" }} />
              <Bar dataKey="pass" name="Passed" fill="#2563EB" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="fail" name="Failed" fill="#BFDBFE" radius={[0, 0, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 5 — Outstanding balances + Expiring */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard title="Outstanding balances by range" subtitle="Number of students per balance range">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={OUTSTANDING_BALANCES} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Students" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expiring permits & medical certificates" subtitle="Upcoming expirations by month">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={EXPIRY_DATA} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748B" }} />
              <Line type="monotone" dataKey="permits" name="Learner permits" stroke="#2563EB" strokeWidth={2} dot={{ r: 4, fill: "#2563EB" }} />
              <Line type="monotone" dataKey="medical" name="Medical certs" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4, fill: "#7C3AED" }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
