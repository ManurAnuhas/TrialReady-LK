import React, { useState } from "react";
import {
  Plus, X, CheckCircle2, XCircle, Clock, AlertCircle,
  MoreHorizontal, ChevronDown, Search, Download, Calendar,
  FileText, Award, Target, User,
} from "lucide-react";

/* ─── Types & data ─── */

type ExamStatus = "Passed" | "Failed" | "Pending" | "Absent";

interface ExamResult {
  id: string;
  student: string;
  studentId: string;
  examType: "Written Examination" | "Practical Trial";
  attempt: number;
  date: string;
  score: number | null;
  result: ExamStatus;
  recordedBy: string;
}

interface TrialEligible {
  id: string;
  student: string;
  studentId: string;
  permitEligibility: string;
  sessionsCompleted: number;
  sessionsTarget: number;
  readinessScore: number;
  outstanding: string[];
}

const WRITTEN: ExamResult[] = [
  { id: "e1", student: "Sanduni Jayasekara", studentId: "STD-2026-0052", examType: "Written Examination", attempt: 1, date: "2026-06-12", score: 86, result: "Passed", recordedBy: "Nimal Perera" },
  { id: "e2", student: "Kavindu Perera", studentId: "STD-2026-0048", examType: "Written Examination", attempt: 1, date: "2026-05-20", score: 74, result: "Passed", recordedBy: "Nimal Perera" },
  { id: "e3", student: "Tharindu Fernando", studentId: "STD-2026-0061", examType: "Written Examination", attempt: 1, date: "2026-06-28", score: 54, result: "Failed", recordedBy: "Admin" },
  { id: "e4", student: "Tharindu Fernando", studentId: "STD-2026-0061", examType: "Written Examination", attempt: 2, date: "2026-07-15", score: 79, result: "Passed", recordedBy: "Admin" },
  { id: "e5", student: "Nethmi Wijesinghe", studentId: "STD-2026-0068", examType: "Written Examination", attempt: 1, date: "2026-07-10", score: null, result: "Absent", recordedBy: "Nimal Perera" },
  { id: "e6", student: "Dilhara Senanayake", studentId: "STD-2026-0072", examType: "Written Examination", attempt: 1, date: "2026-07-22", score: null, result: "Pending", recordedBy: "—" },
];

const PRACTICAL: ExamResult[] = [
  { id: "p1", student: "Kavindu Perera", studentId: "STD-2026-0048", examType: "Practical Trial", attempt: 1, date: "2026-07-18", score: null, result: "Pending", recordedBy: "—" },
  { id: "p2", student: "Sanduni Jayasekara", studentId: "STD-2026-0052", examType: "Practical Trial", attempt: 1, date: "2026-07-05", score: 88, result: "Passed", recordedBy: "Kasun Silva" },
  { id: "p3", student: "Ruwan Wickramasinghe", studentId: "STD-2026-0044", examType: "Practical Trial", attempt: 1, date: "2026-06-14", score: 61, result: "Failed", recordedBy: "Kasun Silva" },
  { id: "p4", student: "Ruwan Wickramasinghe", studentId: "STD-2026-0044", examType: "Practical Trial", attempt: 2, date: "2026-07-01", score: 82, result: "Passed", recordedBy: "Kasun Silva" },
];

const TRIAL_ELIGIBLE: TrialEligible[] = [
  { id: "t1", student: "Kavindu Perera", studentId: "STD-2026-0048", permitEligibility: "2026-08-10", sessionsCompleted: 12, sessionsTarget: 15, readinessScore: 84, outstanding: ["3 more practical sessions"] },
  { id: "t2", student: "Sanduni Jayasekara", studentId: "STD-2026-0052", permitEligibility: "2026-07-28", sessionsCompleted: 20, sessionsTarget: 20, readinessScore: 96, outstanding: [] },
  { id: "t3", student: "Amaya Silva", studentId: "STD-2026-0039", permitEligibility: "2026-08-05", sessionsCompleted: 14, sessionsTarget: 15, readinessScore: 78, outstanding: ["1 practical session", "Medical certificate"] },
];

const STATUS_STYLE: Record<ExamStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  Passed: { color: "#166534", bg: "#DCFCE7", icon: <CheckCircle2 size={10} /> },
  Failed: { color: "#991B1B", bg: "#FEE2E2", icon: <XCircle size={10} /> },
  Pending: { color: "#92400E", bg: "#FEF3C7", icon: <Clock size={10} /> },
  Absent: { color: "#4B5563", bg: "#F3F4F6", icon: <AlertCircle size={10} /> },
};

