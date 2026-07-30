import React, { useState } from "react";
import { Sidebar } from "./components/shell/Sidebar";
import { TopNav } from "./components/shell/TopNav";
import { LoginScreen } from "./components/screens/LoginScreen";
import { AdminDashboard } from "./components/screens/AdminDashboard";
import { StudentManagement } from "./components/screens/StudentManagement";
import { CalendarScheduling } from "./components/screens/CalendarScheduling";
import { InstructorManagement } from "./components/screens/InstructorManagement";
import { VehicleManagement } from "./components/screens/VehicleManagement";
import { PackageManagement } from "./components/screens/PackageManagement";
import { PaymentManagement } from "./components/screens/PaymentManagement";
import { ExamsTrials } from "./components/screens/ExamsTrials";
import { DmtApplication } from "./components/screens/DmtApplication";
import { NotificationsCentre } from "./components/screens/NotificationsCentre";
import { ReportsAnalytics } from "./components/screens/ReportsAnalytics";
import { SettingsScreen } from "./components/screens/SettingsScreen";

type AppScreen = "login" | "app";

function MainContent({ activeNav, onNavigate }: { activeNav: string; onNavigate: (nav: string) => void }) {
  switch (activeNav) {
    case "Dashboard":
      return <AdminDashboard onNavigate={onNavigate} />;
    case "Students":
      return <StudentManagement />;
    case "Calendar":
      return <CalendarScheduling />;
    case "Instructors":
      return <InstructorManagement />;
    case "Vehicles":
      return <VehicleManagement />;
    case "Packages":
      return <PackageManagement />;
    case "Payments":
      return <PaymentManagement />;
    case "Exams & trials":
      return <ExamsTrials />;
    case "DMT applications":
      return <DmtApplication />;
    case "Notifications":
      return <NotificationsCentre />;
    case "Reports":
      return <ReportsAnalytics />;
    case "Settings":
      return <SettingsScreen />;
    default:
      return <AdminDashboard onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("login");
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  if (screen === "login") {
    return <LoginScreen onLogin={() => setScreen("app")} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#F8FAFC",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        activeNav={activeNav}
        onNavigate={setActiveNav}
        onLogout={() => {
          setActiveNav("Dashboard");
          setScreen("login");
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
        <TopNav pageTitle={activeNav} />
        <main style={{ flex: 1, overflowY: "auto", padding: 32, background: "#F8FAFC" }}>
          <MainContent activeNav={activeNav} onNavigate={setActiveNav} />
        </main>
      </div>
    </div>
  );
}
