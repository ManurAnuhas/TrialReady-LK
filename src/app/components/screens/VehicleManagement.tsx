import React, { useState, useRef, useEffect } from "react";
import {
  Search, Plus, MoreVertical, Pencil, Wrench, CalendarDays,
  ChevronLeft, ChevronRight, X, Car, SlidersHorizontal,
  AlertTriangle, Check, Clock,
} from "lucide-react";

/* ─── Data ─── */

type VehicleStatus = "Available" | "In use" | "Under maintenance";
type MaintenanceStatus = "Good condition" | "Service due soon" | "Repair required";

interface Vehicle {
  id: string;
  reg: string;
  make: string;
  model: string;
  category: "Light Vehicle" | "Motorcycle" | "Three-Wheeler" | "Heavy Vehicle";
  transmission: "Manual" | "Auto";
  status: VehicleStatus;
  maintenance: MaintenanceStatus;
  insuranceExpiry: string;
  nextSession: string | null;
  year: number;
  colour: string;
}

const VEHICLES: Vehicle[] = [
  { id: "v1", reg: "BAA-4521", make: "Suzuki", model: "Alto", category: "Light Vehicle", transmission: "Manual", status: "Available", maintenance: "Good condition", insuranceExpiry: "12 Dec 2026", nextSession: "Thu 24 Jul · 09:00", year: 2019, colour: "White" },
  { id: "v2", reg: "CAG-8820", make: "Toyota", model: "Aqua", category: "Light Vehicle", transmission: "Auto", status: "In use", maintenance: "Good condition", insuranceExpiry: "04 Feb 2027", nextSession: "Currently in use", year: 2021, colour: "Silver" },
  { id: "v3", reg: "CAB-3187", make: "Honda", model: "Fit", category: "Light Vehicle", transmission: "Auto", status: "Available", maintenance: "Service due soon", insuranceExpiry: "18 Jan 2027", nextSession: "Fri 25 Jul · 14:00", year: 2020, colour: "Blue" },
  { id: "v4", reg: "BDL-7402", make: "Bajaj", model: "RE Three-Wheeler", category: "Three-Wheeler", transmission: "Manual", status: "Under maintenance", maintenance: "Repair required", insuranceExpiry: "22 Nov 2026", nextSession: null, year: 2018, colour: "Yellow" },
  { id: "v5", reg: "CBE-3310", make: "Maruti", model: "Swift Dzire", category: "Light Vehicle", transmission: "Manual", status: "Available", maintenance: "Good condition", insuranceExpiry: "30 Mar 2027", nextSession: "Thu 24 Jul · 13:00", year: 2022, colour: "Red" },
  { id: "v6", reg: "CBK-9012", make: "Honda", model: "CB150F", category: "Motorcycle", transmission: "Manual", status: "Available", maintenance: "Good condition", insuranceExpiry: "15 Jun 2027", nextSession: "Fri 25 Jul · 09:00", year: 2021, colour: "Black" },
];

const STATUS_COLORS: Record<VehicleStatus, { color: string; bg: string }> = {
  Available: { color: "#166534", bg: "#DCFCE7" },
  "In use": { color: "#1D4ED8", bg: "#DBEAFE" },
  "Under maintenance": { color: "#92400E", bg: "#FEF3C7" },
};

const MAINTENANCE_COLORS: Record<MaintenanceStatus, { color: string; icon: React.ReactNode }> = {
  "Good condition": { color: "#16A34A", icon: <Check size={12} /> },
  "Service due soon": { color: "#F59E0B", icon: <Clock size={12} /> },
  "Repair required": { color: "#DC2626", icon: <AlertTriangle size={12} /> },
};

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  "Light Vehicle": { color: "#1D4ED8", bg: "#DBEAFE" },
  Motorcycle: { color: "#C2410C", bg: "#FFF7ED" },
  "Three-Wheeler": { color: "#0E7490", bg: "#CFFAFE" },
  "Heavy Vehicle": { color: "#991B1B", bg: "#FEE2E2" },
};

/* ─── Metric card ─── */

function MetricCard({ label, value, sub, color = "#1E293B" }: { label: string; value: number; sub: string; color?: string }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", flex: 1 }}>
      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#CBD5E1" }}>{sub}</div>
    </div>
  );
}

/* ─── Badge ─── */

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 500, color, background: bg, whiteSpace: "nowrap" }}>{label}</span>
  );
}

/* ─── Action menu ─── */

