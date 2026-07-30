import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
  Clock,
  User,
  Car,
  MapPin,
  Users,
  Filter,
  Search,
  Bell,
  Edit3,
  CalendarDays,
  UserCheck,
  Loader2,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";

/* â”€â”€â”€ Types â”€â”€â”€ */

type EventType = "theory" | "practical" | "medical" | "examination" | "trial" | "maintenance";

interface CalEvent {
  id: string;
  type: EventType;
  title: string;
  student: string | null;
  group: string | null;
  instructor: string | null;
  vehicle: string | null;
  location: string;
  dayIndex: number; // 0=Mon â€¦ 6=Sun
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

interface ConflictWarning {
  type: "instructor" | "vehicle" | "student";
  message: string;
}

interface CreateForm {
  eventType: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  instructor: string;
  vehicle: string;
  student: string;
  location: string;
  reminderTiming: string;
  notes: string;
  status: string;
}

/* â”€â”€â”€ Constants â”€â”€â”€ */

const WEEK_DATES = [
  "2026-07-20",
  "2026-07-21",
  "2026-07-22",
  "2026-07-23",
  "2026-07-24",
  "2026-07-25",
  "2026-07-26",
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_DATES = [20, 21, 22, 23, 24, 25, 26];
const TODAY_IDX = 2; // Wednesday
const START_HOUR = 7;
const END_HOUR = 20;
const HOUR_HEIGHT = 64;
const TIME_COL_W = 56;

const EVENT_CONFIG: Record<EventType, { color: string; bg: string; border: string; label: string }> = {
  theory: { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", label: "Theory Class" },
  practical: { color: "#166534", bg: "#F0FDF4", border: "#BBF7D0", label: "Practical Session" },
  medical: { color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA", label: "Medical Appointment" },
  examination: { color: "#6D28D9", bg: "#F5F3FF", border: "#DDD6FE", label: "Written Examination" },
  trial: { color: "#991B1B", bg: "#FFF1F2", border: "#FECDD3", label: "Practical Trial" },
  maintenance: { color: "#475569", bg: "#F8FAFC", border: "#E2E8F0", label: "Vehicle Maintenance" },
};

/* â”€â”€â”€ Calendar events data â”€â”€â”€ */

const EVENTS: CalEvent[] = [
  // Monday Jul 20
  {
    id: "e1",
    type: "theory",
    title: "Theory Class",
    student: null,
    group: "Group A Â· Morning",
    instructor: "Kasun Silva",
    vehicle: null,
    location: "Hall 1 â€” Main Campus",
    dayIndex: 0,
    startHour: 9,
    startMin: 0,
    endHour: 10,
    endMin: 0,
    status: "completed",
  },
  {
    id: "e2",
    type: "practical",
    title: "Practical Session",
    student: "Loshan Mihisara",
    group: null,
    instructor: "Kasun Silva",
    vehicle: "BAA-4521",
    location: "Route A â€” Nugegoda",
    dayIndex: 0,
    startHour: 14,
    startMin: 0,
    endHour: 15,
    endMin: 30,
    status: "completed",
  },
  {
    id: "e3",
    type: "practical",
    title: "Practical Session",
    student: "Nethmi Wijesinghe",
    group: null,
    instructor: "Ruwan Jayasinghe",
    vehicle: "CAG-8820",
    location: "Route B â€” Colombo 5",
    dayIndex: 0,
    startHour: 16,
    startMin: 0,
    endHour: 17,
    endMin: 0,
    status: "completed",
  },

  // Tuesday Jul 21
  {
    id: "e4",
    type: "trial",
    title: "Practical Trial",
    student: "Ravishka Rathnayake",
    group: null,
    instructor: "Malini Fernando",
    vehicle: "BAA-4521",
    location: "RMV Assessment Grounds",
    dayIndex: 1,
    startHour: 8,
    startMin: 0,
    endHour: 9,
    endMin: 30,
    status: "completed",
  },
  {
    id: "e5",
    type: "theory",
    title: "Theory Class",
    student: null,
    group: "Group B Â· Afternoon",
    instructor: "Kasun Silva",
    vehicle: null,
    location: "Hall 1 â€” Main Campus",
    dayIndex: 1,
    startHour: 10,
    startMin: 0,
    endHour: 12,
    endMin: 0,
    status: "completed",
  },
  {
    id: "e6",
    type: "examination",
    title: "Written Examination",
    student: "Dilhara Senanayake",
    group: null,
    instructor: null,
    vehicle: null,
    location: "Examination Hall â€” Block C",
    dayIndex: 1,
    startHour: 15,
    startMin: 0,
    endHour: 15,
    endMin: 45,
    status: "completed",
  },

  // Wednesday Jul 22 (today)
  {
    id: "e7",
    type: "practical",
    title: "Practical Session",
    student: "Loshan Mihisara",
    group: null,
    instructor: "Kasun Silva",
    vehicle: "BAA-4521",
    location: "Route A â€” Nugegoda",
    dayIndex: 2,
    startHour: 9,
    startMin: 0,
    endHour: 10,
    endMin: 0,
    status: "scheduled",
  },
  {
    id: "e8",
    type: "theory",
    title: "Theory Class",
    student: null,
    group: "Group C",
    instructor: "Malini Fernando",
    vehicle: null,
    location: "Hall 2 â€” Annex Building",
    dayIndex: 2,
    startHour: 11,
    startMin: 0,
    endHour: 12,
    endMin: 30,
    status: "scheduled",
  },
  {
    id: "e9",
    type: "medical",
    title: "Medical Appointment",
    student: "Lasindu Dilshan",
    group: null,
    instructor: null,
    vehicle: null,
    location: "National Transport Medical Institute",
    dayIndex: 2,
    startHour: 14,
    startMin: 0,
    endHour: 15,
    endMin: 0,
    status: "scheduled",
  },

  // Thursday Jul 23
  {
    id: "e10",
    type: "theory",
    title: "Theory Class",
    student: null,
    group: "Group A Â· Morning",
    instructor: "Kasun Silva",
    vehicle: null,
    location: "Hall 1 â€” Main Campus",
    dayIndex: 3,
    startHour: 8,
    startMin: 30,
    endHour: 10,
    endMin: 0,
    status: "scheduled",
  },
  {
    id: "e11",
    type: "practical",
    title: "Practical Session",
    student: "Nethmi Wijesinghe",
    group: null,
    instructor: "Ruwan Jayasinghe",
    vehicle: "CAG-8820",
    location: "Route B â€” Colombo 5",
    dayIndex: 3,
    startHour: 13,
    startMin: 0,
    endHour: 14,
    endMin: 0,
    status: "scheduled",
  },
  {
    id: "e12",
    type: "practical",
    title: "Practical Session",
    student: "Loshan Mihisara",
    group: null,
    instructor: "Kasun Silva",
    vehicle: "BAA-4521",
    location: "Route A â€” Nugegoda",
    dayIndex: 3,
    startHour: 15,
    startMin: 30,
    endHour: 16,
    endMin: 30,
    status: "scheduled",
  },

  // Friday Jul 24
  {
    id: "e13",
    type: "practical",
    title: "Practical Session",
    student: "Loshan Mihisara",
    group: null,
    instructor: "Kasun Silva",
    vehicle: "BAA-4521",
    location: "Route A â€” Nugegoda",
    dayIndex: 4,
    startHour: 9,
    startMin: 0,
    endHour: 10,
    endMin: 0,
    status: "scheduled",
  },
  {
    id: "e14",
    type: "maintenance",
    title: "Vehicle Maintenance",
    student: null,
    group: "BAA-4521",
    instructor: null,
    vehicle: "BAA-4521",
    location: "Workshop â€” Rear Block",
    dayIndex: 4,
    startHour: 10,
    startMin: 0,
    endHour: 11,
    endMin: 0,
    status: "scheduled",
  },
  {
    id: "e15",
    type: "examination",
    title: "Written Examination",
    student: "Dilhara Senanayake",
    group: null,
    instructor: null,
    vehicle: null,
    location: "Examination Hall â€” Block C",
    dayIndex: 4,
    startHour: 14,
    startMin: 0,
    endHour: 15,
    endMin: 0,
    status: "scheduled",
  },

  // Saturday Jul 25
  {
    id: "e16",
    type: "trial",
    title: "Practical Trial",
    student: "Ravishka Rathnayake",
    group: null,
    instructor: "Malini Fernando",
    vehicle: "BAA-4521",
    location: "RMV Assessment Grounds",
    dayIndex: 5,
    startHour: 7,
    startMin: 0,
    endHour: 9,
    endMin: 0,
    status: "scheduled",
  },
  {
    id: "e17",
    type: "theory",
    title: "Theory Class",
    student: null,
    group: "Group D",
    instructor: "Malini Fernando",
    vehicle: null,
    location: "Hall 2 â€” Annex Building",
    dayIndex: 5,
    startHour: 10,
    startMin: 0,
    endHour: 12,
    endMin: 0,
    status: "scheduled",
  },
];

/* â”€â”€â”€ Helpers â”€â”€â”€ */

function fmtHour(h: number): string {
  if (h === 0 || h === 12) return `${h === 0 ? 12 : 12} ${h === 0 ? "AM" : "PM"}`;
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function fmtTime(h: number, m: number): string {
  const period = h < 12 ? "AM" : "PM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}

function evTop(e: CalEvent) {
  return (e.startHour - START_HOUR + e.startMin / 60) * HOUR_HEIGHT;
}

function evHeight(e: CalEvent) {
  const dur = (e.endHour - e.startHour) + (e.endMin - e.startMin) / 60;
  return Math.max(dur * HOUR_HEIGHT, 28);
}

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function detectConflicts(form: CreateForm): ConflictWarning[] {
  if (!form.date || !form.startTime || !form.endTime) return [];

  const dayIdx = WEEK_DATES.indexOf(form.date);
  if (dayIdx === -1) return [];

  const fs = timeToMin(form.startTime);
  const fe = timeToMin(form.endTime);
  if (fe <= fs) return [];

  const conflicts: Record<string, ConflictWarning> = {};

  for (const ev of EVENTS) {
    if (ev.dayIndex !== dayIdx) continue;
    const es = ev.startHour * 60 + ev.startMin;
    const ee = ev.endHour * 60 + ev.endMin;
    if (fs >= ee || fe <= es) continue; // no overlap

    if (form.instructor && ev.instructor === form.instructor && !conflicts.instructor) {
      conflicts.instructor = {
        type: "instructor",
        message: `The selected instructor is already assigned from ${fmtTime(ev.startHour, ev.startMin)} to ${fmtTime(ev.endHour, ev.endMin)}.`,
      };
    }
    if (form.vehicle && ev.vehicle === form.vehicle && !conflicts.vehicle) {
      conflicts.vehicle = {
        type: "vehicle",
        message: "The selected vehicle is unavailable during the selected period.",
      };
    }
    if (
      form.student &&
      (ev.student === form.student) &&
      !conflicts.student
    ) {
      conflicts.student = {
        type: "student",
        message: "One selected student already has another session during this time.",
      };
    }
  }

  return Object.values(conflicts);
}

/* â”€â”€â”€ Event block â”€â”€â”€ */

function EventBlock({ ev, onClick }: { ev: CalEvent; onClick: (ev: CalEvent) => void }) {
  const cfg = EVENT_CONFIG[ev.type];
  const h = evHeight(ev);
  const compact = h < 52;

  return (
    <div
      onClick={() => onClick(ev)}
      style={{
        position: "absolute",
        top: evTop(ev),
        left: 3,
        right: 3,
        height: h - 2,
        borderRadius: 7,
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.color}`,
        padding: compact ? "3px 7px" : "5px 8px",
        cursor: "pointer",
        overflow: "hidden",
        zIndex: 10,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div
        style={{
          fontSize: compact ? 10 : 11,
          fontWeight: 700,
          color: cfg.color,
          lineHeight: 1.2,
          marginBottom: compact ? 0 : 2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {fmtTime(ev.startHour, ev.startMin)} Â· {ev.title}
      </div>
      {!compact && (
        <>
          <div
            style={{
              fontSize: 11,
              color: "#475569",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {ev.student || ev.group}
          </div>
          {h > 70 && ev.instructor && (
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {ev.instructor}{ev.vehicle ? ` Â· ${ev.vehicle}` : ""}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* â”€â”€â”€ Create Event drawer â”€â”€â”€ */

const INITIAL_FORM: CreateForm = {
  eventType: "practical",
  title: "Practical Session",
  date: "2026-07-24",
  startTime: "09:30",
  endTime: "10:30",
  instructor: "Kasun Silva",
  vehicle: "BAA-4521",
  student: "Loshan Mihisara",
  location: "",
  reminderTiming: "30min",
  notes: "",
  status: "scheduled",
};

const labelS: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 5,
  display: "block",
};

const inputS: React.CSSProperties = {
  width: "100%",
  height: 40,
  border: "1.5px solid #E2E8F0",
  borderRadius: 8,
  padding: "0 12px",
  fontSize: 13,
  color: "#1E293B",
  background: "#ffffff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const selectS: React.CSSProperties = {
  ...inputS,
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
  paddingRight: 32,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  backgroundSize: 14,
};

function ConflictAlert({ conflict }: { conflict: ConflictWarning }) {
  const icons = {
    instructor: <User size={14} />,
    vehicle: <Car size={14} />,
    student: <Users size={14} />,
  };
  const labels = {
    instructor: "Instructor conflict",
    vehicle: "Vehicle conflict",
    student: "Student conflict",
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        background: "#FFF7ED",
        border: "1.5px solid #FED7AA",
        marginBottom: 8,
      }}
    >
      <span style={{ color: "#C2410C", display: "flex", marginTop: 1 }}>{icons[conflict.type]}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", marginBottom: 2 }}>
          {labels[conflict.type]}
        </div>
        <div style={{ fontSize: 12, color: "#C2410C", lineHeight: 1.5 }}>{conflict.message}</div>
      </div>
    </div>
  );
}

function CreateEventDrawer({
  open,
  onClose,
  onScheduled,
}: {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
}) {
  const [form, setForm] = useState<CreateForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const conflicts = useMemo(() => detectConflicts(form), [form]);
  const hasConflicts = conflicts.length > 0;

  const update = (key: keyof CreateForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSchedule = () => {
    if (hasConflicts) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onScheduled();
    }, 1400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.4)",
          zIndex: 99,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 460,
          background: "#ffffff",
          zIndex: 100,
          boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease-in-out",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>Create event</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              Schedule a training session, exam, or appointment
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Conflict banner */}
        {hasConflicts && (
          <div
            style={{
              padding: "10px 20px 0",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "#FFF1F2",
                border: "1.5px solid #FECDD3",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <AlertTriangle size={15} color="#991B1B" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: "#991B1B" }}>
                {conflicts.length} scheduling conflict{conflicts.length > 1 ? "s" : ""} detected â€” resolve before scheduling
              </div>
            </div>
          </div>
        )}

        {/* Form body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Event type */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelS}>Event type</label>
            <select
              style={selectS}
              value={form.eventType}
              onChange={(e) => {
                update("eventType", e.target.value);
                update("title", EVENT_CONFIG[e.target.value as EventType]?.label || "");
              }}
            >
              {Object.entries(EVENT_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelS}>Event title</label>
            <input
              style={inputS}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Session title"
            />
          </div>

          {/* Date + times */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={labelS}>Date</label>
              <input
                type="date"
                style={inputS}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
            <div>
              <label style={labelS}>Start time</label>
              <input
                type="time"
                style={inputS}
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </div>
            <div>
              <label style={labelS}>End time</label>
              <input
                type="time"
                style={inputS}
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </div>
          </div>

          {/* Instructor */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelS}>Instructor</label>
            <select
              style={{
                ...selectS,
                borderColor: conflicts.find((c) => c.type === "instructor") ? "#FED7AA" : "#E2E8F0",
                background: conflicts.find((c) => c.type === "instructor")
                  ? "#FFF7ED"
                  : "#ffffff",
              }}
              value={form.instructor}
              onChange={(e) => update("instructor", e.target.value)}
            >
              <option value="">Select instructor</option>
              <option value="Kasun Silva">Kasun Silva</option>
              <option value="Malini Fernando">Malini Fernando</option>
              <option value="Ruwan Jayasinghe">Ruwan Jayasinghe</option>
            </select>
          </div>
          {conflicts.find((c) => c.type === "instructor") && (
            <ConflictAlert conflict={conflicts.find((c) => c.type === "instructor")!} />
          )}

          {/* Vehicle */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelS}>Vehicle</label>
            <select
              style={{
                ...selectS,
                borderColor: conflicts.find((c) => c.type === "vehicle") ? "#FED7AA" : "#E2E8F0",
                background: conflicts.find((c) => c.type === "vehicle") ? "#FFF7ED" : "#ffffff",
              }}
              value={form.vehicle}
              onChange={(e) => update("vehicle", e.target.value)}
            >
              <option value="">Select vehicle</option>
              <option value="BAA-4521">BAA-4521 Â· Suzuki Alto Â· Manual</option>
              <option value="CAG-8820">CAG-8820 Â· Honda CB150 Â· Manual</option>
              <option value="CBE-3310">CBE-3310 Â· Maruti Swift Â· Auto</option>
            </select>
          </div>
          {conflicts.find((c) => c.type === "vehicle") && (
            <ConflictAlert conflict={conflicts.find((c) => c.type === "vehicle")!} />
          )}

          {/* Student */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelS}>Student / student group</label>
            <select
              style={{
                ...selectS,
                borderColor: conflicts.find((c) => c.type === "student") ? "#FED7AA" : "#E2E8F0",
                background: conflicts.find((c) => c.type === "student") ? "#FFF7ED" : "#ffffff",
              }}
              value={form.student}
              onChange={(e) => update("student", e.target.value)}
            >
              <option value="">Select student or group</option>
              <option value="Loshan Mihisara">Loshan Mihisara â€” STD-2026-0048</option>
              <option value="Ravishka Rathnayake">Ravishka Rathnayake â€” STD-2026-0052</option>
              <option value="Lasindu Dilshan">Lasindu Dilshan â€” STD-2026-0061</option>
              <option value="Nethmi Wijesinghe">Nethmi Wijesinghe â€” STD-2026-0068</option>
              <option value="Dilhara Senanayake">Dilhara Senanayake â€” STD-2026-0072</option>
              <option value="Group A">Group A (8 students)</option>
              <option value="Group B">Group B (6 students)</option>
            </select>
          </div>
          {conflicts.find((c) => c.type === "student") && (
            <ConflictAlert conflict={conflicts.find((c) => c.type === "student")!} />
          )}

          {/* Location */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelS}>Location</label>
            <input
              style={inputS}
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Hall, route, or address"
            />
          </div>

          {/* Reminder + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={labelS}>Reminder timing</label>
              <select style={selectS} value={form.reminderTiming} onChange={(e) => update("reminderTiming", e.target.value)}>
                <option value="15min">15 minutes before</option>
                <option value="30min">30 minutes before</option>
                <option value="1hr">1 hour before</option>
                <option value="2hr">2 hours before</option>
                <option value="1day">1 day before</option>
              </select>
            </div>
            <div>
              <label style={labelS}>Event status</label>
              <select style={selectS} value={form.status} onChange={(e) => update("status", e.target.value)}>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelS}>Notes</label>
            <textarea
              style={{ ...inputS, height: 80, padding: "10px 12px", resize: "vertical", lineHeight: 1.5 }}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Additional notes for this eventâ€¦"
            />
          </div>

          {/* Conflict summary if multiple */}
          {hasConflicts && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                marginTop: 8,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
                <Info size={12} />
                How to resolve conflicts
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {conflicts.find(c => c.type === "instructor") && (
                  <li style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                    Choose a different instructor or change the event time
                  </li>
                )}
                {conflicts.find(c => c.type === "vehicle") && (
                  <li style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                    Select a different vehicle or adjust the time window
                  </li>
                )}
                {conflicts.find(c => c.type === "student") && (
                  <li style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                    Remove the conflicting student or choose a different time
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            gap: 8,
            flexShrink: 0,
            background: "#F8FAFC",
          }}
        >
          <button
            onClick={onClose}
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            style={{
              height: 40,
              padding: "0 16px",
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
            Save as draft
          </button>
          <button
            onClick={handleSchedule}
            disabled={hasConflicts || saving}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              border: "none",
              background: hasConflicts ? "#CBD5E1" : saving ? "#93C5FD" : "#2563EB",
              color: hasConflicts ? "#94A3B8" : "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: hasConflicts ? "not-allowed" : saving ? "wait" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "background 0.15s",
            }}
          >
            {saving ? (
              <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />Schedulingâ€¦</>
            ) : hasConflicts ? (
              <><AlertTriangle size={14} />Resolve conflicts first</>
            ) : (
              <><CalendarDays size={14} />Schedule event</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

/* â”€â”€â”€ Event Details drawer â”€â”€â”€ */

function EventDetailsDrawer({
  event,
  onClose,
}: {
  event: CalEvent | null;
  onClose: () => void;
}) {
  const open = event !== null;
  if (!event) return null;

  const cfg = EVENT_CONFIG[event.type];
  const dateLabel = (() => {
    const d = WEEK_DATES[event.dayIndex];
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  })();

  const statusColors: Record<string, { color: string; bg: string }> = {
    scheduled: { color: "#1D4ED8", bg: "#DBEAFE" },
    completed: { color: "#166534", bg: "#DCFCE7" },
    cancelled: { color: "#991B1B", bg: "#FEE2E2" },
  };
  const sc = statusColors[event.status];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.4)",
          zIndex: 99,
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: "#ffffff",
          zIndex: 100,
          boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease-in-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: cfg.bg,
              border: `1.5px solid ${cfg.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: cfg.color,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{event.title}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{cfg.label}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          {/* Status + Event type */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: sc.color,
                background: sc.bg,
                textTransform: "capitalize",
              }}
            >
              {event.status}
            </span>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: cfg.color,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
              }}
            >
              {cfg.label}
            </span>
          </div>

          {/* Details */}
          {[
            { icon: <CalendarDays size={15} />, label: "Date", value: dateLabel },
            {
              icon: <Clock size={15} />,
              label: "Time",
              value: `${fmtTime(event.startHour, event.startMin)} â€“ ${fmtTime(event.endHour, event.endMin)}`,
            },
            event.instructor && {
              icon: <User size={15} />,
              label: "Instructor",
              value: event.instructor,
            },
            event.vehicle && {
              icon: <Car size={15} />,
              label: "Vehicle",
              value: event.vehicle,
            },
            {
              icon: <MapPin size={15} />,
              label: "Location",
              value: event.location || "Not specified",
            },
            {
              icon: <Users size={15} />,
              label: "Participant",
              value: event.student || event.group || "â€”",
            },
          ]
            .filter(Boolean)
            .map((item: any, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "11px 0",
                  borderBottom: "1px solid #F8FAFC",
                }}
              >
                <div style={{ color: "#94A3B8", display: "flex", marginTop: 1, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}

          {event.notes && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Notes
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.6,
                }}
              >
                {event.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
            background: "#F8FAFC",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                border: "1.5px solid #E2E8F0",
                background: "#ffffff",
                color: "#475569",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Edit3 size={13} />
              Edit event
            </button>
            <button
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                border: "1.5px solid #FEE2E2",
                background: "#FEF2F2",
                color: "#DC2626",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <X size={13} />
              Cancel event
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                border: "1.5px solid #E2E8F0",
                background: "#ffffff",
                color: "#475569",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Bell size={13} />
              Send reminder
            </button>
            <button
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                border: "1.5px solid #E2E8F0",
                background: "#ffffff",
                color: "#475569",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <UserCheck size={13} />
              View participants
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* â”€â”€â”€ Legend â”€â”€â”€ */

function Legend() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      {Object.entries(EVENT_CONFIG).map(([key, cfg]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.color }} />
          <span style={{ fontSize: 12, color: "#64748B" }}>{cfg.label}</span>
        </div>
      ))}
    </div>
  );
}

/* â”€â”€â”€ Filter select â”€â”€â”€ */

function FilterSelect({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 36,
        padding: "0 28px 0 10px",
        borderRadius: 8,
        border: `1.5px solid ${value ? "#2563EB" : "#E2E8F0"}`,
        fontSize: 12,
        color: value ? "#2563EB" : "#64748B",
        background: "#ffffff",
        cursor: "pointer",
        fontFamily: "inherit",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
        backgroundSize: 12,
      }}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}

/* â”€â”€â”€ Main export â”€â”€â”€ */

export function CalendarScheduling() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [scheduledToast, setScheduledToast] = useState(false);

  const filteredEvents = useMemo(() => {
    return EVENTS.filter((e) => {
      if (typeFilter && e.type !== typeFilter) return false;
      if (instructorFilter && e.instructor !== instructorFilter) return false;
      if (vehicleFilter && e.vehicle !== vehicleFilter) return false;
      if (studentSearch) {
        const q = studentSearch.toLowerCase();
        const match =
          e.student?.toLowerCase().includes(q) ||
          e.group?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [typeFilter, instructorFilter, vehicleFilter, studentSearch]);

  const handleScheduled = () => {
    setCreateOpen(false);
    setScheduledToast(true);
    setTimeout(() => setScheduledToast(false), 3500);
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>
            Calendar & Scheduling
          </h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>
            Week of 20 â€“ 26 July 2026 Â· {EVENTS.length} events scheduled
          </div>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            height: 40,
            padding: "0 18px",
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
          <Plus size={15} />
          Create event
        </button>
      </div>

      {/* Controls bar */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: "10px 16px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {/* Nav */}
        <div style={{ display: "flex", gap: 4 }}>
          <button
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Today
          </button>
          {[ChevronLeft, ChevronRight].map((Icon, i) => (
            <button
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                border: "1.5px solid #E2E8F0",
                background: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div
          style={{
            display: "flex",
            border: "1.5px solid #E2E8F0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {["Month", "Week", "Day"].map((v, i) => (
            <button
              key={v}
              style={{
                padding: "5px 14px",
                border: "none",
                borderLeft: i > 0 ? "1px solid #E2E8F0" : "none",
                background: v === "Week" ? "#2563EB" : "#ffffff",
                color: v === "Week" ? "#ffffff" : "#64748B",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: "#E2E8F0", margin: "0 2px" }} />

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Filter size={13} color="#94A3B8" />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} placeholder="Event type">
            {Object.entries(EVENT_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={instructorFilter} onChange={setInstructorFilter} placeholder="Instructor">
            <option value="Kasun Silva">Kasun Silva</option>
            <option value="Malini Fernando">Malini Fernando</option>
            <option value="Ruwan Jayasinghe">Ruwan Jayasinghe</option>
          </FilterSelect>
          <FilterSelect value={vehicleFilter} onChange={setVehicleFilter} placeholder="Vehicle">
            <option value="BAA-4521">BAA-4521</option>
            <option value="CAG-8820">CAG-8820</option>
            <option value="CBE-3310">CBE-3310</option>
          </FilterSelect>

          {/* Student search */}
          <div style={{ position: "relative" }}>
            <Search
              size={13}
              color="#94A3B8"
              style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search studentâ€¦"
              style={{
                height: 36,
                paddingLeft: 28,
                paddingRight: 10,
                borderRadius: 8,
                border: "1.5px solid #E2E8F0",
                fontSize: 12,
                color: "#1E293B",
                background: "#ffffff",
                outline: "none",
                fontFamily: "inherit",
                width: 160,
              }}
            />
          </div>

          {(typeFilter || instructorFilter || vehicleFilter || studentSearch) && (
            <button
              onClick={() => {
                setTypeFilter("");
                setInstructorFilter("");
                setVehicleFilter("");
                setStudentSearch("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 9px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: "#ffffff",
                color: "#64748B",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <X size={10} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Day header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${TIME_COL_W}px repeat(7, 1fr)`,
            borderBottom: "1px solid #E2E8F0",
            position: "sticky",
            top: 0,
            background: "#ffffff",
            zIndex: 20,
          }}
        >
          <div style={{ borderRight: "1px solid #F1F5F9" }} />
          {DAY_LABELS.map((day, idx) => {
            const isToday = idx === TODAY_IDX;
            return (
              <div
                key={day}
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  borderLeft: idx > 0 ? "1px solid #F1F5F9" : "none",
                  background: isToday ? "#EFF6FF" : "transparent",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isToday ? "#2563EB" : "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  {day}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isToday ? "#2563EB" : "transparent",
                    fontSize: 14,
                    fontWeight: isToday ? 700 : 600,
                    color: isToday ? "#ffffff" : "#1E293B",
                  }}
                >
                  {DAY_DATES[idx]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid body */}
        <div style={{ overflowY: "auto", maxHeight: 660 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `${TIME_COL_W}px repeat(7, 1fr)`,
              position: "relative",
            }}
          >
            {/* Time labels column */}
            <div>
              {hours.map((h) => (
                <div
                  key={h}
                  style={{
                    height: HOUR_HEIGHT,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    paddingRight: 10,
                    paddingTop: 6,
                    borderRight: "1px solid #F1F5F9",
                    fontSize: 11,
                    color: "#94A3B8",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmtHour(h)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const isToday = dayIdx === TODAY_IDX;
              const dayEvents = filteredEvents.filter((e) => e.dayIndex === dayIdx);

              return (
                <div
                  key={dayIdx}
                  style={{
                    position: "relative",
                    borderLeft: "1px solid #F1F5F9",
                    background: isToday ? "#FAFCFF" : "transparent",
                  }}
                >
                  {/* Hour lines */}
                  {hours.map((h) => (
                    <div
                      key={h}
                      style={{
                        height: HOUR_HEIGHT,
                        borderBottom: "1px solid #F8FAFC",
                        position: "relative",
                      }}
                    >
                      {/* Half-hour tick */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          borderBottom: "1px dashed #F1F5F9",
                          top: HOUR_HEIGHT / 2,
                        }}
                      />
                    </div>
                  ))}

                  {/* Current time indicator (today only, ~10:30 AM display time) */}
                  {isToday && (
                    <div
                      style={{
                        position: "absolute",
                        top: (3.5) * HOUR_HEIGHT, // 10:30 AM = 3.5 hrs after 7AM
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "#DC2626",
                        zIndex: 15,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#DC2626",
                          marginLeft: -4,
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  )}

                  {/* Events */}
                  {dayEvents.map((ev) => (
                    <EventBlock
                      key={ev.id}
                      ev={ev}
                      onClick={(e) => setSelectedEvent(e)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 12 }}>
        <Legend />
      </div>

      {/* Drawers */}
      <CreateEventDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onScheduled={handleScheduled}
      />
      <EventDetailsDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Success toast */}
      {scheduledToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1E293B",
            color: "#ffffff",
            padding: "12px 18px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 9,
            zIndex: 200,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            animation: "slideUp 0.3s ease",
          }}
        >
          <Check size={16} color="#4ADE80" />
          Event scheduled successfully
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

