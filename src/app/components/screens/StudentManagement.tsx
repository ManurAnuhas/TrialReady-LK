import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  UserPlus,
  MoreVertical,
  Eye,
  Pencil,
  Bell,
  UserX,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  CheckCircle2,
  AlertCircle,
  PartyPopper,
  Copy,
  ArrowRight,
  User,
} from "lucide-react";
import { StudentRegistrationWizard } from "./StudentRegistrationWizard";
import { StudentProfile } from "./StudentProfile";
import { ConfirmDialog } from "../ui/ConfirmDialog";

/* â”€â”€â”€ Student data â”€â”€â”€ */

interface Student {
  id: string;
  name: string;
  email: string;
  initials: string;
  vehicleCategory: string;
  currentStage: string;
  instructor: string | null;
  paymentLabel: string;
  paymentType: "paid" | "due" | "overdue";
  accountStatus: "Active" | "Pending" | "Inactive";
  package: string;
  phone: string;
  joinedDate: string;
}

const STUDENTS: Student[] = [
  {
    id: "STD-2026-0048",
    name: "Loshan Mihisara",
    email: "loshan.m@gmail.com",
    initials: "LM",
    vehicleCategory: "Light Vehicle",
    currentStage: "Practical Training",
    instructor: "Kasun Silva",
    paymentLabel: "LKR 12,500 due",
    paymentType: "due",
    accountStatus: "Active",
    package: "Standard LV Package",
    phone: "+94 77 123 4567",
    joinedDate: "2026-03-12",
  },
  {
    id: "STD-2026-0052",
    name: "Ravishka Rathnayake",
    email: "ravishka.r@gmail.com",
    initials: "RR",
    vehicleCategory: "Motorcycle",
    currentStage: "Trial Eligible",
    instructor: "Malini Fernando",
    paymentLabel: "Paid",
    paymentType: "paid",
    accountStatus: "Active",
    package: "Motorcycle Package",
    phone: "+94 71 234 5678",
    joinedDate: "2026-02-28",
  },
  {
    id: "STD-2026-0061",
    name: "Lasindu Dilshan",
    email: "lasindu.d@gmail.com",
    initials: "LD",
    vehicleCategory: "Light Vehicle",
    currentStage: "Medical Pending",
    instructor: null,
    paymentLabel: "LKR 30,000 due",
    paymentType: "overdue",
    accountStatus: "Pending",
    package: "Standard LV Package",
    phone: "+94 76 345 6789",
    joinedDate: "2026-05-01",
  },
  {
    id: "STD-2026-0068",
    name: "Nethmi Wijesinghe",
    email: "nethmi.w@gmail.com",
    initials: "NW",
    vehicleCategory: "Three-Wheeler",
    currentStage: "Theory Training",
    instructor: "Ruwan Jayasinghe",
    paymentLabel: "LKR 8,000 due",
    paymentType: "due",
    accountStatus: "Active",
    package: "Three-Wheeler Package",
    phone: "+94 70 456 7890",
    joinedDate: "2026-04-15",
  },
  {
    id: "STD-2026-0072",
    name: "Dilhara Senanayake",
    email: "dilhara.s@gmail.com",
    initials: "DS",
    vehicleCategory: "Light Vehicle",
    currentStage: "Written Examination",
    instructor: "Kasun Silva",
    paymentLabel: "Paid",
    paymentType: "paid",
    accountStatus: "Active",
    package: "Standard LV Package",
    phone: "+94 75 567 8901",
    joinedDate: "2026-01-22",
  },
];

/* â”€â”€â”€ Color maps â”€â”€â”€ */

const STAGE_COLORS: Record<string, { color: string; bg: string }> = {
  "Medical Pending": { color: "#92400E", bg: "#FEF3C7" },
  "Theory Training": { color: "#0369A1", bg: "#E0F2FE" },
  "Practical Training": { color: "#6D28D9", bg: "#EDE9FE" },
  "Written Examination": { color: "#1D4ED8", bg: "#DBEAFE" },
  "Trial Eligible": { color: "#166534", bg: "#DCFCE7" },
  Completed: { color: "#166534", bg: "#DCFCE7" },
  Registered: { color: "#475569", bg: "#F1F5F9" },
};

