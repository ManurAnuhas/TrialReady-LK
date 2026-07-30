import React, { useState } from "react";
import {
  Bell, Calendar, CreditCard, FileText, Stethoscope,
  Award, Settings, Trash2, CheckCheck, Check, ExternalLink,
  AlertCircle, Clock, RefreshCw,
} from "lucide-react";

/* â”€â”€â”€ Types & data â”€â”€â”€ */

type NoteCategory = "sessions" | "payments" | "permits" | "medical" | "exams" | "system";
type NoteFilter = "all" | "unread" | NoteCategory;

interface Notification {
  id: string;
  category: NoteCategory;
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  action?: string;
  priority?: "high" | "normal";
}

const INITIAL: Notification[] = [
  { id: "n1", category: "sessions", title: "Practical session reminder", message: "Loshan Mihisara has a practical session tomorrow at 9:00 AM with Kasun Silva. Vehicle BAA-4521 has been assigned.", date: "2026-07-21", time: "16:00", read: false, action: "View session", priority: "normal" },
  { id: "n2", category: "permits", title: "Learner permit expiry warning", message: "Ravishka Rathnayake's learner permit (LP-2026-WP-00298) expires in 14 days on 4 August 2026. Arrange renewal or trial before expiry.", date: "2026-07-21", time: "09:00", read: false, action: "View permit", priority: "high" },
  { id: "n3", category: "payments", title: "Payment overdue", message: "Lasindu Dilshan has an outstanding balance of LKR 30,000 on the Motorcycle Starter Package. Last payment was 18 June 2026.", date: "2026-07-20", time: "12:30", read: false, action: "Record payment", priority: "high" },
  { id: "n4", category: "medical", title: "Medical certificate expiring soon", message: "Nethmi Wijesinghe's medical certificate (MC-2026-WP-03871) is valid until 15 August 2026 â€” 25 days remaining. Request renewal.", date: "2026-07-20", time: "09:15", read: true, action: "View student" },
  { id: "n5", category: "sessions", title: "Session cancellation â€” late notice", message: "Dilhara Senanayake cancelled the practical session scheduled for today at 2:00 PM. The instructor and vehicle slot is now available.", date: "2026-07-20", time: "08:45", read: true, action: "Reschedule" },
  { id: "n6", category: "exams", title: "Trial result recorded", message: "Ravishka Rathnayake's practical trial result has been recorded. Score: 88% â€” Passed. Certificate of completion is ready.", date: "2026-07-19", time: "17:20", read: true, action: "View result" },
  { id: "n7", category: "payments", title: "Payment received", message: "LKR 10,000 recorded for Loshan Mihisara (RCPT-2026-0841) via Bank Transfer. Remaining balance: LKR 12,500.", date: "2026-07-19", time: "14:05", read: true },
  { id: "n8", category: "permits", title: "Permit expiry warning", message: "Ruwan Wickramasinghe's learner permit expires in 30 days. Coordinate with the student for renewal.", date: "2026-07-18", time: "09:00", read: true, action: "View permit", priority: "normal" },
  { id: "n9", category: "system", title: "Backup completed successfully", message: "The weekly data backup completed at 03:00 AM on 18 July 2026. All records are secure and up to date.", date: "2026-07-18", time: "03:01", read: true },
  { id: "n10", category: "exams", title: "Upcoming written examination", message: "Written examination session scheduled for 22 July 2026 at 10:00 AM. 6 students are registered.", date: "2026-07-17", time: "15:30", read: true, action: "View exam" },
  { id: "n11", category: "sessions", title: "New session booked", message: "A practical session for Amaya Silva has been booked for 25 July 2026 at 08:00 AM with Malini Fernando.", date: "2026-07-17", time: "10:10", read: true, action: "View session" },
  { id: "n12", category: "medical", title: "Missing medical certificate", message: "Chamara Perera's medical certificate is missing from their student file. A valid certificate is required before the trial.", date: "2026-07-16", time: "11:00", read: true, action: "View student", priority: "high" },
];

const CAT_CONFIG: Record<NoteCategory, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  sessions: { icon: <Calendar size={15} />, color: "#1D4ED8", bg: "#EFF6FF", label: "Sessions" },
  payments: { icon: <CreditCard size={15} />, color: "#166534", bg: "#DCFCE7", label: "Payments" },
  permits: { icon: <FileText size={15} />, color: "#92400E", bg: "#FEF3C7", label: "Permits" },
  medical: { icon: <Stethoscope size={15} />, color: "#6D28D9", bg: "#EDE9FE", label: "Medical" },
  exams: { icon: <Award size={15} />, color: "#0E7490", bg: "#ECFEFF", label: "Exams" },
  system: { icon: <Settings size={15} />, color: "#475569", bg: "#F1F5F9", label: "System" },
};

