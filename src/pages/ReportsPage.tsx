import { BarChart3, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { useMemo } from "react";

const ReportsPage = () => {
  const { data: devices } = useDevices();
  const online = devices?.filter((d) => d.status === "online").length ?? 0;
  const total = devices?.length ?? 0;
  const uptime = total ? Math.round((online / total) * 100) : 0;

  const alertCount = useMemo(() => {
    if (!devices) return { critical: 0, total: 0 };
    let critical = 0, totalAlerts = 0;
    devices.forEach((d) => {
      if (d.status === "offline") { critical++; totalAlerts++; }
      if (d.cpu_usage > 85) { critical++; totalAlerts++; }
      else if (d.cpu_usage > 70) { totalAlerts++; }
      if (d.memory_usage > 85) { critical++; totalAlerts++; }
      else if (d.memory_usage > 70) { totalAlerts++; }
      if (d.disk_usage > 85) { totalAlerts++; }
    });
    return { critical, total: totalAlerts };
  }, [devices]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Reports</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Infrastructure performance summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5 text-center">
          <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground font-mono">{total}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Devices</p>
        </div>
        <div className="glass-card p-5 text-center">
          <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-2xl font-bold text-success font-mono">{uptime}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Uptime Rate</p>
        </div>
        <div className="glass-card p-5 text-center">
          <TrendingDown className="w-6 h-6 text-destructive mx-auto mb-2" />
          <p className="text-2xl font-bold text-destructive font-mono">{alertCount.critical}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Critical Alerts</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground font-mono">{alertCount.total}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Alerts</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Device Status Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <th className="text-left pb-3">Device</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-left pb-3">IP</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">CPU</th>
                <th className="text-left pb-3">Memory</th>
              </tr>
            </thead>
            <tbody>
              {devices?.map((d) => (
                <tr key={d.id} className="border-b border-border/30">
                  <td className="py-2.5 font-medium text-foreground">{d.name}</td>
                  <td className="py-2.5 capitalize text-muted-foreground">{d.type}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{d.ip_address}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-semibold ${d.status === "online" ? "text-success" : "text-destructive"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-muted-foreground">{d.cpu_usage}%</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{d.memory_usage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