const VEHICLE_COLORS: Record<string, { color: string; bg: string }> = {
  "Light Vehicle": { color: "#1D4ED8", bg: "#DBEAFE" },
  Motorcycle: { color: "#C2410C", bg: "#FFF7ED" },
  "Three-Wheeler": { color: "#0E7490", bg: "#CFFAFE" },
  "Heavy Vehicle": { color: "#991B1B", bg: "#FEE2E2" },
  "Dual Purpose": { color: "#6D28D9", bg: "#EDE9FE" },
};

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  Active: { color: "#166534", bg: "#DCFCE7" },
  Pending: { color: "#92400E", bg: "#FEF3C7" },
  Inactive: { color: "#475569", bg: "#F1F5F9" },
};

const PAYMENT_COLORS: Record<string, { color: string; bg: string }> = {
  paid: { color: "#166534", bg: "#DCFCE7" },
  due: { color: "#92400E", bg: "#FEF3C7" },
  overdue: { color: "#991B1B", bg: "#FEE2E2" },
};

/* â”€â”€â”€ Reusable badge â”€â”€â”€ */

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        color,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/* â”€â”€â”€ Avatar â”€â”€â”€ */

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  const palette = [
    { bg: "#DBEAFE", color: "#1D4ED8" },
    { bg: "#EDE9FE", color: "#6D28D9" },
    { bg: "#DCFCE7", color: "#166534" },
    { bg: "#FFF7ED", color: "#C2410C" },
    { bg: "#CFFAFE", color: "#0E7490" },
  ];
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % palette.length;
  const { bg, color } = palette[idx];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* â”€â”€â”€ Row action menu â”€â”€â”€ */

