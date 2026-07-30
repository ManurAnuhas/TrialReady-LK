import React, { useState } from "react";
import {
  Building2, Palette, Users, FileText, Bell, Map,
  Shield, Activity, ChevronRight, Plus, X, Check,
  Eye, EyeOff, ToggleLeft, ToggleRight, Upload, MoreHorizontal,
  Lock, RefreshCw, AlertCircle, CheckCircle2,
} from "lucide-react";
import { BrandMark } from "../shell/BrandMark";


/* ─── Tabs ─── */

type SettingsTab = "profile" | "branding" | "users" | "documents" | "notifications" | "journey" | "security" | "audit";

const TABS: { id: SettingsTab; icon: React.ReactNode; label: string }[] = [
  { id: "profile", icon: <Building2 size={15} />, label: "School Profile" },
  { id: "branding", icon: <Palette size={15} />, label: "Branding" },
  { id: "users", icon: <Users size={15} />, label: "Users & Roles" },
  { id: "documents", icon: <FileText size={15} />, label: "Document Requirements" },
  { id: "notifications", icon: <Bell size={15} />, label: "Notifications" },
  { id: "journey", icon: <Map size={15} />, label: "Licence Journey" },
  { id: "security", icon: <Shield size={15} />, label: "Security" },
  { id: "audit", icon: <Activity size={15} />, label: "Audit Activity" },
];

/* ─── Helper components ─── */

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  const [state, setState] = useState(on);
  return (
    <button onClick={() => setState(v => !v)}
      style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: state ? "#2563EB" : "#CBD5E1", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 2, left: state ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#ffffff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };
function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>{children}</div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</div>;
}

/* ─── Tab panels ─── */

function ProfileTab() {
  return (
    <div>
      <Card>
        <SectionTitle>School information</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>School name</label>
            <input style={inputStyle} defaultValue="Metro Drive Academy" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} defaultValue="No. 45, Galle Road, Colombo 03, Western Province" />
          </div>
          <div>
            <label style={labelStyle}>Contact email</label>
            <input style={inputStyle} type="email" defaultValue="admin@metrodriveacademy.lk" />
          </div>
          <div>
            <label style={labelStyle}>Contact phone</label>
            <input style={inputStyle} type="tel" defaultValue="011-258-4400" />
          </div>
          <div>
            <label style={labelStyle}>Registration number</label>
            <input style={inputStyle} defaultValue="MDA-2018-WP-0041" />
          </div>
          <div>
            <label style={labelStyle}>Website</label>
            <input style={inputStyle} defaultValue="www.metrodriveacademy.lk" />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save changes</button>
        </div>
      </Card>

      <Card>
        <SectionTitle>School logo</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BrandMark compact={true} tone="dark" />
          <div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Upload size={13} />Upload new logo
            </button>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>PNG or SVG recommended · Max 1 MB · Min 200 × 200 px</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BrandingTab() {
  const [primaryColor, setPrimaryColor] = useState("#2563EB");

  return (
    <div>
      <Card>
        <SectionTitle>Brand colours</SectionTitle>
        <SettingRow label="Primary colour" sub="Used for buttons, highlights and accents">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: primaryColor, border: "1px solid #E2E8F0" }} />
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: 80, height: 32, border: "1.5px solid #E2E8F0", borderRadius: 7, padding: "2px 4px", cursor: "pointer", background: "#ffffff" }} />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748B" }}>{primaryColor.toUpperCase()}</span>
          </div>
        </SettingRow>
        <SettingRow label="Sidebar colour" sub="Navigation panel background">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#0F172A", border: "1px solid #E2E8F0" }} />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748B" }}>#0F172A</span>
          </div>
        </SettingRow>
      </Card>
      <Card>
        <SectionTitle>Document headers</SectionTitle>
        <SettingRow label="Receipt header text" sub="Appears on printed payment receipts">
          <input style={{ ...inputStyle, width: 280 }} defaultValue="Metro Drive Academy — Official Receipt" />
        </SettingRow>
        <SettingRow label="Report header text" sub="Appears on exported PDF reports">
          <input style={{ ...inputStyle, width: 280 }} defaultValue="Metro Drive Academy — Confidential" />
        </SettingRow>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button style={{ height: 38, padding: "0 18px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save branding</button>
        </div>
      </Card>
    </div>
  );
}

