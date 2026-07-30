import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Car,
  Package,
  CreditCard,
  ClipboardCheck,
  FileText,
  Bell,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BrandMark } from "./BrandMark";

export type Role = "admin" | "instructor" | "student";

interface NavItem {
  label: string;
  icon: React.ElementType;
  id: string;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, id: "Dashboard" },
  { label: "Students", icon: Users, id: "Students" },
  { label: "Calendar", icon: Calendar, id: "Calendar" },
  { label: "Instructors", icon: UserCheck, id: "Instructors" },
  { label: "Vehicles", icon: Car, id: "Vehicles" },
  { label: "Packages", icon: Package, id: "Packages" },
  { label: "Payments", icon: CreditCard, id: "Payments" },
  { label: "Exams & trials", icon: ClipboardCheck, id: "Exams & trials" },
  { label: "DMT applications", icon: FileText, id: "DMT applications" },
  { label: "Notifications", icon: Bell, id: "Notifications" },
  { label: "Reports", icon: BarChart2, id: "Reports" },
  { label: "Settings", icon: Settings, id: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  activeNav: string;
  onNavigate: (id: string) => void;
  onLogout: () => void;
}

export function Sidebar({ collapsed, onCollapse, activeNav, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 248,
        minWidth: collapsed ? 72 : 248,
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        transition: "width 0.25s ease, min-width 0.25s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 16px" : "0 20px",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <BrandMark compact={collapsed} tone="light" />
      </div>

      {!collapsed && (
        <div style={{ padding: "12px 16px 4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: "7px 12px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB" }} />
            <span style={{ color: "#94A3B8", fontSize: 12, fontWeight: 500 }}>Administrator</span>
          </div>
        </div>
      )}

      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "0 10px" : "0 12px",
                height: 44,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                width: "100%",
                background: isActive ? "#2563EB" : "transparent",
                color: isActive ? "#ffffff" : "#94A3B8",
                transition: "background 0.15s, color 0.15s",
                textAlign: "left",
                flexShrink: 0,
                fontFamily: "inherit",
              }}
              onMouseEnter={(event) => {
                if (!isActive) {
                  event.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  event.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(event) => {
                if (!isActive) {
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.color = "#94A3B8";
                }
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "8px 10px 16px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <button
          title={collapsed ? "Help & support" : undefined}
          style={bottomButtonStyle(collapsed)}
        >
          <HelpCircle size={18} />
          {!collapsed && <span>Help & support</span>}
        </button>
        <button
          onClick={onLogout}
          title={collapsed ? "Log out" : undefined}
          style={bottomButtonStyle(collapsed)}
        >
          <LogOut size={18} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      <button
        onClick={() => onCollapse(!collapsed)}
        style={{
          position: "absolute",
          top: 84,
          right: -12,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#1E293B",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#94A3B8",
          zIndex: 10,
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

function bottomButtonStyle(collapsed: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: collapsed ? 0 : 10,
    justifyContent: collapsed ? "center" : "flex-start",
    padding: collapsed ? "0 10px" : "0 12px",
    height: 44,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    width: "100%",
    background: "transparent",
    color: "#94A3B8",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 500,
  };
}
