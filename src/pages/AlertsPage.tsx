import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { useMemo } from "react";

interface DerivedAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  device: string;
}

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
};

const AlertsPage = () => {
  const { data: devices } = useDevices();

  const alerts = useMemo<DerivedAlert[]>(() => {
    if (!devices) return [];
    const result: DerivedAlert[] = [];
    devices.forEach((d) => {
      if (d.status === "offline") {
        result.push({ id: `${d.id}-offline`, severity: "critical", message: `${d.name} is unreachable`, device: d.name });
      }
      if (d.cpu_usage > 85) {
        result.push({ id: `${d.id}-cpu`, severity: "critical", message: `${d.name} CPU usage at ${d.cpu_usage}%`, device: d.name });
      } else if (d.cpu_usage > 70) {
        result.push({ id: `${d.id}-cpu`, severity: "warning", message: `${d.name} CPU usage at ${d.cpu_usage}%`, device: d.name });
      }
      if (d.memory_usage > 85) {
        result.push({ id: `${d.id}-mem`, severity: "critical", message: `${d.name} memory usage at ${d.memory_usage}%`, device: d.name });
      } else if (d.memory_usage > 70) {
        result.push({ id: `${d.id}-mem`, severity: "warning", message: `${d.name} memory usage at ${d.memory_usage}%`, device: d.name });
      }
      if (d.disk_usage > 85) {
        result.push({ id: `${d.id}-disk`, severity: "warning", message: `${d.name} disk usage at ${d.disk_usage}%`, device: d.name });
      }
      if (d.status === "online") {
        result.push({ id: `${d.id}-ok`, severity: "info", message: `${d.name} operating normally`, device: d.name });
      }
    });
    return result.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    });
  }, [devices]);

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
        {alerts.length === 0 && (
          <div className="glass-card p-8 text-center text-muted-foreground text-sm">No alerts — all systems normal</div>
        )}
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
                <span className="text-[10px] font-mono text-muted-foreground">{alert.device}</span>
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