const USERS = [
  { id: "u1", name: "Nimal Perera", role: "Administrator", email: "nimal@metrodriveacademy.lk", status: "Active" },
  { id: "u2", name: "Kasun Silva", role: "Instructor", email: "kasun@metrodriveacademy.lk", status: "Active" },
  { id: "u3", name: "Malini Fernando", role: "Instructor", email: "malini@metrodriveacademy.lk", status: "Active" },
  { id: "u4", name: "Priya Dissanayake", role: "Instructor", email: "priya@metrodriveacademy.lk", status: "Active" },
  { id: "u5", name: "Ruwan Jayasinghe", role: "Instructor", email: "ruwan@metrodriveacademy.lk", status: "On leave" },
  { id: "u6", name: "Admin (system)", role: "Super Admin", email: "system@metrodriveacademy.lk", status: "Active" },
];

function UsersTab() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={13} />Add user
        </button>
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
              {["User", "Role", "Email", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < USERS.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{u.name.charAt(0)}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 12, color: "#475569" }}>{u.role}</span></td>
                <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 12, color: "#64748B" }}>{u.email}</span></td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: u.status === "Active" ? "#166534" : "#92400E", background: u.status === "Active" ? "#DCFCE7" : "#FEF3C7" }}>{u.status}</span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ height: 28, padding: "0 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Reset password</button>
                    {u.role !== "Super Admin" && (
                      <button style={{ height: 28, padding: "0 10px", borderRadius: 6, border: "1px solid #FCA5A5", background: "#FFF1F2", color: "#DC2626", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Deactivate</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const DOCUMENTS = [
  { name: "National Identity Card (NIC)", required: true, stage: "Registration", status: "Active" },
  { name: "Passport photograph (2 copies)", required: true, stage: "Registration", status: "Active" },
  { name: "Medical certificate (Form CMV/II)", required: true, stage: "Medical & Permit", status: "Active" },
  { name: "Learner permit (from DMT)", required: true, stage: "Practical Training", status: "Active" },
  { name: "Completed application form", required: true, stage: "DMT Application", status: "Active" },
  { name: "Previous driving licence (if applicable)", required: false, stage: "Registration", status: "Optional" },
];

function DocumentsTab() {
  return (
    <Card>
      <SectionTitle>Required documents</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
            {["Document name", "Required?", "Applicable stage", "Status"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOCUMENTS.map((d, i) => (
            <tr key={d.name} style={{ borderBottom: i < DOCUMENTS.length - 1 ? "1px solid #F1F5F9" : "none" }}>
              <td style={{ padding: "13px 14px" }}><span style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>{d.name}</span></td>
              <td style={{ padding: "13px 14px" }}>
                {d.required ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#DC2626" }}><AlertCircle size={10} />Required</span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Optional</span>
                )}
              </td>
              <td style={{ padding: "13px 14px" }}><span style={{ fontSize: 12, color: "#475569" }}>{d.stage}</span></td>
              <td style={{ padding: "13px 14px" }}>
                <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: d.status === "Active" ? "#166534" : "#64748B", background: d.status === "Active" ? "#DCFCE7" : "#F1F5F9" }}>{d.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const NOTIF_SETTINGS = [
  { label: "Session reminders", sub: "Notify students and instructors 24 h before a session", on: true },
  { label: "Payment reminders", sub: "Alert admin when a payment is overdue by 7+ days", on: true },
  { label: "Learner permit expiry", sub: "Warn 30 days before permit expiry", on: true },
  { label: "Medical certificate expiry", sub: "Warn 30 days before certificate expiry", on: true },
  { label: "Examination reminders", sub: "Notify registered students 48 h before a written exam", on: true },
  { label: "Practical trial reminders", sub: "Notify student and instructor 48 h before a trial", on: false },
];

function NotificationsTab() {
  return (
    <Card>
      <SectionTitle>Notification preferences</SectionTitle>
      {NOTIF_SETTINGS.map(s => (
        <React.Fragment key={s.label}>
          <SettingRow label={s.label} sub={s.sub}>
            <Toggle on={s.on} />
          </SettingRow>
        </React.Fragment>
      ))}
    </Card>
  );
}

const STAGES = [
  { name: "Registration", default: true },
  { name: "Medical & Permit", default: true },
  { name: "Theory Training", default: true },
  { name: "Practical Training", default: true },
  { name: "Written Examination", default: true },
  { name: "Practical Trial", default: true },
  { name: "Licence Obtained", default: true },
  { name: "Trial Preparation (optional)", default: false },
];

function JourneyTab() {
  return (
    <div>
      <Card>
        <SectionTitle>Journey stages</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STAGES.map((s, i) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: s.default ? "#F8FAFC" : "#FFF7ED" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: s.default ? "#DBEAFE" : "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.default ? "#2563EB" : "#C2410C" }}>{i + 1}</div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#1E293B" }}>{s.name}</span>
              {!s.default && <span style={{ fontSize: 11, color: "#C2410C", background: "#FEF3C7", padding: "2px 7px", borderRadius: 4 }}>Optional</span>}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle>Eligibility rules</SectionTitle>
        <SettingRow label="Default practical session target" sub="Minimum sessions before trial eligibility">
          <input style={{ ...inputStyle, width: 80, textAlign: "center" }} defaultValue="15" type="number" />
        </SettingRow>
        <SettingRow label="Trial readiness threshold (%)" sub="Minimum score before scheduling a practical trial">
          <input style={{ ...inputStyle, width: 80, textAlign: "center" }} defaultValue="75" type="number" />
        </SettingRow>
        <SettingRow label="Learner permit required before practical" sub="Students must hold a valid permit to attend practical sessions">
          <Toggle on={true} />
        </SettingRow>
        <SettingRow label="Medical certificate required" sub="Valid medical certificate required before practical training begins">
          <Toggle on={true} />
        </SettingRow>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const [showPw, setShowPw] = useState(false);

  const LOGINS = [
    { user: "Nimal Perera", ip: "192.168.1.10", date: "2026-07-22", time: "08:41", status: "Success" },
    { user: "Kasun Silva", ip: "192.168.1.14", date: "2026-07-22", time: "08:15", status: "Success" },
    { user: "Admin (system)", ip: "192.168.1.1", date: "2026-07-21", time: "22:00", status: "Success" },
    { user: "Unknown", ip: "41.57.102.88", date: "2026-07-21", time: "14:33", status: "Failed" },
  ];

  return (
    <div>
      <Card>
        <SectionTitle>Password policy</SectionTitle>
        <SettingRow label="Minimum password length" sub="Characters required for all user passwords">
          <input style={{ ...inputStyle, width: 80, textAlign: "center" }} defaultValue="10" type="number" />
        </SettingRow>
        <SettingRow label="Require uppercase + lowercase" sub="">
          <Toggle on={true} />
        </SettingRow>
        <SettingRow label="Require at least one number" sub="">
          <Toggle on={true} />
        </SettingRow>
        <SettingRow label="Require special character" sub="">
          <Toggle on={false} />
        </SettingRow>
        <SettingRow label="Force password change every" sub="Days until users must update their password">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input style={{ ...inputStyle, width: 70, textAlign: "center" }} defaultValue="90" type="number" />
            <span style={{ fontSize: 12, color: "#64748B" }}>days</span>
          </div>
        </SettingRow>
      </Card>
      <Card>
        <SectionTitle>Session settings</SectionTitle>
        <SettingRow label="Session timeout" sub="Automatically log out idle users">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input style={{ ...inputStyle, width: 70, textAlign: "center" }} defaultValue="30" type="number" />
            <span style={{ fontSize: 12, color: "#64748B" }}>minutes</span>
          </div>
        </SettingRow>
        <SettingRow label="Allow multiple concurrent sessions" sub="Same account logged in on multiple devices">
          <Toggle on={false} />
        </SettingRow>
      </Card>
      <Card>
        <SectionTitle>Recent login activity</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
              {["User", "IP address", "Date & time", "Status"].map(h => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LOGINS.map((l, i) => (
              <tr key={i} style={{ borderBottom: i < LOGINS.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 13, fontWeight: 600, color: l.status === "Failed" ? "#DC2626" : "#1E293B" }}>{l.user}</span></td>
                <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 12, fontFamily: "monospace", color: "#475569" }}>{l.ip}</span></td>
                <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 12, color: "#475569" }}>{l.date} at {l.time}</span></td>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: l.status === "Success" ? "#166534" : "#991B1B", background: l.status === "Success" ? "#DCFCE7" : "#FEE2E2" }}>
                    {l.status === "Success" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}{l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const AUDIT_LOGS = [
  { date: "2026-07-22", time: "09:12", user: "Nimal Perera", action: "Payment recorded", entity: "Student", record: "Kavindu Perera (STD-2026-0048)", ip: "192.168.1.10" },
  { date: "2026-07-22", time: "08:55", user: "Kasun Silva", action: "Session created", entity: "Calendar event", record: "Practical · 24 Jul 2026 · BAA-4521", ip: "192.168.1.14" },
  { date: "2026-07-21", time: "17:20", user: "Kasun Silva", action: "Exam result recorded", entity: "Exam result", record: "Sanduni Jayasekara — Practical Trial — Passed", ip: "192.168.1.14" },
  { date: "2026-07-21", time: "14:05", user: "Admin (system)", action: "Student registered", entity: "Student", record: "Dilhara Senanayake (STD-2026-0072)", ip: "192.168.1.1" },
  { date: "2026-07-20", time: "12:30", user: "Nimal Perera", action: "Vehicle status updated", entity: "Vehicle", record: "BDL-7402 — Under maintenance", ip: "192.168.1.10" },
  { date: "2026-07-19", time: "10:00", user: "Nimal Perera", action: "Instructor profile edited", entity: "Instructor", record: "Ruwan Jayasinghe (INS-0018) — Status: On leave", ip: "192.168.1.10" },
  { date: "2026-07-18", time: "08:45", user: "Admin (system)", action: "Weekly backup completed", entity: "System", record: "All records · 2026-07-18 03:00 AM", ip: "192.168.1.1" },
];

function AuditTab() {
  return (
    <Card>
      <SectionTitle>Audit activity log</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
            {["Date & time", "User", "Action", "Entity", "Record", "IP address"].map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AUDIT_LOGS.map((l, i) => (
            <tr key={i} style={{ borderBottom: i < AUDIT_LOGS.length - 1 ? "1px solid #F1F5F9" : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}><span style={{ fontSize: 12, color: "#475569" }}>{l.date} {l.time}</span></td>
              <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{l.user}</span></td>
              <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 12, color: "#2563EB", fontWeight: 500 }}>{l.action}</span></td>
              <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 12, color: "#475569" }}>{l.entity}</span></td>
              <td style={{ padding: "11px 14px", maxWidth: 260 }}><span style={{ fontSize: 12, color: "#64748B" }}>{l.record}</span></td>
              <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 11, fontFamily: "monospace", color: "#94A3B8" }}>{l.ip}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/* ─── Main export ─── */

export function SettingsScreen() {
  const [tab, setTab] = useState<SettingsTab>("profile");

  const current = TABS.find(t => t.id === tab)!;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
      {/* Left nav */}
      <div>
        <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
          {TABS.map((t, i) => {
            const active = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", border: "none", borderBottom: i < TABS.length - 1 ? "1px solid #F1F5F9" : "none", background: active ? "#EFF6FF" : "#ffffff", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <span style={{ color: active ? "#2563EB" : "#94A3B8" }}>{t.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#2563EB" : "#374151" }}>{t.label}</span>
                {active && <ChevronRight size={12} color="#2563EB" style={{ marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right content */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>{current.label}</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>Manage {current.label.toLowerCase()} settings for Metro Drive Academy</div>
        </div>

        {tab === "profile" && <ProfileTab />}
        {tab === "branding" && <BrandingTab />}
        {tab === "users" && <UsersTab />}
        {tab === "documents" && <DocumentsTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "journey" && <JourneyTab />}
        {tab === "security" && <SecurityTab />}
        {tab === "audit" && <AuditTab />}
      </div>
    </div>
  );
}
