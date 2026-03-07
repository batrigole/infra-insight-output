import { MetricsChart } from "@/components/MetricsChart";
import { BandwidthChart } from "@/components/BandwidthChart";
import { useDevices } from "@/hooks/useDevices";
import { Activity } from "lucide-react";

const MetricsPage = () => {
  const { data: devices } = useDevices();
  const onlineDevices = devices?.filter((d) => d.status === "online") ?? [];

  const avgCpu = onlineDevices.length
    ? Math.round(onlineDevices.reduce((a, d) => a + d.cpu_usage, 0) / onlineDevices.length)
    : 0;
  const avgMem = onlineDevices.length
    ? Math.round(onlineDevices.reduce((a, d) => a + d.memory_usage, 0) / onlineDevices.length)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Metrics</h1>
        <p className="text-xs text-muted-foreground mt-0.5">System performance and bandwidth analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg CPU</p>
            <p className="text-lg font-bold text-foreground font-mono">{avgCpu}%</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-chart-2" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Memory</p>
            <p className="text-lg font-bold text-foreground font-mono">{avgMem}%</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-warning" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Devices Online</p>
            <p className="text-lg font-bold text-foreground font-mono">{onlineDevices.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MetricsChart />
        <BandwidthChart />
      </div>
    </div>
  );
};

export default MetricsPage;
