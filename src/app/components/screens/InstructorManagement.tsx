import React, { useState, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal, UserPlus, MoreVertical, Eye, Pencil,
  UserX, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X,
  Users, Star, Check,
} from "lucide-react";
import { InstructorProfile } from "./InstructorProfile";

/* ─── Data ─── */

interface Instructor {
  id: string;
  code: string;
  initials: string;
  name: string;
  email: string;
  categories: string[];
  assignedStudents: number;
  sessionsToday: number;
  availability: "Available" | "On leave" | "Fully booked";
  status: "Active" | "Inactive";
  rating: number;
}

const INSTRUCTORS: Instructor[] = [
  { id: "ins1", code: "INS-0014", initials: "KS", name: "Kasun Silva", email: "kasun.silva@metrodrive.lk", categories: ["Light Vehicle", "Dual Purpose"], assignedStudents: 32, sessionsToday: 6, availability: "Available", status: "Active", rating: 4.8 },
  { id: "ins2", code: "INS-0009", initials: "MF", name: "Malini Fernando", email: "malini.f@metrodrive.lk", categories: ["Motorcycle", "Light Vehicle"], assignedStudents: 27, sessionsToday: 4, availability: "Available", status: "Active", rating: 4.6 },
  { id: "ins3", code: "INS-0018", initials: "RJ", name: "Ruwan Jayasinghe", email: "ruwan.j@metrodrive.lk", categories: ["Three-Wheeler", "Light Vehicle"], assignedStudents: 21, sessionsToday: 3, availability: "On leave", status: "Active", rating: 4.5 },
  { id: "ins4", code: "INS-0006", initials: "PD", name: "Priya Dissanayake", email: "priya.d@metrodrive.lk", categories: ["Motorcycle"], assignedStudents: 18, sessionsToday: 0, availability: "Fully booked", status: "Active", rating: 4.7 },
];

const AVAILABILITY_COLORS: Record<string, { color: string; bg: string }> = {
  Available: { color: "#166534", bg: "#DCFCE7" },
  "On leave": { color: "#92400E", bg: "#FEF3C7" },
  "Fully booked": { color: "#991B1B", bg: "#FEE2E2" },
};

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  "Light Vehicle": { color: "#1D4ED8", bg: "#DBEAFE" },
  Motorcycle: { color: "#C2410C", bg: "#FFF7ED" },
  "Three-Wheeler": { color: "#0E7490", bg: "#CFFAFE" },
  "Dual Purpose": { color: "#6D28D9", bg: "#EDE9FE" },
  "Heavy Vehicle": { color: "#991B1B", bg: "#FEE2E2" },
};

/* ─── Metric card ─── */

function MetricCard({ label, value, sub, color = "#2563EB" }: { label: string; value: string | number; sub: string; color?: string }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", flex: 1 }}>
      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#CBD5E1" }}>{sub}</div>
    </div>
  );
}

/* ─── Badge ─── */

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 5, fontSize: 11, fontWeight: 500, color, background: bg, whiteSpace: "nowrap" }}>{label}</span>
  );
}

/* ─── Action menu ─── */

