import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { alerts } from "@/lib/mockData";

const severityConfig: Record<string, { icon: React.ElementType; dot: string; text: string }> = {
  critical: { icon: AlertCircle, dot: "status-offline", text: "text-destructive" },
  warning: { icon: AlertTriangle, dot: "status-warning", text: "text-warning" },
  info: { icon: Info, dot: "status-online", text: "text-muted-foreground" },
};

export const AlertsFeed = () => (
  <div className="glass-card p-5 animate-slide-in">
    <h3 className="text-sm font-semibold text-foreground mb-4">Active Alerts</h3>
    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
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
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            </div>
            <span className={`status-dot flex-shrink-0 mt-1.5 ${cfg.dot}`} />
          </div>
        );
      })}
    </div>
  </div>
);
