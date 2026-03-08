import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { useMemo } from "react";

interface DerivedAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  device: string;
  time: string;
}

const severityConfig: Record<string, { icon: React.ElementType; dot: string; text: string }> = {
  critical: { icon: AlertCircle, dot: "status-offline", text: "text-destructive" },
  warning: { icon: AlertTriangle, dot: "status-warning", text: "text-warning" },
  info: { icon: Info, dot: "status-online", text: "text-muted-foreground" },
};

export const AlertsFeed = () => {
  const { data: devices } = useDevices();

  const alerts = useMemo<DerivedAlert[]>(() => {
    if (!devices) return [];
    const result: DerivedAlert[] = [];
    devices.forEach((d) => {
      if (d.status === "offline") {
        result.push({ id: `${d.id}-offline`, severity: "critical", message: `${d.name} is unreachable`, device: d.name, time: "now" });
      }
      if (d.cpu_usage > 85) {
        result.push({ id: `${d.id}-cpu`, severity: "critical", message: `${d.name} CPU at ${d.cpu_usage}%`, device: d.name, time: "now" });
      } else if (d.cpu_usage > 70) {
        result.push({ id: `${d.id}-cpu`, severity: "warning", message: `${d.name} CPU at ${d.cpu_usage}%`, device: d.name, time: "now" });
      }
      if (d.memory_usage > 85) {
        result.push({ id: `${d.id}-mem`, severity: "critical", message: `${d.name} memory at ${d.memory_usage}%`, device: d.name, time: "now" });
      } else if (d.memory_usage > 70) {
        result.push({ id: `${d.id}-mem`, severity: "warning", message: `${d.name} memory at ${d.memory_usage}%`, device: d.name, time: "now" });
      }
      if (d.disk_usage > 85) {
        result.push({ id: `${d.id}-disk`, severity: "warning", message: `${d.name} disk at ${d.disk_usage}%`, device: d.name, time: "now" });
      }
      if (d.status === "online") {
        result.push({ id: `${d.id}-ok`, severity: "info", message: `${d.name} operating normally`, device: d.name, time: "now" });
      }
    });
    return result.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    });
  }, [devices]);

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Active Alerts</h3>
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
        )}
        {alerts.map((a) => {
          const cfg = severityConfig[a.severity];
          const Icon = cfg.icon;
          return (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{a.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-muted-foreground">{a.device}</span>
                </div>
              </div>
              <span className={`status-dot flex-shrink-0 mt-1.5 ${cfg.dot}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
