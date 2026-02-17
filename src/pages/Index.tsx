import { Monitor, Wifi, Bell, Clock, Activity } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { MetricsChart } from "@/components/MetricsChart";
import { BandwidthChart } from "@/components/BandwidthChart";
import { DeviceTable } from "@/components/DeviceTable";
import { AlertsFeed } from "@/components/AlertsFeed";
import { Sidebar } from "@/components/Sidebar";
import { kpiData } from "@/lib/mockData";

const Index = () => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Infrastructure Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time monitoring across all systems</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-online" />
          <span className="text-xs font-mono text-muted-foreground">Live</span>
          <span className="text-xs text-muted-foreground ml-2">
            <Activity className="w-3 h-3 inline mr-1" />
            Last sync: just now
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard title="Devices Online" value={kpiData.devicesOnline} subtitle="of 145 total" icon={Monitor} variant="success" />
        <KpiCard title="Devices Offline" value={kpiData.devicesOffline} icon={Wifi} variant="destructive" />
        <KpiCard title="Network Health" value={`${kpiData.networkHealth}%`} icon={Activity} variant="success" />
        <KpiCard title="Active Alerts" value={kpiData.activeAlerts} subtitle="2 critical" icon={Bell} variant="warning" />
        <KpiCard title="Avg Response" value={`${kpiData.avgResponseTime}ms`} icon={Clock} variant="default" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MetricsChart />
        <BandwidthChart />
      </div>

      {/* Table + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DeviceTable />
        </div>
        <AlertsFeed />
      </div>
    </main>
  </div>
);

export default Index;
