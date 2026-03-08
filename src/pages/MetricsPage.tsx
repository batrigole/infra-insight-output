import { MetricsChart } from "@/components/MetricsChart";
import { BandwidthChart } from "@/components/BandwidthChart";
import { useDevices } from "@/hooks/useDevices";
import { Activity, Wifi, Clock } from "lucide-react";

const MetricsPage = () => {
  const { data: devices } = useDevices();
  const onlineDevices = devices?.filter((d) => d.status === "online") ?? [];

  const avgLatency = onlineDevices.length
    ? Math.round(onlineDevices.reduce((a, d) => a + d.latency, 0) / onlineDevices.length)
    : 0;
  const avgBandwidth = onlineDevices.length
    ? Math.round(onlineDevices.reduce((a, d) => a + d.bandwidth, 0) / onlineDevices.length)
    : 0;
  const saturated = devices?.filter((d) => d.saturation).length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Métriques</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Performance réseau et analyses de bande passante</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-warning" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Latence moy.</p>
            <p className="text-lg font-bold text-foreground font-mono">{avgLatency}ms</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Wifi className="w-5 h-5 text-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bande passante moy.</p>
            <p className="text-lg font-bold text-foreground font-mono">{avgBandwidth} Mbps</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-chart-2" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Appareils en ligne</p>
            <p className="text-lg font-bold text-foreground font-mono">{onlineDevices.length}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-destructive" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Saturés</p>
            <p className="text-lg font-bold text-foreground font-mono">{saturated}</p>
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
