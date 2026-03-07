import { LayoutDashboard, Server, Bell, Settings, Map, BarChart3, Shield, Users, Activity, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const allNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", roles: ["admin", "it_staff", "manager", "client"] },
  { icon: Server, label: "Devices", path: "/devices", roles: ["admin", "it_staff"] },
  { icon: Activity, label: "Metrics", path: "/metrics", roles: ["admin", "it_staff", "manager"] },
  { icon: Bell, label: "Alerts", path: "/alerts", badge: 7, roles: ["admin", "it_staff"] },
  { icon: Map, label: "Topology", path: "/topology", roles: ["admin", "it_staff"] },
  { icon: BarChart3, label: "Reports", path: "/reports", roles: ["admin", "it_staff", "manager"] },
  { icon: Users, label: "Users", path: "/users", roles: ["admin"] },
  { icon: Shield, label: "Security", path: "/security", roles: ["admin"] },
  { icon: Settings, label: "Settings", path: "/settings", roles: ["admin"] },
];

export const Sidebar = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = allNavItems.filter((item) => !role || item.roles.includes(role));

  return (
    <aside className="w-16 lg:w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="hidden lg:block text-sm font-bold text-foreground tracking-tight">Infra-Insight</span>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path, badge }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
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
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground flex-shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{user?.email ?? "User"}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{role ?? "loading..."}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
