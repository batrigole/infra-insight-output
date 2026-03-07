import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { alerts } from "@/lib/mockData";

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
};

const AlertsPage = () => {
  const critical = alerts.filter((a) => a.severity === "critical").length;
  const warnings = alerts.filter((a) => a.severity === "warning").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Alerts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {critical} critical · {warnings} warnings · {alerts.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-destructive" />
          <span className="text-xs font-mono text-muted-foreground">{alerts.length} active</span>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.info;
          const Icon = config.icon;
          return (
            <div key={alert.id} className="glass-card p-4 flex items-start gap-3 hover:border-primary/20 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{alert.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-mono text-muted-foreground">{alert.device}</span>
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase ${config.color}`}>{alert.severity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPage;