function ActionMenu({ onViewProfile }: { onViewProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const items = [
    { icon: <Eye size={14} />, label: "View profile", onClick: onViewProfile },
    { icon: <Pencil size={14} />, label: "Edit", onClick: undefined },
    { icon: <Users size={14} />, label: "Assign student", onClick: undefined },
    { icon: <UserX size={14} />, label: "Mark on leave", onClick: undefined, danger: false },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid transparent", background: open ? "#F1F5F9" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = open ? "#F1F5F9" : "transparent")}>
        <MoreVertical size={16} />
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 50, minWidth: 180, padding: 4 }}>
          {items.map(({ icon, label, onClick }) => (
            <button key={label} onClick={() => { setOpen(false); onClick?.(); }}
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

/* ─── Sortable header ─── */

function SortHeader({ label, field, sortField, sortDir, onSort }: { label: string; field: string; sortField: string; sortDir: "asc" | "desc"; onSort: (f: string) => void }) {
  const active = sortField === field;
  return (
    <th onClick={() => onSort(field)}
      style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: active ? "#2563EB" : "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        <span style={{ opacity: active ? 1 : 0.3 }}>{active && sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
      </span>
    </th>
  );
}

/* ─── Stars ─── */

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Star size={12} fill="#F59E0B" color="#F59E0B" />
      <span style={{ fontSize: 12, color: "#64748B", marginLeft: 3 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

/* ─── Main export ─── */

type IView = "list" | "profile";

export function InstructorManagement() {
  const [view, setView] = useState<IView>("list");
  const [search, setSearch] = useState("");
  const [availFilter, setAvailFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(f); setSortDir("asc"); }
  };

  if (view === "profile") {
    return <InstructorProfile onBack={() => setView("list")} />;
  }

  const filtered = INSTRUCTORS.filter((i) => {
    const q = search.toLowerCase();
    if (q && !i.name.toLowerCase().includes(q) && !i.code.toLowerCase().includes(q) && !i.email.toLowerCase().includes(q)) return false;
    if (availFilter && i.availability !== availFilter) return false;
    if (catFilter && !i.categories.includes(catFilter)) return false;
    if (statusFilter && i.status !== statusFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av = "", bv = "";
    if (sortField === "name") { av = a.name; bv = b.name; }
    else if (sortField === "students") { return sortDir === "asc" ? a.assignedStudents - b.assignedStudents : b.assignedStudents - a.assignedStudents; }
    else if (sortField === "sessions") { return sortDir === "asc" ? a.sessionsToday - b.sessionsToday : b.sessionsToday - a.sessionsToday; }
    const cmp = av.localeCompare(bv);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 28px 0 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  const hasFilter = search || availFilter || catFilter || statusFilter;

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Instructors</h1>
        <div style={{ fontSize: 13, color: "#64748B" }}>{INSTRUCTORS.length} instructors · {INSTRUCTORS.filter(i => i.availability === "Available").length} available today</div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <MetricCard label="Total instructors" value={18} sub="on staff" color="#1E293B" />
        <MetricCard label="Available today" value={16} sub="ready to take sessions" color="#16A34A" />
        <MetricCard label="On leave" value={1} sub="Ruwan Jayasinghe" color="#F59E0B" />
        <MetricCard label="Fully booked" value={1} sub="no remaining capacity" color="#DC2626" />
      </div>

      {/* Toolbar */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search instructors…"
              style={{ width: "100%", height: 38, paddingLeft: 32, paddingRight: 10, borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}><X size={12} /></button>}
          </div>

          {hasFilter && <div style={{ padding: "3px 10px", borderRadius: 6, background: "#DBEAFE", fontSize: 12, fontWeight: 600, color: "#2563EB" }}>{filtered.length} of {INSTRUCTORS.length}</div>}

          <button onClick={() => setView("list")}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 16px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
            <UserPlus size={14} />Add instructor
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={13} color="#94A3B8" />
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Filter:</span>
          {[
            { value: availFilter, onChange: setAvailFilter, placeholder: "Availability", options: ["Available", "On leave", "Fully booked"] },
            { value: catFilter, onChange: setCatFilter, placeholder: "Vehicle category", options: ["Light Vehicle", "Motorcycle", "Three-Wheeler", "Dual Purpose"] },
            { value: statusFilter, onChange: setStatusFilter, placeholder: "Status", options: ["Active", "Inactive"] },
          ].map(({ value, onChange, placeholder, options }) => (
            <select key={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
              style={{ ...selectStyle, borderColor: value ? "#2563EB" : "#E2E8F0", color: value ? "#2563EB" : "#475569" }}>
              <option value="">{placeholder}</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {hasFilter && (
            <button onClick={() => { setSearch(""); setAvailFilter(""); setCatFilter(""); setStatusFilter(""); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", color: "#64748B", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              <X size={11} />Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <SortHeader label="Instructor" field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Instructor Code</th>
              <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Licensed Categories</th>
              <SortHeader label="Assigned Students" field="students" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortHeader label="Today's Sessions" field="sessions" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Availability</th>
              <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>Status</th>
              <th style={{ padding: "10px 14px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", width: 44 }} />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={8}>
                <div style={{ padding: "56px 32px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>No instructors found</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>Try adjusting your search or filters.</div>
                </div>
              </td></tr>
            ) : sorted.map((inst, idx) => (
              <tr key={inst.id} style={{ borderTop: idx > 0 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #DCFCE7, #DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#16A34A", flexShrink: 0 }}>{inst.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{inst.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{inst.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#475569", fontFamily: "monospace" }}>{inst.code}</span></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {inst.categories.map((c) => (
                      <Badge key={c} label={c} color={CATEGORY_COLORS[c]?.color || "#475569"} bg={CATEGORY_COLORS[c]?.bg || "#F1F5F9"} />
                    ))}
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 600 }}>{inst.assignedStudents}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>students</div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 600 }}>{inst.sessionsToday}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}><Stars rating={inst.rating} /></div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <Badge label={inst.availability} color={AVAILABILITY_COLORS[inst.availability].color} bg={AVAILABILITY_COLORS[inst.availability].bg} />
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <Badge label={inst.status} color="#166534" bg="#DCFCE7" />
                </td>
                <td style={{ padding: "12px 10px" }}>
                  <ActionMenu onViewProfile={() => setView("profile")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorted.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #F1F5F9", background: "#FAFBFC" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>Showing {sorted.length} of {INSTRUCTORS.length} instructors</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[ChevronLeft, ChevronRight].map((Icon, i) => (
                <button key={i} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}><Icon size={14} /></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
