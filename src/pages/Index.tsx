import { Monitor, Wifi, Bell, Clock, Activity } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { MetricsChart } from "@/components/MetricsChart";
import { BandwidthChart } from "@/components/BandwidthChart";
import { DeviceTable } from "@/components/DeviceTable";
import { AlertsFeed } from "@/components/AlertsFeed";
import { RoleBanner } from "@/components/RoleBanner";
import { useAuth } from "@/hooks/useAuth";
import { useDevices } from "@/hooks/useDevices";

const Index = () => {
  const { role } = useAuth();
  const { data: devices } = useDevices();

  const isAdmin = role === "admin";
  const isStaff = role === "it_staff";
  const isManager = role === "manager";
  const isClient = role === "client";

  const showFullMetrics = isAdmin || isStaff;
  const showAlerts = isAdmin || isStaff;
  const showDevices = isAdmin || isStaff;

  const total = devices?.length ?? 0;
  const online = devices?.filter((d) => d.status === "online").length ?? 0;
  const offline = total - online;
  const healthPercent = total > 0 ? Math.round((online / total) * 100 * 10) / 10 : 0;

  const onlineDevices = devices?.filter((d) => d.status === "online") ?? [];
  const avgCpu = onlineDevices.length
    ? Math.round(onlineDevices.reduce((a, d) => a + d.cpu_usage, 0) / onlineDevices.length)
    : 0;

  // Derive alert count from device status
  const alertCount = devices?.filter((d) => d.status === "offline" || d.cpu_usage > 70 || d.memory_usage > 70 || d.disk_usage > 85).length ?? 0;
  const criticalCount = devices?.filter((d) => d.status === "offline" || d.cpu_usage > 85 || d.memory_usage > 85).length ?? 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Infrastructure Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time monitoring · refreshes every 15s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-online" />
          <span className="text-xs font-mono text-muted-foreground">Live</span>
        </div>
      </div>

      <RoleBanner />

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFullMetrics ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4 mb-6`}>
        <KpiCard title="Devices Online" value={online} subtitle={`of ${total} total`} icon={Monitor} variant="success" />
        <KpiCard title="Devices Offline" value={offline} icon={Wifi} variant="destructive" />
        <KpiCard title="Network Health" value={`${healthPercent}%`} icon={Activity} variant="success" />
        {(showFullMetrics || isManager) && (
          <KpiCard title="Active Alerts" value={alertCount} subtitle={`${criticalCount} critical`} icon={Bell} variant="warning" />
        )}
        {showFullMetrics && (
          <KpiCard title="Avg CPU" value={`${avgCpu}%`} icon={Clock} variant="default" />
        )}
      </div>

      {(showFullMetrics || isManager) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <MetricsChart />
          <BandwidthChart />
        </div>
      )}

      {isClient && (
        <div className="glass-card p-8 text-center mb-6">
          <Activity className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-1">Your Infrastructure is {healthPercent >= 90 ? "Healthy" : "Degraded"}</h2>
          <p className="text-sm text-muted-foreground">{healthPercent}% network health — {online} of {total} devices online</p>
        </div>
      )}

      {(showDevices || showAlerts) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {showDevices && (
            <div className="lg:col-span-2">
              <DeviceTable />
            </div>
          )}
          {showAlerts && <AlertsFeed />}
        </div>
      )}
    </>
  );
};

export default Index;
