import { useAuth } from "@/hooks/useAuth";
import { Shield, Eye } from "lucide-react";

const roleMeta: Record<string, { label: string; color: string; description: string }> = {
  admin: { label: "Administrator", color: "text-destructive", description: "Full system access — manage users, devices, alerts, and settings" },
  it_staff: { label: "IT Staff", color: "text-primary", description: "Technical dashboards with full device metrics and alert management" },
  manager: { label: "Manager", color: "text-warning", description: "Executive overview with KPIs, trends, and summary reports" },
  client: { label: "Client", color: "text-success", description: "Read-only view of your assigned infrastructure health" },
};

export const RoleBanner = () => {
  const { role } = useAuth();
  if (!role) return null;
  const meta = roleMeta[role];

  return (
    <div className="glass-card px-4 py-2.5 flex items-center gap-3 mb-4">
      <Shield className={`w-4 h-4 ${meta.color}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
      <span className="text-xs text-muted-foreground hidden sm:inline">— {meta.description}</span>
      <div className="ml-auto flex items-center gap-1 text-muted-foreground">
        <Eye className="w-3 h-3" />
        <span className="text-[10px]">Role-based view</span>
      </div>
    </div>
  );
};
