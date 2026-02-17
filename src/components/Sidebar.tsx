import { LayoutDashboard, Server, Bell, Settings, Map, BarChart3, Shield, Users, Activity } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Server, label: "Devices" },
  { icon: Activity, label: "Metrics" },
  { icon: Bell, label: "Alerts", badge: 7 },
  { icon: Map, label: "Topology" },
  { icon: BarChart3, label: "Reports" },
  { icon: Users, label: "Users" },
  { icon: Shield, label: "Security" },
  { icon: Settings, label: "Settings" },
];

export const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="w-16 lg:w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="hidden lg:block text-sm font-bold text-foreground tracking-tight">Infra-Insight</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ icon: Icon, label, badge }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active === label
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden lg:block">{label}</span>
            {badge && (
              <span className="hidden lg:flex ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground flex-shrink-0">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-foreground">Admin</p>
            <p className="text-[10px] text-muted-foreground">admin@infra.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