function ActionMenu({ reg }: { reg: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid transparent", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = open ? "#F1F5F9" : "transparent")}>
        <MoreVertical size={16} />
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 50, minWidth: 200, padding: 4 }}>
          {[
            { icon: <Pencil size={13} />, label: "Edit vehicle" },
            { icon: <CalendarDays size={13} />, label: "View schedule" },
            { icon: <Wrench size={13} />, label: "Mark for maintenance" },
          ].map(({ icon, label }) => (
            <button key={label} onClick={() => setOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#1E293B", textAlign: "left", fontFamily: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              {icon}{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Insurance expiry warning ─── */

function ExpiryCell({ dateStr }: { dateStr: string }) {
  const parts = dateStr.split(" ");
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const expiry = new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
  const today = new Date(2026, 6, 22);
  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const color = daysLeft < 60 ? "#DC2626" : daysLeft < 120 ? "#F59E0B" : "#475569";
  return (
    <div>
      <div style={{ fontSize: 13, color: "#1E293B" }}>{dateStr}</div>
      {daysLeft < 120 && (
        <div style={{ fontSize: 11, color, marginTop: 2 }}>
          {daysLeft < 0 ? "EXPIRED" : `${daysLeft} days remaining`}
        </div>
      )}
    </div>
  );
}

/* ─── Add Vehicle Modal ─── */

function AddVehicleModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ reg: "", make: "", model: "", category: "Light Vehicle", transmission: "Manual", colour: "", year: "", insuranceExpiry: "" });

  const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: 14, paddingRight: 32, cursor: "pointer" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 99 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#ffffff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 100, width: 520, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>Add vehicle</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Register a new vehicle in the fleet</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}><X size={14} /></button>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Registration number <span style={{ color: "#DC2626" }}>*</span></label>
            <input style={inputStyle} value={form.reg} onChange={(e) => setForm({ ...form, reg: e.target.value })} placeholder="e.g. BAA-4521" />
          </div>
          <div>
            <label style={labelStyle}>Make <span style={{ color: "#DC2626" }}>*</span></label>
            <input style={inputStyle} value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="e.g. Suzuki" />
          </div>
          <div>
            <label style={labelStyle}>Model <span style={{ color: "#DC2626" }}>*</span></label>
            <input style={inputStyle} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="e.g. Alto" />
          </div>
          <div>
            <label style={labelStyle}>Vehicle category</label>
            <select style={selectStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Light Vehicle</option>
              <option>Motorcycle</option>
              <option>Three-Wheeler</option>
              <option>Heavy Vehicle</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Transmission</label>
            <select style={selectStyle} value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
              <option>Manual</option>
              <option>Auto</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year</label>
            <input style={inputStyle} type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2022" />
          </div>
          <div>
            <label style={labelStyle}>Colour</label>
            <input style={inputStyle} value={form.colour} onChange={(e) => setForm({ ...form, colour: e.target.value })} placeholder="e.g. White" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Insurance expiry date</label>
            <input type="date" style={inputStyle} value={form.insuranceExpiry} onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })} />
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add vehicle</button>
        </div>
      </div>
    </>
  );
}

/* ─── Main export ─── */

export function VehicleManagement() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = VEHICLES.filter((v) => {
    const q = search.toLowerCase();
    if (q && !v.reg.toLowerCase().includes(q) && !v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false;
    if (catFilter && v.category !== catFilter) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    return true;
  });

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 28px 0 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  return (
    <div>
      {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} />}

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Vehicles</h1>
        <div style={{ fontSize: 13, color: "#64748B" }}>{VEHICLES.length} vehicles in fleet · {VEHICLES.filter(v => v.status === "Available").length} available</div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <MetricCard label="Total vehicles" value={24} sub="in fleet" color="#1E293B" />
        <MetricCard label="Available" value={18} sub="ready to use" color="#16A34A" />
        <MetricCard label="In use" value={4} sub="currently on road" color="#2563EB" />
        <MetricCard label="Under maintenance" value={2} sub="not available" color="#F59E0B" />
      </div>

      {/* Toolbar */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
          <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search registration or model…"
            style={{ width: "100%", height: 38, paddingLeft: 32, paddingRight: 10, borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <SlidersHorizontal size={13} color="#94A3B8" />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selectStyle}>
          <option value="">All categories</option>
          <option value="Light Vehicle">Light Vehicle</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Three-Wheeler">Three-Wheeler</option>
          <option value="Heavy Vehicle">Heavy Vehicle</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All statuses</option>
          <option value="Available">Available</option>
          <option value="In use">In use</option>
          <option value="Under maintenance">Under maintenance</option>
        </select>
        {(search || catFilter || statusFilter) && (
          <button onClick={() => { setSearch(""); setCatFilter(""); setStatusFilter(""); }}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", color: "#64748B", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <X size={11} />Clear
          </button>
        )}
        <button onClick={() => setShowAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 16px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
          <Plus size={14} />Add vehicle
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Registration", "Make & Model", "Category", "Availability", "Maintenance", "Insurance Expiry", "Next Session", ""].map((h) => (
                <th key={h} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, idx) => {
              const mc = MAINTENANCE_COLORS[v.maintenance];
              return (
                <tr key={v.id} style={{ borderTop: idx > 0 ? "1px solid #F1F5F9" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Car size={15} color="#64748B" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", fontFamily: "monospace" }}>{v.reg}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{v.make} {v.model}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{v.year} · {v.colour} · {v.transmission}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge label={v.category} color={CATEGORY_COLORS[v.category]?.color || "#475569"} bg={CATEGORY_COLORS[v.category]?.bg || "#F1F5F9"} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge label={v.status} color={STATUS_COLORS[v.status].color} bg={STATUS_COLORS[v.status].bg} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ color: mc.color, display: "flex" }}>{mc.icon}</span>
                      <span style={{ fontSize: 13, color: mc.color }}>{v.maintenance}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}><ExpiryCell dateStr={v.insuranceExpiry} /></td>
                  <td style={{ padding: "12px 14px" }}>
                    {v.nextSession ? (
                      <span style={{ fontSize: 13, color: "#475569" }}>{v.nextSession}</span>
                    ) : (
                      <span style={{ fontSize: 13, color: "#CBD5E1", fontStyle: "italic" }}>None scheduled</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 10px" }}><ActionMenu reg={v.reg} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #F1F5F9", background: "#FAFBFC" }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Showing {filtered.length} of {VEHICLES.length} vehicles</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[ChevronLeft, ChevronRight].map((Icon, i) => (
              <button key={i} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}><Icon size={14} /></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
