import React, { useState } from "react";
import {
  CheckCircle2, Clock, AlertCircle, Download, Printer,
  Save, Send, Eye, ChevronRight, User, FileText, Info,
} from "lucide-react";

/* â”€â”€â”€ Types & data â”€â”€â”€ */

type AppStatus = "Draft" | "Ready" | "Submitted" | "Incomplete";

interface DmtApp {
  id: string;
  student: string;
  studentId: string;
  nic: string;
  dob: string;
  address: string;
  category: string;
  medCertNo: string;
  permitNo: string;
  permitIssued: string;
  permitExpiry: string;
  status: AppStatus;
  checklist: { item: string; status: "Completed" | "Pending" | "Missing" }[];
}

const LOSHAN: DmtApp = {
  id: "dmt-001",
  student: "Loshan Mihisara",
  studentId: "STD-2026-0048",
  nic: "200014500678V",
  dob: "2000-05-24",
  address: "No. 14, Samanala Road, Nugegoda, Western Province",
  category: "Light Vehicle (Class B)",
  medCertNo: "MC-2026-WP-04412",
  permitNo: "LP-2026-WP-00341",
  permitIssued: "2026-01-15",
  permitExpiry: "2026-10-14",
  status: "Draft",
  checklist: [
    { item: "NIC copy (front and back)", status: "Completed" },
    { item: "Medical certificate (Form CMV/II)", status: "Completed" },
    { item: "Passport photograph (2 copies, 3.5 Ã— 4.5 cm)", status: "Completed" },
    { item: "Application data â€” internal summary", status: "Completed" },
    { item: "Payment receipt (DMT application fee)", status: "Pending" },
  ],
};

const ALL_APPS = [
  { student: "Loshan Mihisara", id: "STD-2026-0048", status: "Draft" as AppStatus },
  { student: "Ravishka Rathnayake", id: "STD-2026-0052", status: "Ready" as AppStatus },
  { student: "Lasindu Dilshan", id: "STD-2026-0061", status: "Submitted" as AppStatus },
  { student: "Ruwan Wickramasinghe", id: "STD-2026-0044", status: "Incomplete" as AppStatus },
];

