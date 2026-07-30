import React, { useState } from "react";
import {
  ChevronLeft, Edit3, MessageSquare, UserPlus, CalendarPlus, MoreHorizontal,
  Star, Phone, Mail, Shield, Car, Clock, MapPin, ChevronDown, Users,
  CheckCircle2, TrendingUp, Award, FileText, Check,
} from "lucide-react";

/* ─── Data ─── */

const INSTRUCTOR = {
  name: "Kasun Silva",
  code: "INS-0014",
  initials: "KS",
  licenceNumber: "LIC-2018-KS001",
  categories: ["Light Vehicle", "Dual Purpose"],
  phone: "+94 71 456 7890",
  email: "kasun.silva@metrodrive.lk",
  address: "Nugegoda, Sri Lanka",
  joinedDate: "14 March 2018",
  status: "Active",
  availability: "Available",
  assignedStudents: 32,
  sessionsToday: 6,
  avgRating: 4.8,
  completionRate: 94,
  totalSessionsYear: 284,
  studentsCompleted: 47,
};

const WEEKLY_AVAIL = [
  { day: "Mon", from: "08:00", to: "17:00", available: true },
  { day: "Tue", from: "08:00", to: "17:00", available: true },
  { day: "Wed", from: "08:00", to: "17:00", available: true },
  { day: "Thu", from: "08:00", to: "17:00", available: true },
  { day: "Fri", from: "08:00", to: "17:00", available: true },
  { day: "Sat", from: "08:00", to: "12:00", available: true },
  { day: "Sun", from: "", to: "", available: false },
];

const UPCOMING_SESSIONS = [
  { date: "Thu, 24 Jul", time: "09:00–10:00", type: "Practical Session", student: "Kavindu Perera", vehicle: "BAA-4521", location: "Route A — Nugegoda" },
  { date: "Thu, 24 Jul", time: "11:00–12:00", type: "Practical Session", student: "Dilhara Senanayake", vehicle: "BAA-4521", location: "Route A — Nugegoda" },
  { date: "Fri, 25 Jul", time: "09:00–10:00", type: "Practical Session", student: "Kavindu Perera", vehicle: "BAA-4521", location: "Route A — Nugegoda" },
  { date: "Sat, 26 Jul", time: "08:30–10:00", type: "Theory Class", student: null, vehicle: null, location: "Hall 1 — Main Campus", group: "Group A" },
];

const TRIAL_READY = [
  { name: "Dilhara Senanayake", id: "STD-2026-0072", category: "Light Vehicle", eligibleFrom: "15 Jul 2026" },
  { name: "Sanduni Jayasekara", id: "STD-2026-0052", category: "Motorcycle", eligibleFrom: "05 Jul 2026" },
];

const EVALUATIONS = [
  { date: "22 Jul 2026", student: "Kavindu Perera", type: "Practical", rating: 4, comment: "Good junction control. Needs more practice on reverse parking before the trial." },
  { date: "18 Jul 2026", student: "Dilhara Senanayake", type: "Practical", rating: 5, comment: "Excellent progress. Confident and precise manoeuvring. Trial-ready." },
  { date: "10 Jul 2026", student: "Nethmi Wijesinghe", type: "Practical", rating: 3, comment: "Needs more practice with gear transitions at low speeds on inclines." },
  { date: "05 Jul 2026", student: "Kavindu Perera", type: "Practical", rating: 4, comment: "Showing improvement. Highway driving is confident." },
];

const ALL_STUDENTS = [
  { name: "Kavindu Perera", id: "STD-2026-0048", stage: "Practical Training", initials: "KP" },
  { name: "Dilhara Senanayake", id: "STD-2026-0072", stage: "Written Examination", initials: "DS" },
  { name: "Tharindu Fernando", id: "STD-2026-0061", stage: "Medical Pending", initials: "TF" },
  { name: "Amaya Bandara", id: "STD-2026-0031", stage: "Practical Training", initials: "AB" },
  { name: "Sithum Rodrigo", id: "STD-2026-0044", stage: "Theory Training", initials: "SR" },
];

