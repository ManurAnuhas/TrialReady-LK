import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, User, Settings, LogOut, Users, Calendar, CreditCard, Award, FileText } from "lucide-react";

/* ─── Search data ─── */
const SEARCH_INDEX = [
  { label: "Kavindu Perera", sub: "STD-2026-0048 · Practical Training", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Sanduni Jayasekara", sub: "STD-2026-0052 · Trial Eligible", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Tharindu Fernando", sub: "STD-2026-0061 · Medical Pending", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Nethmi Wijesinghe", sub: "STD-2026-0068 · Theory Training", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Dilhara Senanayake", sub: "STD-2026-0072 · Written Examination", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Kasun Silva", sub: "Instructor · INS-0014", icon: User, color: "#7C3AED", bg: "#EDE9FE" },
  { label: "Malini Fernando", sub: "Instructor · INS-0018", icon: User, color: "#7C3AED", bg: "#EDE9FE" },
  { label: "Sessions — 22 July 2026", sub: "Today's schedule · 6 sessions", icon: Calendar, color: "#16A34A", bg: "#DCFCE7" },
  { label: "RCPT-2026-0841", sub: "Payment · Kavindu Perera · LKR 10,000", icon: CreditCard, color: "#D97706", bg: "#FEF3C7" },
  { label: "Written Examination Results", sub: "Sanduni Jayasekara · 88% · Passed", icon: Award, color: "#0284C7", bg: "#E0F2FE" },
  { label: "DMT Application — Kavindu Perera", sub: "Status: Draft · LP-2026-WP-00341", icon: FileText, color: "#64748B", bg: "#F1F5F9" },
];

const user = { name: "Nimal Perera", initials: "NP", email: "nimal.perera@metrodrive.lk" };
const avatarColor = "#2563EB";

const INITIAL_NOTIFS = [
  { id: 1, text: "Sanduni Jayasekara's trial exam approved", time: "5 min ago", unread: true },
  { id: 2, text: "Payment received from Tharindu Fernando", time: "1 hour ago", unread: true },
  { id: 3, text: "DMT application submitted for Nethmi Wijesinghe", time: "3 hours ago", unread: true },
  { id: 4, text: "Session completed by Kasun Silva", time: "Yesterday", unread: false },
];

interface TopNavProps {
  pageTitle: string;
}

export function TopNav({ pageTitle }: TopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [searchVal, setSearchVal] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => n.unread).length;


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const searchResults = searchVal.length > 0
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(searchVal.toLowerCase()) ||
        item.sub.toLowerCase().includes(searchVal.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header
      style={{
        height: 72,
        background: "#ffffff",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        gap: 16,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1E293B",
            margin: 0,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {pageTitle}
        </h1>
      </div>

      {/* Global search */}
      <div ref={searchRef} style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 44,
            borderRadius: 8,
            border: `1px solid ${searchFocused ? "#2563EB" : "#E2E8F0"}`,
            background: searchFocused ? "#ffffff" : "#F8FAFC",
            padding: "0 12px",
            width: 280,
            boxShadow: searchFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        >
          <Search size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search students, sessions…"
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); setSearchOpen(true); }}
            onFocus={() => { setSearchFocused(true); setSearchOpen(true); }}
            onBlur={() => setSearchFocused(false)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 14,
              color: "#1E293B",
              fontFamily: "inherit",
            }}
          />
          {searchVal && (
            <button onClick={() => { setSearchVal(""); setSearchOpen(false); }}
              style={{ border: "none", background: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 0 }}>
              ×
            </button>
          )}
        </div>
        {/* Search results panel */}
        {searchOpen && searchResults.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: 360, background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 8px 32px rgba(15,23,42,0.12)", zIndex: 50, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Search results ({searchResults.length})</span>
            </div>
            {searchResults.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={i} onClick={() => { setSearchVal(""); setSearchOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", border: "none", background: "transparent", cursor: "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid #F8FAFC" : "none", textAlign: "left" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>
                    <Icon size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {searchOpen && searchVal.length > 0 && searchResults.length === 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: 360, background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 8px 32px rgba(15,23,42,0.12)", zIndex: 50, padding: "24px 16px", textAlign: "center" }}>
            <Search size={24} color="#CBD5E1" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>No results for "{searchVal}"</div>
            <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>Try searching by name, ID or payment reference</div>
          </div>
        )}
      </div>

      {/* Notification bell */}
      <div style={{ position: "relative" }} ref={notifRef}>
        <button
          onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            background: notifOpen ? "#F8FAFC" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.15s",
          }}
        >
          <Bell size={20} color="#475569" />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#DC2626",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ffffff",
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification dropdown */}
        {notifOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 360,
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 16px 12px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1E293B" }}>Notifications</span>
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#2563EB",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Mark all as read
              </button>
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    background: n.unread ? "#F8FAFC" : "#ffffff",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
                  onMouseLeave={e => (e.currentTarget.style.background = n.unread ? "#F8FAFC" : "#ffffff")}
                >
                  {n.unread && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#2563EB",
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {!n.unread && <div style={{ width: 8, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.4, fontWeight: n.unread ? 500 : 400 }}>
                      {n.text}
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 16px", textAlign: "center", borderTop: "1px solid #F1F5F9" }}>
              <button
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#2563EB",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User profile */}
      <div style={{ position: "relative" }} ref={profileRef}>
        <button
          onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 44,
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            background: profileOpen ? "#F8FAFC" : "#ffffff",
            padding: "0 12px 0 8px",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user.initials}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", lineHeight: 1.2 }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.3, marginTop: 1 }}>
              Administrator
            </div>
          </div>
          <ChevronDown
            size={16}
            color="#64748B"
            style={{
              transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              marginLeft: 2,
            }}
          />
        </button>

        {/* Profile dropdown */}
        {profileOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 296,
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {/* User info */}
            <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user.initials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1E293B" }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{user.email}</div>
                </div>
              </div>
            </div>

            {/* Regular actions */}
            <div style={{ padding: "8px" }}>
              {[
                { icon: User, label: "View profile" },
                { icon: Settings, label: "Account settings" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#475569",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "left",
                    transition: "background 0.1s, color 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC";
                    (e.currentTarget as HTMLButtonElement).style.color = "#1E293B";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#475569";
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div style={{ padding: "0 8px 8px" }}>
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#DC2626",
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
