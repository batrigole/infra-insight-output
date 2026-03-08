import { Server, Router, Monitor, Shield, Network } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";

const typeIcons: Record<string, React.ElementType> = {
  server: Server,
  router: Router,
  computer: Monitor,
  switch: Network,
  firewall: Shield,
};

const statusClass: Record<string, string> = {
  online: "status-online",
  warning: "status-warning",
  offline: "status-offline",
};

const usageBar = (value: number) => {
  const color = value > 80 ? "bg-destructive" : value > 60 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground">{value}%</span>
    </div>
  );
};

export const DeviceTable = () => {
  const { data: devices, isLoading } = useDevices();

  if (isLoading) return <div className="glass-card p-5 animate-pulse text-sm text-muted-foreground">Loading devices...</div>;

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Infrastructure Devices</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
              <th className="text-left pb-3 pl-2">Device</th>
              <th className="text-left pb-3">IP</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">CPU</th>
              <th className="text-left pb-3">Memory</th>
              <th className="text-left pb-3">Uptime</th>
            </tr>
          </thead>
          <tbody>
            {devices?.map((d) => {
              const Icon = typeIcons[d.type] || Server;
              return (
                <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-foreground">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-muted-foreground">{d.ip_address}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${statusClass[d.status] || "status-offline"}`} />
                      <span className="capitalize text-xs">{d.status}</span>
                    </div>
                  </td>
                  <td className="py-3">{d.status !== "offline" ? usageBar(d.cpu_usage) : <span className="text-xs text-muted-foreground">—</span>}</td>
                  <td className="py-3">{d.status !== "offline" ? usageBar(d.memory_usage) : <span className="text-xs text-muted-foreground">—</span>}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{d.uptime}</td>
                </tr>
              );
            })}
            {(!devices || devices.length === 0) && (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No devices found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