/* ─── Shared helpers ─── */

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "sessions", label: "Sessions" },
  { id: "students", label: "Students" },
  { id: "evaluations", label: "Evaluations" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < rating ? "#F59E0B" : "transparent"}
          color={i < rating ? "#F59E0B" : "#CBD5E1"}
        />
      ))}
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 6, fontSize: 12, fontWeight: 500, color, background: bg, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "13px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#64748B", display: "flex" }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{title}</span>
      </div>
      <div style={{ padding: "14px 18px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #F8FAFC" }}>
      <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

/* ─── Overview tab ─── */

function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Assigned students", value: "32", sub: "currently active", color: "#2563EB" },
          { label: "Sessions this year", value: "284", sub: "completed", color: "#16A34A" },
          { label: "Average rating", value: "4.8 / 5", sub: "from 186 reviews", color: "#F59E0B" },
          { label: "Trial pass rate", value: "91%", sub: "47 students completed", color: "#7C3AED" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#CBD5E1" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Personal + Licence details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InfoCard title="Personal details" icon={<FileText size={15} />}>
          <InfoRow label="Phone" value={<span style={{ display: "flex", alignItems: "center", gap: 5 }}><Phone size={12} color="#94A3B8" />{INSTRUCTOR.phone}</span>} />
          <InfoRow label="Email" value={INSTRUCTOR.email} />
          <InfoRow label="Address" value={INSTRUCTOR.address} />
          <InfoRow label="Joined" value={INSTRUCTOR.joinedDate} />
          <InfoRow label="Status" value={<Badge label="Active" color="#166534" bg="#DCFCE7" />} />
          <InfoRow label="Availability" value={<Badge label="Available" color="#1D4ED8" bg="#DBEAFE" />} />
        </InfoCard>

        <InfoCard title="Licence & categories" icon={<Shield size={15} />}>
          <InfoRow label="Instructor code" value={<span style={{ fontFamily: "monospace", fontSize: 13 }}>{INSTRUCTOR.code}</span>} />
          <InfoRow label="Licence number" value={<span style={{ fontFamily: "monospace", fontSize: 13 }}>{INSTRUCTOR.licenceNumber}</span>} />
          <InfoRow label="Issued by" value="Dept. of Motor Traffic" />
          <InfoRow label="Licence valid until" value="14 March 2028" />
          <div style={{ padding: "10px 0 0" }}>
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>Licensed vehicle categories</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {INSTRUCTOR.categories.map((c) => (
                <Badge key={c} label={c} color="#1D4ED8" bg="#DBEAFE" />
              ))}
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Weekly availability */}
      <InfoCard title="Weekly availability" icon={<Clock size={15} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {WEEKLY_AVAIL.map((d) => (
            <div
              key={d.day}
              style={{
                borderRadius: 8,
                background: d.available ? "#F0FDF4" : "#F8FAFC",
                border: `1.5px solid ${d.available ? "#BBF7D0" : "#E2E8F0"}`,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: d.available ? "#16A34A" : "#94A3B8", marginBottom: 5 }}>{d.day}</div>
              {d.available ? (
                <>
                  <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>{d.from}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>to</div>
                  <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>{d.to}</div>
                </>
              ) : (
                <div style={{ fontSize: 11, color: "#CBD5E1" }}>Off</div>
              )}
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Upcoming sessions + trial-ready */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InfoCard title="Upcoming sessions" icon={<CalendarPlus size={15} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {UPCOMING_SESSIONS.map((s, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1E293B" }}>{s.date}</span>
                  <span style={{ fontSize: 11, color: "#64748B" }}>{s.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 3 }}>
                  {s.group ? `${s.type} · ${s.group}` : `${s.type} · ${s.student}`}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {s.vehicle && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{s.vehicle}</span>}
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{s.location}</span>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Trial-ready students" icon={<Award size={15} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TRIAL_READY.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#16A34A", flexShrink: 0 }}>
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{s.category} · Eligible from {s.eligibleFrom}</div>
                </div>
                <CheckCircle2 size={16} color="#16A34A" />
              </div>
            ))}
            <div style={{ padding: "10px 12px", borderRadius: 8, border: "1px dashed #E2E8F0", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>2 more students approaching trial readiness</div>
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}

/* ─── Evaluations tab ─── */

function EvaluationsTab() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "13px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Student evaluations</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Star size={14} fill="#F59E0B" color="#F59E0B" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>4.8</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>average from 186 evaluations</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {EVALUATIONS.map((e, i) => (
          <div key={i} style={{ padding: "14px 18px", borderTop: i > 0 ? "1px solid #F8FAFC" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginRight: 8 }}>{e.student}</span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{e.type} · {e.date}</span>
              </div>
              <Stars rating={e.rating} />
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{e.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Students tab ─── */

function StudentsTab() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "13px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Assigned students · 32 total</span>
        <span style={{ fontSize: 13, color: "#64748B" }}>Showing 5 of 32</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Student", "Student ID", "Current Stage", "Status"].map((h) => (
              <th key={h} style={{ padding: "9px 16px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_STUDENTS.map((s, i) => (
            <tr key={i} style={{ borderTop: i > 0 ? "1px solid #F8FAFC" : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "11px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563EB" }}>{s.initials}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{s.name}</span>
                </div>
              </td>
              <td style={{ padding: "11px 16px", fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>{s.id}</td>
              <td style={{ padding: "11px 16px" }}>
                <Badge label={s.stage}
                  color={s.stage === "Practical Training" ? "#6D28D9" : s.stage === "Theory Training" ? "#0369A1" : s.stage === "Written Examination" ? "#1D4ED8" : "#92400E"}
                  bg={s.stage === "Practical Training" ? "#EDE9FE" : s.stage === "Theory Training" ? "#E0F2FE" : s.stage === "Written Examination" ? "#DBEAFE" : "#FEF3C7"}
                />
              </td>
              <td style={{ padding: "11px 16px" }}><Badge label="Active" color="#166534" bg="#DCFCE7" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── More actions menu ─── */

function MoreActionsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        <MoreHorizontal size={15} /><span>More</span><ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 50, minWidth: 180, padding: 4 }}>
            {["Mark as on leave", "Transfer students", "Download profile", "Deactivate instructor"].map((item, i) => (
              <button key={item} onClick={() => setOpen(false)}
                style={{ display: "block", width: "100%", padding: "9px 12px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 500, color: i === 3 ? "#DC2626" : "#1E293B", textAlign: "left", fontFamily: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = i === 3 ? "#FEF2F2" : "#F8FAFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >{item}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main export ─── */

export function InstructorProfile({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 5, height: 34, padding: "0 12px", borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", color: "#64748B", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          <ChevronLeft size={14} />Instructors
        </button>
        <span style={{ color: "#CBD5E1", fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: "#64748B" }}>Kasun Silva</span>
        <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "monospace", marginLeft: 4 }}>INS-0014</span>
      </div>

      {/* Header */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px", marginBottom: 14, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #DCFCE7, #DBEAFE)", border: "3px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#16A34A", flexShrink: 0 }}>KS</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>Kasun Silva</h1>
            <Badge label="Active" color="#166534" bg="#DCFCE7" />
            <Badge label="Available" color="#1D4ED8" bg="#DBEAFE" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#64748B", fontFamily: "monospace", background: "#F1F5F9", padding: "2px 8px", borderRadius: 5 }}>INS-0014</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>·</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>Licence: {INSTRUCTOR.licenceNumber}</span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>·</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>32 students assigned</span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>·</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>6 sessions today</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {[
            { icon: <Edit3 size={14} />, label: "Edit profile" },
            { icon: <MessageSquare size={14} />, label: "Message" },
            { icon: <UserPlus size={14} />, label: "Assign student" },
          ].map(({ icon, label }) => (
            <button key={label}
              style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {icon}{label}
            </button>
          ))}
          <MoreActionsMenu />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #E2E8F0", marginBottom: 18, background: "#ffffff", borderRadius: "12px 12px 0 0", border: "1px solid #E2E8F0", borderBottomWidth: 0, padding: "0 4px" }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: "12px 16px", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? "#2563EB" : "#64748B", borderBottom: `2px solid ${activeTab === tab.id ? "#2563EB" : "transparent"}`, marginBottom: -1, transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "evaluations" && <EvaluationsTab />}
      {activeTab === "students" && <StudentsTab />}
      {activeTab === "sessions" && (
        <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>Session history</div>
          <div style={{ fontSize: 13, color: "#64748B" }}>Additional performance records will appear here when available.</div>
        </div>
      )}
    </div>
  );
}