const STATUS_STYLE: Record<AppStatus, { color: string; bg: string; border: string }> = {
  Draft: { color: "#475569", bg: "#F1F5F9", border: "#E2E8F0" },
  Ready: { color: "#166534", bg: "#DCFCE7", border: "#86EFAC" },
  Submitted: { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  Incomplete: { color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5" },
};

const CHECK_STYLE: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Completed: { color: "#166534", bg: "#DCFCE7", icon: <CheckCircle2 size={14} /> },
  Pending: { color: "#92400E", bg: "#FEF3C7", icon: <Clock size={14} /> },
  Missing: { color: "#991B1B", bg: "#FEE2E2", icon: <AlertCircle size={14} /> },
};

/* â”€â”€â”€ Detail section â”€â”€â”€ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</div>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{value}</div>
    </div>
  );
}

/* â”€â”€â”€ Main export â”€â”€â”€ */

export function DmtApplication() {
  const [selected, setSelected] = useState<string>("STD-2026-0048");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "All">("All");
  const [appStatus, setAppStatus] = useState<AppStatus>(LOSHAN.status);

  const app = LOSHAN;
  const statusStyle = STATUS_STYLE[appStatus];

  const completedCount = app.checklist.filter(c => c.status === "Completed").length;
  const totalCount = app.checklist.length;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" });

  const filteredApps = ALL_APPS.filter(a => statusFilter === "All" || a.status === statusFilter);

  const selectStyle: React.CSSProperties = {
    height: 36, padding: "0 26px 0 10px", borderRadius: 7, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, minHeight: "100%" }}>
      {/* Left sidebar â€” student list */}
      <div>
        <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 10 }}>Applications</div>
            <select style={{ ...selectStyle, width: "100%" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="All">All statuses</option>
              <option>Draft</option><option>Ready</option><option>Submitted</option><option>Incomplete</option>
            </select>
          </div>
          {filteredApps.map(a => {
            const ss = STATUS_STYLE[a.status];
            const isSelected = a.id === selected;
            return (
              <button key={a.id} onClick={() => setSelected(a.id)}
                style={{ width: "100%", padding: "12px 16px", border: "none", borderBottom: "1px solid #F1F5F9", background: isSelected ? "#EFF6FF" : "#ffffff", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: isSelected ? "#DBEAFE" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={14} color={isSelected ? "#2563EB" : "#94A3B8"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#2563EB" : "#1E293B", marginBottom: 2 }}>{a.student}</div>
                  <span style={{ display: "inline-block", padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: ss.color, background: ss.bg }}>{a.status}</span>
                </div>
                {isSelected && <ChevronRight size={13} color="#2563EB" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right â€” detail panel */}
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>DMT Application Data Summary</h1>
              <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: statusStyle.color, background: statusStyle.bg, border: `1px solid ${statusStyle.border}` }}>{appStatus}</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>Internal data record for Department of Motor Traffic application Â· {app.student} Â· {app.studentId}</div>
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            {[
              { icon: <Save size={13} />, label: "Save draft", action: () => setAppStatus("Draft") },
              { icon: <Printer size={13} />, label: "Print", action: () => window.print() },
              { icon: <Download size={13} />, label: "Download PDF", action: () => {} },
            ].map(({ icon, label, action }) => (
              <button key={label} onClick={action}
                style={{ display: "flex", alignItems: "center", gap: 5, height: 36, padding: "0 12px", borderRadius: 7, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {icon}{label}
              </button>
            ))}
            <button onClick={() => setAppStatus("Submitted")}
              style={{ display: "flex", alignItems: "center", gap: 5, height: 36, padding: "0 14px", borderRadius: 7, border: "none", background: "#16A34A", color: "#ffffff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Send size={12} />Mark as submitted
            </button>
          </div>
        </div>

        {/* Notice banner */}
        <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: "11px 16px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Info size={15} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
            <strong>Internal document only.</strong> This is an internal application-data summary prepared by Metro Drive Academy. It does not replace official Department of Motor Traffic forms or submission procedures.
          </span>
        </div>

        {/* Progress */}
        <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Checklist progress</div>
            <span style={{ fontSize: 13, color: "#64748B" }}>{completedCount}/{totalCount} items complete</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "#E2E8F0", overflow: "hidden", marginBottom: 14 }}>
            <div style={{ width: `${(completedCount / totalCount) * 100}%`, height: "100%", borderRadius: 4, background: completedCount === totalCount ? "#16A34A" : "#2563EB", transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {app.checklist.map((c) => {
              const cs = CHECK_STYLE[c.status];
              return (
                <div key={c.item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: cs.bg, color: cs.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{cs.icon}</div>
                  <span style={{ fontSize: 13, color: "#374151" }}>{c.item}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: cs.color }}>{c.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal information */}
        <Section title="Personal information">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px 24px" }}>
            <Field label="Full name" value={app.student} />
            <Field label="National Identity Card (NIC)" value={app.nic} />
            <Field label="Date of birth" value={formatDate(app.dob)} />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Residential address" value={app.address} />
            </div>
          </div>
        </Section>

        {/* Vehicle & licence */}
        <Section title="Vehicle category & licence details">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px 24px" }}>
            <Field label="Vehicle category" value={app.category} />
            <Field label="Medical certificate number" value={app.medCertNo} />
            <div />
            <Field label="Learner permit number" value={app.permitNo} />
            <Field label="Permit issued date" value={formatDate(app.permitIssued)} />
            <Field label="Permit expiry date" value={formatDate(app.permitExpiry)} />
          </div>
        </Section>

        {/* Photograph */}
        <Section title="Photograph">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 80, height: 96, borderRadius: 8, background: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)", border: "1.5px solid #BFDBFE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <User size={28} color="#93C5FD" />
              <div style={{ fontSize: 9, color: "#93C5FD", textAlign: "center", letterSpacing: "0.04em" }}>PHOTO</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Passport photograph uploaded</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>2 copies required Â· 3.5 Ã— 4.5 cm Â· white background</div>
              <div style={{ fontSize: 11, color: "#16A34A", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={11} />Meets DMT photograph specification</div>
            </div>
          </div>
        </Section>

        {/* School info */}
        <Section title="Driving school information">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px 24px" }}>
            <Field label="Driving school name" value="Metro Drive Academy" />
            <Field label="Registration number" value="MDA-2018-WP-0041" />
            <Field label="School phone" value="011-258-4400" />
            <Field label="School address" value="No. 45, Galle Road, Colombo 03" />
            <Field label="Instructor assigned" value="Kasun Silva" />
            <Field label="Instructor licence" value="LIC-2018-KS001" />
          </div>
        </Section>
      </div>
    </div>
  );
}


