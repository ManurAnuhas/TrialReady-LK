import React, { useState } from "react";
import {
  Plus, Check, Pencil, Users, ToggleLeft, ToggleRight, X,
  Car, ChevronDown, Package, Star,
} from "lucide-react";

/* ─── Data ─── */

interface TrainingPackage {
  id: string;
  name: string;
  category: "Light Vehicle" | "Motorcycle" | "Three-Wheeler" | "Heavy Vehicle" | "Dual Purpose";
  price: number;
  features: string[];
  sessions: { practical: number; theory: number; trialPrep?: number; trialSimulation?: number };
  activeStudents: number;
  status: "Active" | "Inactive";
  tag?: string;
}

const PACKAGES: TrainingPackage[] = [
  {
    id: "pkg1",
    name: "Standard Light Vehicle Package",
    category: "Light Vehicle",
    price: 45000,
    features: [
      "15 practical sessions (60 min each)",
      "6 theory classes (2 hrs each)",
      "1 trial-preparation session",
      "Written examination coaching",
      "Student portal access",
    ],
    sessions: { practical: 15, theory: 6, trialPrep: 1 },
    activeStudents: 127,
    status: "Active",
  },
  {
    id: "pkg2",
    name: "Premium Light Vehicle Package",
    category: "Light Vehicle",
    price: 62500,
    features: [
      "20 practical sessions (60 min each)",
      "8 theory classes (2 hrs each)",
      "2 trial simulation sessions",
      "1-on-1 written exam coaching",
      "Priority instructor assignment",
      "Student portal access",
    ],
    sessions: { practical: 20, theory: 8, trialSimulation: 2 },
    activeStudents: 43,
    status: "Active",
    tag: "Most Popular",
  },
  {
    id: "pkg3",
    name: "Motorcycle Starter Package",
    category: "Motorcycle",
    price: 28000,
    features: [
      "10 practical sessions (60 min each)",
      "4 theory classes (2 hrs each)",
      "Safety gear orientation module",
      "Student portal access",
    ],
    sessions: { practical: 10, theory: 4 },
    activeStudents: 31,
    status: "Active",
  },
  {
    id: "pkg4",
    name: "Three-Wheeler Package",
    category: "Three-Wheeler",
    price: 22000,
    features: [
      "12 practical sessions (60 min each)",
      "4 theory classes (2 hrs each)",
      "Commercial operations module",
      "Student portal access",
    ],
    sessions: { practical: 12, theory: 4 },
    activeStudents: 14,
    status: "Active",
  },
  {
    id: "pkg5",
    name: "Heavy Vehicle Package",
    category: "Heavy Vehicle",
    price: 68000,
    features: [
      "25 practical sessions (90 min each)",
      "8 theory classes (2 hrs each)",
      "2 trial simulation sessions",
      "Hazard perception module",
      "Student portal access",
    ],
    sessions: { practical: 25, theory: 8, trialSimulation: 2 },
    activeStudents: 9,
    status: "Active",
  },
];

const CATEGORY_STYLES: Record<string, { color: string; bg: string; gradient: string }> = {
  "Light Vehicle": { color: "#1D4ED8", bg: "#EFF6FF", gradient: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)" },
  Motorcycle: { color: "#C2410C", bg: "#FFF7ED", gradient: "linear-gradient(135deg, #FED7AA 0%, #FFF7ED 100%)" },
  "Three-Wheeler": { color: "#0E7490", bg: "#ECFEFF", gradient: "linear-gradient(135deg, #CFFAFE 0%, #ECFEFF 100%)" },
  "Heavy Vehicle": { color: "#991B1B", bg: "#FFF1F2", gradient: "linear-gradient(135deg, #FECDD3 0%, #FFF1F2 100%)" },
  "Dual Purpose": { color: "#6D28D9", bg: "#F5F3FF", gradient: "linear-gradient(135deg, #DDD6FE 0%, #F5F3FF 100%)" },
};

/* ─── Edit Package Modal ─── */