const FILTERS: { id: NoteFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "sessions", label: "Sessions" },
  { id: "payments", label: "Payments" },
  { id: "permits", label: "Permits" },
  { id: "medical", label: "Medical" },
  { id: "exams", label: "Exams" },
  { id: "system", label: "System" },
];

function timeAgo(date: string, time: string): string {
  const then = new Date(`${date}T${time}`);
  const now = new Date("2026-07-22T09:00");
  const diffMs = now.getTime() - then.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  return `${diffD} days ago`;
}

/* â”€â”€â”€ Notification item â”€â”€â”€ */

function NotifItem({ n, onRead, onDelete }: { n: Notification; onRead: (id: string) => void; onDelete: (id: string) => void }) {
  const cfg = CAT_CONFIG[n.category];
  return (
    <div style={{ padding: "16px 20px", display: "flex", gap: 14, borderBottom: "1px solid #F1F5F9", background: n.read ? "#ffffff" : "#FAFBFF", position: "relative", transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = n.read ? "#FAFBFD" : "#F5F8FF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "#ffffff" : "#FAFBFF")}>

      {/* Unread dot */}
      {!n.read && <div style={{ position: "absolute", left: 8, top: 20, width: 6, height: 6, borderRadius: "50%", background: "#2563EB" }} />}

      {/* Icon */}
      <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{cfg.icon}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: n.read ? 600 : 700, color: "#1E293B" }}>{n.title}</span>
            {n.priority === "high" && <AlertCircle size={12} color="#DC2626" />}
          </div>
          <span style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(n.date, n.time)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
        </div>
        <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.55 }}>{n.message}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {n.action && (
            <button style={{ display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 10px", borderRadius: 6, border: `1px solid ${cfg.color}40`, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <ExternalLink size={10} />{n.action}
            </button>
          )}
          {!n.read && (
            <button onClick={() => onRead(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", color: "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Check size={10} />Mark as read
            </button>
          )}
          <button onClick={() => onDelete(n.id)}
            style={{ display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#ffffff", color: "#94A3B8", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            <Trash2 size={10} />Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Main export â”€â”€â”€ */

export function NotificationsCentre() {
  const [notes, setNotes] = useState<Notification[]>(INITIAL);
  const [filter, setFilter] = useState<NoteFilter>("all");

  const markRead = (id: string) => setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotes(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  const filtered = notes.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter !== "all") return n.category === filter;
    return true;
  });

  const unreadCount = notes.filter(n => !n.read).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: 0 }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "2px 9px", borderRadius: 10, background: "#2563EB", color: "#ffffff", fontSize: 11, fontWeight: 700 }}>{unreadCount} unread</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: "#64748B" }}>Stay on top of sessions, payments, permit renewals and system events</div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ display: "flex", alignItems: "center", gap: 5, height: 38, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <CheckCheck size={13} />Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 20 }}>
        {(Object.entries(CAT_CONFIG) as [NoteCategory, typeof CAT_CONFIG[NoteCategory]][]).map(([cat, cfg]) => {
          const count = notes.filter(n => n.category === cat).length;
          const unread = notes.filter(n => n.category === cat && !n.read).length;
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${filter === cat ? cfg.color : "#E2E8F0"}`, background: filter === cat ? cfg.bg : "#ffffff", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              <div style={{ color: cfg.color, marginBottom: 6 }}>{cfg.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>{count}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{cfg.label}</div>
              {unread > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, marginTop: 2 }}>{unread} unread</div>}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 2, background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "6px 8px", marginBottom: 16, flexWrap: "wrap" }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: active ? "#EFF6FF" : "transparent", color: active ? "#2563EB" : "#64748B", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
              {f.label}
              {f.id === "unread" && unreadCount > 0 && (
                <span style={{ marginLeft: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "#2563EB", color: "#ffffff", fontSize: 9, fontWeight: 700 }}>{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <Bell size={36} color="#CBD5E1" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>No notifications in this category</div>
          </div>
        ) : (
          filtered.map(n => <NotifItem key={n.id} n={n} onRead={markRead} onDelete={deleteNote} />)
        )}
      </div>

      {filtered.length > 0 && (
        <div style={{ padding: "12px 0", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}