/* ─── Record Result Modal ─── */

function RecordResultModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ student: "Kavindu Perera", examType: "Written Examination", attempt: "1", relatedEvent: "", date: "2026-07-22", score: "", result: "Passed", remarks: "" });

  const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: 14, paddingRight: 32, cursor: "pointer" };
  const label = (t: string, req?: boolean) => <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" }}>{t}{req && <span style={{ color: "#DC2626" }}> *</span>}</label>;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 99 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#ffffff", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.18)", zIndex: 100, width: 520, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>Record exam result</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Log a written examination or practical trial outcome</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}><X size={14} /></button>
        </div>

        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            {label("Student", true)}
            <select style={selectStyle} value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
              {["Kavindu Perera", "Sanduni Jayasekara", "Tharindu Fernando", "Nethmi Wijesinghe", "Dilhara Senanayake"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            {label("Exam type", true)}
            <select style={selectStyle} value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
              <option>Written Examination</option><option>Practical Trial</option>
            </select>
          </div>
          <div>
            {label("Attempt number")}
            <select style={selectStyle} value={form.attempt} onChange={(e) => setForm({ ...form, attempt: e.target.value })}>
              <option value="1">Attempt 1</option><option value="2">Attempt 2</option><option value="3">Attempt 3</option>
            </select>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            {label("Related event (optional)")}
            <input style={inputStyle} placeholder="e.g. WE-2026-07-22 / Written exam session" value={form.relatedEvent} onChange={(e) => setForm({ ...form, relatedEvent: e.target.value })} />
          </div>
          <div>
            {label("Date", true)}
            <input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            {label("Score (%)")}
            <input type="number" min={0} max={100} style={inputStyle} placeholder="e.g. 86" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            {label("Result", true)}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {(["Passed", "Failed", "Pending", "Absent"] as ExamStatus[]).map(r => {
                const s = STATUS_STYLE[r];
                const sel = form.result === r;
                return (
                  <button key={r} onClick={() => setForm({ ...form, result: r })}
                    style={{ height: 38, borderRadius: 8, border: `1.5px solid ${sel ? s.color : "#E2E8F0"}`, background: sel ? s.bg : "#ffffff", color: sel ? s.color : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            {label("Remarks (optional)")}
            <textarea style={{ width: "100%", height: 64, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
              placeholder="Any notes about this result..." value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save result</button>
        </div>
      </div>
    </>
  );
}

/* ─── Results table ─── */

function ResultsTable({ rows }: { rows: ExamResult[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
            {["Student", "Exam type", "Attempt", "Date", "Score", "Result", "Recorded by", "Actions"].map(h => (
              <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const ss = STATUS_STYLE[r.result];
            return (
              <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{r.student}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{r.studentId}</div>
                </td>
                <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 12, color: "#475569" }}>{r.examType}</span></td>
                <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 12, color: "#64748B" }}>Attempt {r.attempt}</span></td>
                <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 13, color: "#475569" }}>{new Date(r.date).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</span></td>
                <td style={{ padding: "12px 16px" }}>
                  {r.score !== null ? (
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.score >= 75 ? "#16A34A" : r.score >= 60 ? "#F59E0B" : "#DC2626" }}>{r.score}%</span>
                  ) : <span style={{ fontSize: 12, color: "#94A3B8" }}>—</span>}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: ss.color, background: ss.bg }}>
                    {ss.icon}{r.result}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 13, color: "#475569" }}>{r.recordedBy}</span></td>
                <td style={{ padding: "12px 16px", position: "relative" }}>
                  <button onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                    style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>
                    <MoreHorizontal size={14} />
                  </button>
                  {openMenu === r.id && (
                    <>
                      <div onClick={() => setOpenMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
                      <div style={{ position: "absolute", right: 8, top: 44, background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, minWidth: 150, overflow: "hidden" }}>
                        {["View details", "Edit result", "Print certificate"].map(a => (
                          <button key={a} onClick={() => setOpenMenu(null)}
                            style={{ width: "100%", padding: "9px 14px", border: "none", background: "transparent", color: "#374151", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>{a}</button>
                        ))}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Trial Eligible table ─── */

function TrialEligibleTable() {
  return (
    <div>
      {/* Info banner */}
      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Target size={16} color="#2563EB" />
        <span style={{ fontSize: 13, color: "#1D4ED8" }}>Students listed here meet or are approaching the criteria for a practical trial. Review readiness scores before scheduling.</span>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {["Student", "Permit eligibility date", "Sessions completed", "Readiness score", "Outstanding requirements", "Action"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRIAL_ELIGIBLE.map((s, i) => {
              const ready = s.outstanding.length === 0;
              const pct = Math.round((s.sessionsCompleted / s.sessionsTarget) * 100);
              return (
                <tr key={s.id} style={{ borderBottom: i < TRIAL_ELIGIBLE.length - 1 ? "1px solid #F1F5F9" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{s.student}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{s.studentId}</div>
                  </td>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontSize: 13, color: "#475569" }}>{new Date(s.permitEligibility).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</span></td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 56, height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: pct === 100 ? "#16A34A" : "#2563EB" }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#475569" }}>{s.sessionsCompleted}/{s.sessionsTarget}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: s.readinessScore >= 90 ? "#16A34A" : s.readinessScore >= 75 ? "#2563EB" : "#F59E0B" }}>{s.readinessScore}%</span>
                      {s.readinessScore >= 90 && <CheckCircle2 size={13} color="#16A34A" />}
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    {s.outstanding.length === 0 ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#16A34A", fontWeight: 600 }}><CheckCircle2 size={12} />All requirements met</span>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {s.outstanding.map(o => <span key={o} style={{ fontSize: 11, color: "#92400E", background: "#FEF3C7", padding: "2px 7px", borderRadius: 4 }}>{o}</span>)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <button style={{ height: 34, padding: "0 12px", borderRadius: 7, border: `1.5px solid ${ready ? "#16A34A" : "#E2E8F0"}`, background: ready ? "#DCFCE7" : "#ffffff", color: ready ? "#166534" : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {ready ? "Schedule trial" : "View gaps"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main export ─── */

type ExamTab = "written" | "practical" | "eligible";

export function ExamsTrials() {
  const [tab, setTab] = useState<ExamTab>("written");
  const [showRecord, setShowRecord] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const tabs: { id: ExamTab; label: string; count: number }[] = [
    { id: "written", label: "Written Examinations", count: WRITTEN.length },
    { id: "practical", label: "Practical Trials", count: PRACTICAL.length },
    { id: "eligible", label: "Trial-Eligible Students", count: TRIAL_ELIGIBLE.length },
  ];

  const rows = tab === "written" ? WRITTEN : PRACTICAL;
  const filtered = rows.filter(r => {
    if (search && !r.student.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "All" && r.result !== statusFilter) return false;
    return true;
  });

  const summary = [
    { label: "Total results", value: rows.length, color: "#1E293B" },
    { label: "Passed", value: rows.filter(r => r.result === "Passed").length, color: "#16A34A" },
    { label: "Failed", value: rows.filter(r => r.result === "Failed").length, color: "#DC2626" },
    { label: "Pending", value: rows.filter(r => r.result === "Pending").length, color: "#F59E0B" },
  ];

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 28px 0 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  return (
    <div>
      {showRecord && <RecordResultModal onClose={() => setShowRecord(false)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Exams & Trial Results</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>Track written examination and practical trial outcomes for all students</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 5, height: 40, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Download size={13} />Export
          </button>
          <button onClick={() => setShowRecord(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 18px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={14} />Record result
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {tab !== "eligible" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
          {summary.map(({ label, value, color }) => (
            <div key={label} style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #E2E8F0", gap: 2, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: "10px 16px", fontSize: 14, fontWeight: 500, color: tab === t.id ? "#2563EB" : "#64748B", borderBottom: tab === t.id ? "2px solid #2563EB" : "2px solid transparent", marginBottom: -2, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
            {t.label}
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px", height: 18, borderRadius: 9, background: tab === t.id ? "#DBEAFE" : "#F1F5F9", color: tab === t.id ? "#2563EB" : "#64748B", fontSize: 11, fontWeight: 600 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "eligible" ? (
        <TrialEligibleTable />
      ) : (
        <>
          {/* Toolbar */}
          <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input placeholder="Search by student name…" value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px 0 32px", fontSize: 13, color: "#1E293B", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {["All", "Passed", "Failed", "Pending", "Absent"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <ResultsTable rows={filtered} />
        </>
      )}
    </div>
  );
}