function ActionMenu({ studentId, studentName, onViewProfile }: { studentId: string; studentName: string; onViewProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { icon: Eye, label: "View profile", color: "#1E293B", onClick: onViewProfile },
    { icon: Pencil, label: "Edit student record", color: "#1E293B", onClick: undefined },
    { icon: Bell, label: "Send notification", color: "#1E293B", onClick: undefined },
    { icon: UserX, label: "Deactivate student", color: "#DC2626", onClick: () => setConfirmDeactivate(true) },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: "1px solid transparent",
          background: open ? "#F1F5F9" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748B",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = open ? "#F1F5F9" : "transparent")}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
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
            minWidth: 190,
            padding: 4,
          }}
        >
          {actions.map(({ icon: Icon, label, color, onClick }) => (
            <button
              key={label}
              onClick={() => { setOpen(false); onClick?.(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 7,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                color,
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = label === "Deactivate student" ? "#FEF2F2" : "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDeactivate}
        title={`Deactivate ${studentName}?`}
        description={`This will suspend ${studentName}'s account (${studentId}). They will lose access to the student portal. You can reactivate the account later from the student profile.`}
        confirmLabel="Deactivate student"
        variant="danger"
        onConfirm={() => { setConfirmDeactivate(false); setDeactivated(true); }}
        onCancel={() => setConfirmDeactivate(false)}
      />

      {deactivated && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "#1E293B", color: "#ffffff", borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "toastIn 0.2s ease" }}>
          <CheckCircle2 size={16} color="#4ADE80" />
          {studentName} has been deactivated.
          <button onClick={() => setDeactivated(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 0, marginLeft: 6 }}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}

/* â”€â”€â”€ Sortable column header â”€â”€â”€ */

function SortHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
  width,
  align = "left",
}: {
  label: string;
  field: string;
  sortField: string;
  sortDir: "asc" | "desc";
  onSort: (f: string) => void;
  width?: number | string;
  align?: "left" | "right";
}) {
  const active = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: "10px 14px",
        fontSize: 12,
        fontWeight: 600,
        color: active ? "#2563EB" : "#64748B",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: align,
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        background: "#F8FAFC",
        borderBottom: "1px solid #E2E8F0",
        width,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        <span style={{ opacity: active ? 1 : 0.35 }}>
          {active && sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </span>
    </th>
  );
}

/* â”€â”€â”€ Loading skeleton â”€â”€â”€ */

function SkeletonRow() {
  const pulse = { animation: "pulse 1.5s ease-in-out infinite", background: "#F1F5F9", borderRadius: 4 };
  return (
    <tr>
      {[80, 90, 80, 100, 110, 80, 70, 40].map((w, i) => (
        <td key={i} style={{ padding: "14px 14px" }}>
          <div style={{ ...pulse, height: 14, width: w }} />
        </td>
      ))}
    </tr>
  );
}

/* â”€â”€â”€ Empty state â”€â”€â”€ */

function EmptyState({ onRegister }: { onRegister: () => void }) {
  return (
    <tr>
      <td colSpan={8}>
        <div
          style={{
            padding: "64px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={28} color="#94A3B8" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>No students yet</div>
            <div style={{ fontSize: 13, color: "#64748B", maxWidth: 300, lineHeight: 1.6 }}>
              Register your first student to get started. Student portal accounts are created automatically.
            </div>
          </div>
          <button
            onClick={onRegister}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#2563EB",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <UserPlus size={15} />
            Register first student
          </button>
        </div>
      </td>
    </tr>
  );
}

/* â”€â”€â”€ No results state â”€â”€â”€ */

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <tr>
      <td colSpan={8}>
        <div
          style={{
            padding: "56px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={24} color="#F59E0B" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>No students found</div>
            <div style={{ fontSize: 13, color: "#64748B", maxWidth: 300, lineHeight: 1.6 }}>
              No students match the current search or filter criteria. Try adjusting your filters.
            </div>
          </div>
          <button
            onClick={onClear}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
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
            <X size={13} />
            Clear all filters
          </button>
        </div>
      </td>
    </tr>
  );
}

/* â”€â”€â”€ Filter bar â”€â”€â”€ */

interface Filters {
  search: string;
  stage: string;
  status: string;
  instructor: string;
  vehicleCategory: string;
}

const selectStyle: React.CSSProperties = {
  height: 38,
  padding: "0 30px 0 10px",
  borderRadius: 8,
  border: "1.5px solid #E2E8F0",
  fontSize: 13,
  color: "#475569",
  background: "#ffffff",
  cursor: "pointer",
  fontFamily: "inherit",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
  backgroundSize: 14,
};

function FilterBar({
  filters,
  onChange,
  onRegister,
  totalFiltered,
  totalAll,
}: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onRegister: () => void;
  totalFiltered: number;
  totalAll: number;
}) {
  const hasActiveFilter =
    filters.search || filters.stage || filters.status || filters.instructor || filters.vehicleCategory;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Top row: search + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Search
            size={15}
            color="#94A3B8"
            style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by name, ID, emailâ€¦"
            style={{
              width: "100%",
              height: 38,
              paddingLeft: 34,
              paddingRight: 12,
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              fontSize: 13,
              color: "#1E293B",
              background: "#ffffff",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: "" })}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 2,
                color: "#94A3B8",
                display: "flex",
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {hasActiveFilter && (
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              background: "#DBEAFE",
              fontSize: 12,
              fontWeight: 600,
              color: "#2563EB",
            }}
          >
            {totalFiltered} of {totalAll}
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
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
            <Download size={14} />
            Export
          </button>
          <button
            onClick={onRegister}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 38,
              padding: "0 16px",
              borderRadius: 8,
              border: "none",
              background: "#2563EB",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <UserPlus size={14} />
            Register student
          </button>
        </div>
      </div>

      {/* Bottom row: filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <SlidersHorizontal size={14} color="#94A3B8" />
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginRight: 4 }}>Filter by:</span>

        <select
          value={filters.stage}
          onChange={(e) => onChange({ stage: e.target.value })}
          style={{
            ...selectStyle,
            borderColor: filters.stage ? "#2563EB" : "#E2E8F0",
            color: filters.stage ? "#2563EB" : "#475569",
          }}
        >
          <option value="">All stages</option>
          <option value="Medical Pending">Medical Pending</option>
          <option value="Theory Training">Theory Training</option>
          <option value="Practical Training">Practical Training</option>
          <option value="Written Examination">Written Examination</option>
          <option value="Trial Eligible">Trial Eligible</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          style={{
            ...selectStyle,
            borderColor: filters.status ? "#2563EB" : "#E2E8F0",
            color: filters.status ? "#2563EB" : "#475569",
          }}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={filters.vehicleCategory}
          onChange={(e) => onChange({ vehicleCategory: e.target.value })}
          style={{
            ...selectStyle,
            borderColor: filters.vehicleCategory ? "#2563EB" : "#E2E8F0",
            color: filters.vehicleCategory ? "#2563EB" : "#475569",
          }}
        >
          <option value="">All categories</option>
          <option value="Light Vehicle">Light Vehicle</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Three-Wheeler">Three-Wheeler</option>
          <option value="Heavy Vehicle">Heavy Vehicle</option>
          <option value="Dual Purpose">Dual Purpose</option>
        </select>

        <select
          value={filters.instructor}
          onChange={(e) => onChange({ instructor: e.target.value })}
          style={{
            ...selectStyle,
            borderColor: filters.instructor ? "#2563EB" : "#E2E8F0",
            color: filters.instructor ? "#2563EB" : "#475569",
          }}
        >
          <option value="">All instructors</option>
          <option value="Kasun Silva">Kasun Silva</option>
          <option value="Malini Fernando">Malini Fernando</option>
          <option value="Ruwan Jayasinghe">Ruwan Jayasinghe</option>
          <option value="unassigned">Not assigned</option>
        </select>

        {hasActiveFilter && (
          <button
            onClick={() =>
              onChange({ search: "", stage: "", status: "", instructor: "", vehicleCategory: "" })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              color: "#64748B",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <X size={11} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/* â”€â”€â”€ Registration success screen â”€â”€â”€ */

function RegistrationSuccess({
  studentName,
  studentId,
  onRegisterAnother,
  onBackToList,
  onViewProfile,
}: {
  studentName: string;
  studentId: string;
  onRegisterAnother: () => void;
  onBackToList: () => void;
  onViewProfile: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(studentId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 480,
        padding: 32,
        gap: 0,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: "48px 40px",
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#DCFCE7",
            border: "4px solid #BBF7D0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <CheckCircle2 size={36} color="#16A34A" />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <PartyPopper size={16} color="#F59E0B" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Registration complete
          </span>
          <PartyPopper size={16} color="#F59E0B" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 8px" }}>
          {studentName} registered!
        </h1>

        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: "0 0 28px" }}>
          The student portal account has been created. A welcome email with login credentials has been sent to the
          student's email address.
        </p>

        {/* Student ID card */}
        <div
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Student ID
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", fontFamily: "monospace" }}>
              {studentId}
            </div>
          </div>
          <button
            onClick={copyId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 7,
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              color: copied ? "#16A34A" : "#64748B",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy ID"}
          </button>
        </div>

        {/* What's next summary */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8", marginBottom: 10 }}>Next steps</div>
          {[
            "Medical clearance appointment to be scheduled",
            "Instructor will contact student to arrange first session",
            "Student portal is live â€” login credentials sent by email",
          ].map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < 2 ? 8 : 0 }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#2563EB",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onBackToList}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Back to students
          </button>
          <button
            onClick={onRegisterAnother}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 8,
              border: "none",
              background: "#F1F5F9",
              color: "#1E293B",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <UserPlus size={15} />
            Register another
          </button>
        </div>

        <button
          onClick={onViewProfile}
          style={{
            width: "100%",
            marginTop: 10,
            height: 44,
            borderRadius: 8,
            border: "none",
            background: "#2563EB",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <User size={15} />
          View student profile
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Main StudentManagement export â”€â”€â”€ */

type ManagementView = "list" | "wizard" | "success" | "profile";

export function StudentManagement() {
  const [view, setView] = useState<ManagementView>("list");
  const [registeredStudent, setRegisteredStudent] = useState<{ name: string; id: string } | null>(null);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    stage: "",
    status: "",
    instructor: "",
    vehicleCategory: "",
  });
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [loading] = useState(false);
  const perPage = 10;

  const updateFilters = (partial: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...partial }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: "", stage: "", status: "", instructor: "", vehicleCategory: "" });
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  // Filter
  const filtered = STUDENTS.filter((s) => {
    const q = filters.search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q))
      return false;
    if (filters.stage && s.currentStage !== filters.stage) return false;
    if (filters.status && s.accountStatus !== filters.status) return false;
    if (filters.vehicleCategory && s.vehicleCategory !== filters.vehicleCategory) return false;
    if (filters.instructor === "unassigned" && s.instructor !== null) return false;
    if (filters.instructor && filters.instructor !== "unassigned" && s.instructor !== filters.instructor) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let av = "", bv = "";
    if (sortField === "name") { av = a.name; bv = b.name; }
    else if (sortField === "id") { av = a.id; bv = b.id; }
    else if (sortField === "stage") { av = a.currentStage; bv = b.currentStage; }
    else if (sortField === "status") { av = a.accountStatus; bv = b.accountStatus; }
    const cmp = av.localeCompare(bv);
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  if (view === "profile") {
    return <StudentProfile onBack={() => setView("list")} />;
  }

  if (view === "wizard") {
    return (
      <StudentRegistrationWizard
        onSuccess={(info) => {
          setRegisteredStudent(info);
          setView("success");
        }}
        onCancel={() => setView("list")}
      />
    );
  }

  if (view === "success" && registeredStudent) {
    return (
      <RegistrationSuccess
        studentName={registeredStudent.name}
        studentId={registeredStudent.id}
        onRegisterAnother={() => { setRegisteredStudent(null); setView("wizard"); }}
        onBackToList={() => { setRegisteredStudent(null); setView("list"); }}
        onViewProfile={() => setView("profile")}
      />
    );
  }

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Students</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>
            {STUDENTS.length} students enrolled Â· {STUDENTS.filter((s) => s.accountStatus === "Active").length} active
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onChange={updateFilters}
        onRegister={() => setView("wizard")}
        totalFiltered={filtered.length}
        totalAll={STUDENTS.length}
      />

      {/* Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr>
                <SortHeader label="Student" field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="Student ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} width={130} />
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                  Category
                </th>
                <SortHeader label="Current Stage" field="stage" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                  Instructor
                </th>
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                  Payment
                </th>
                <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} width={90} />
                <th style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", width: 44 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paged.length === 0 && STUDENTS.length === 0 ? (
                <EmptyState onRegister={() => setView("wizard")} />
              ) : paged.length === 0 ? (
                <NoResults onClear={clearFilters} />
              ) : (
                paged.map((student, idx) => (
                  <tr
                    key={student.id}
                    style={{
                      borderTop: idx > 0 ? "1px solid #F1F5F9" : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Student */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={student.initials} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{student.name}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{student.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", fontFamily: "monospace" }}>
                        {student.id}
                      </span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "12px 14px" }}>
                      <Badge
                        label={student.vehicleCategory}
                        {...(VEHICLE_COLORS[student.vehicleCategory] || { color: "#475569", bg: "#F1F5F9" })}
                      />
                    </td>

                    {/* Stage */}
                    <td style={{ padding: "12px 14px" }}>
                      <Badge
                        label={student.currentStage}
                        {...(STAGE_COLORS[student.currentStage] || { color: "#475569", bg: "#F1F5F9" })}
                      />
                    </td>

                    {/* Instructor */}
                    <td style={{ padding: "12px 14px" }}>
                      {student.instructor ? (
                        <span style={{ fontSize: 13, color: "#1E293B" }}>{student.instructor}</span>
                      ) : (
                        <span style={{ fontSize: 13, color: "#CBD5E1", fontStyle: "italic" }}>Not assigned</span>
                      )}
                    </td>

                    {/* Payment */}
                    <td style={{ padding: "12px 14px" }}>
                      <Badge
                        label={student.paymentLabel}
                        {...PAYMENT_COLORS[student.paymentType]}
                      />
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 14px" }}>
                      <Badge
                        label={student.accountStatus}
                        {...STATUS_COLORS[student.accountStatus]}
                      />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 10px" }}>
                      <ActionMenu studentId={student.id} studentName={student.name} onViewProfile={() => setView("profile")} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sorted.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderTop: "1px solid #F1F5F9",
              background: "#FAFBFC",
            }}
          >
            <div style={{ fontSize: 13, color: "#64748B" }}>
              Showing {Math.min((page - 1) * perPage + 1, sorted.length)}â€“{Math.min(page * perPage, sorted.length)} of{" "}
              {sorted.length} student{sorted.length !== 1 ? "s" : ""}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: "#ffffff",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: page === 1 ? "#CBD5E1" : "#475569",
                }}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: `1px solid ${page === i + 1 ? "#2563EB" : "#E2E8F0"}`,
                    background: page === i + 1 ? "#2563EB" : "#ffffff",
                    color: page === i + 1 ? "#ffffff" : "#475569",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: "#ffffff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: page === totalPages ? "#CBD5E1" : "#475569",
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


