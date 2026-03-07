import { Monitor, Wifi, Bell, Clock, Activity } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { MetricsChart } from "@/components/MetricsChart";
import { BandwidthChart } from "@/components/BandwidthChart";
import { DeviceTable } from "@/components/DeviceTable";
import { AlertsFeed } from "@/components/AlertsFeed";
import { RoleBanner } from "@/components/RoleBanner";
import { useAuth } from "@/hooks/useAuth";
import { kpiData } from "@/lib/mockData";

const Index = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const isStaff = role === "it_staff";
  const isManager = role === "manager";
  const isClient = role === "client";

  const showFullMetrics = isAdmin || isStaff;
  const showAlerts = isAdmin || isStaff;
  const showDevices = isAdmin || isStaff;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Infrastructure Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time monitoring across all systems</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-online" />
          <span className="text-xs font-mono text-muted-foreground">Live</span>
        </div>
      </div>

      <RoleBanner />

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFullMetrics ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4 mb-6`}>
        <KpiCard title="Devices Online" value={kpiData.devicesOnline} subtitle="of 145 total" icon={Monitor} variant="success" />
        <KpiCard title="Devices Offline" value={kpiData.devicesOffline} icon={Wifi} variant="destructive" />
        <KpiCard title="Network Health" value={`${kpiData.networkHealth}%`} icon={Activity} variant="success" />
        {(showFullMetrics || isManager) && (
          <KpiCard title="Active Alerts" value={kpiData.activeAlerts} subtitle="2 critical" icon={Bell} variant="warning" />
        )}
        {showFullMetrics && (
          <KpiCard title="Avg Response" value={`${kpiData.avgResponseTime}ms`} icon={Clock} variant="default" />
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
          <h2 className="text-lg font-semibold text-foreground mb-1">Your Infrastructure is Healthy</h2>
          <p className="text-sm text-muted-foreground">97.8% network health — 142 of 145 devices online</p>
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