function EditPackageModal({ pkg, onClose }: { pkg: TrainingPackage; onClose: () => void }) {
  const [form, setForm] = useState({ name: pkg.name, price: String(pkg.price), status: pkg.status });

  const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 99 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#ffffff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 100, width: 480, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>Edit package</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}><X size={14} /></button>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Package name</label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Vehicle category</label>
              <div style={{ height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#94A3B8", display: "flex", alignItems: "center", background: "#F8FAFC" }}>{pkg.category}</div>
            </div>
            <div>
              <label style={labelStyle}>Package price (LKR)</label>
              <input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Active", "Inactive"].map((s) => (
                <button key={s} onClick={() => setForm({ ...form, status: s as any })}
                  style={{ flex: 1, height: 38, borderRadius: 8, border: `1.5px solid ${form.status === s ? "#2563EB" : "#E2E8F0"}`, background: form.status === s ? "#EFF6FF" : "#ffffff", color: form.status === s ? "#2563EB" : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save changes</button>
        </div>
      </div>
    </>
  );
}

/* ─── Package card ─── */

function PackageCard({ pkg, onEdit }: { pkg: TrainingPackage; onEdit: () => void }) {
  const style = CATEGORY_STYLES[pkg.category] || CATEGORY_STYLES["Light Vehicle"];

  const sessionSummary: string[] = [];
  if (pkg.sessions.practical) sessionSummary.push(`${pkg.sessions.practical} practical sessions`);
  if (pkg.sessions.theory) sessionSummary.push(`${pkg.sessions.theory} theory classes`);
  if (pkg.sessions.trialPrep) sessionSummary.push(`${pkg.sessions.trialPrep} trial-prep session`);
  if (pkg.sessions.trialSimulation) sessionSummary.push(`${pkg.sessions.trialSimulation} trial simulations`);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Tag */}
      {pkg.tag && (
        <div style={{ position: "absolute", top: 14, right: 14, padding: "3px 10px", borderRadius: 6, background: "#FEF3C7", border: "1px solid #FDE68A", fontSize: 11, fontWeight: 700, color: "#92400E", display: "flex", alignItems: "center", gap: 4, zIndex: 1 }}>
          <Star size={10} fill="#F59E0B" color="#F59E0B" />{pkg.tag}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "20px 22px 18px", background: style.gradient, borderBottom: `1px solid ${style.bg}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: style.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", lineHeight: 1.3, marginBottom: 4 }}>{pkg.name}</div>
            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: style.color, background: "#ffffff", border: `1px solid ${style.color}30` }}>{pkg.category}</span>
          </div>
        </div>

        {/* Session summary pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sessionSummary.map((s) => (
            <span key={s} style={{ padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 500, color: style.color, background: "rgba(255,255,255,0.7)", border: `1px solid ${style.color}20` }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ flex: 1, padding: "16px 22px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>What's included</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pkg.features.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: style.bg, border: `1px solid ${style.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Check size={9} color={style.color} />
              </div>
              <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 22px", borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.02em" }}>
            LKR {pkg.price.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <Users size={12} color="#94A3B8" />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{pkg.activeStudents} active students</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: pkg.status === "Active" ? "#166534" : "#64748B", background: pkg.status === "Active" ? "#DCFCE7" : "#F1F5F9" }}>{pkg.status}</span>
          <button onClick={onEdit}
            style={{ display: "flex", alignItems: "center", gap: 5, height: 34, padding: "0 12px", borderRadius: 7, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Pencil size={12} />Edit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Package Modal ─── */

function AddPackageModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", category: "Light Vehicle", price: "", practical: "", theory: "", trialPrep: "" });
  const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: 14, paddingRight: 32, cursor: "pointer" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 99 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#ffffff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 100, width: 520, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>Add training package</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Create a new package for student enrolment</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}><X size={14} /></button>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Package name <span style={{ color: "#DC2626" }}>*</span></label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Standard Light Vehicle Package" />
          </div>
          <div>
            <label style={labelStyle}>Vehicle category</label>
            <select style={selectStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Light Vehicle</option><option>Motorcycle</option><option>Three-Wheeler</option><option>Heavy Vehicle</option><option>Dual Purpose</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Package price (LKR) <span style={{ color: "#DC2626" }}>*</span></label>
            <input type="number" style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 45000" />
          </div>
          <div>
            <label style={labelStyle}>Practical sessions</label>
            <input type="number" style={inputStyle} value={form.practical} onChange={(e) => setForm({ ...form, practical: e.target.value })} placeholder="e.g. 15" />
          </div>
          <div>
            <label style={labelStyle}>Theory classes</label>
            <input type="number" style={inputStyle} value={form.theory} onChange={(e) => setForm({ ...form, theory: e.target.value })} placeholder="e.g. 6" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Trial-prep sessions (optional)</label>
            <input type="number" style={inputStyle} value={form.trialPrep} onChange={(e) => setForm({ ...form, trialPrep: e.target.value })} placeholder="e.g. 1" />
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Create package</button>
        </div>
      </div>
    </>
  );
}

/* ─── Main export ─── */

export function PackageManagement() {
  const [editPkg, setEditPkg] = useState<TrainingPackage | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = PACKAGES.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 28px 0 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  return (
    <div>
      {editPkg && <EditPackageModal pkg={editPkg} onClose={() => setEditPkg(null)} />}
      {showAdd && <AddPackageModal onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Training Packages</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>{PACKAGES.length} packages · {PACKAGES.filter(p => p.status === "Active").length} active · {PACKAGES.reduce((s, p) => s + p.activeStudents, 0)} students enrolled</div>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 18px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={14} />Add package
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>Filter:</span>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selectStyle}>
          <option value="">All categories</option>
          <option>Light Vehicle</option><option>Motorcycle</option><option>Three-Wheeler</option><option>Heavy Vehicle</option><option>Dual Purpose</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All statuses</option><option>Active</option><option>Inactive</option>
        </select>
        {(catFilter || statusFilter) && (
          <button onClick={() => { setCatFilter(""); setStatusFilter(""); }}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", color: "#64748B", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <X size={11} />Clear
          </button>
        )}
        <div style={{ marginLeft: "auto", fontSize: 13, color: "#94A3B8" }}>{filtered.length} packages shown</div>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total packages", value: PACKAGES.length, color: "#1E293B" },
          { label: "Active packages", value: PACKAGES.filter(p => p.status === "Active").length, color: "#16A34A" },
          { label: "Total active students", value: PACKAGES.reduce((s, p) => s + p.activeStudents, 0), color: "#2563EB" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Package cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onEdit={() => setEditPkg(pkg)} />
        ))}
      </div>
    </div>
  );
}
