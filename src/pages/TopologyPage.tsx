import { useDevices } from "@/hooks/useDevices";
import { Server, Router, Monitor, Shield, Network, ArrowDown } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  server: Server,
  router: Router,
  computer: Monitor,
  switch: Network,
  firewall: Shield,
};

const TopologyPage = () => {
  const { data: devices, isLoading } = useDevices();

  const routers = devices?.filter((d) => d.type === "router") ?? [];
  const computers = devices?.filter((d) => d.type === "computer") ?? [];
  const servers = devices?.filter((d) => d.type === "server") ?? [];
  const switches = devices?.filter((d) => d.type === "switch") ?? [];
  const firewalls = devices?.filter((d) => d.type === "firewall") ?? [];
  const others = devices?.filter((d) => !["router", "computer", "server", "switch", "firewall"].includes(d.type)) ?? [];

  const renderTier = (title: string, items: typeof routers, tierColor: string) => {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-col items-center gap-2">
        <span className={`text-[10px] uppercase tracking-widest font-bold ${tierColor}`}>{title}</span>
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((d) => {
            const Icon = typeIcons[d.type] || Server;
            const isOnline = d.status === "online";
            return (
              <div key={d.id} className={`glass-card p-4 w-40 text-center hover:border-primary/30 transition-colors ${!isOnline ? "opacity-50" : ""}`}>
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isOnline ? "text-primary" : "text-destructive"}`} />
                <p className="text-xs font-semibold text-foreground truncate">{d.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{d.ip_address}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className={`status-dot ${isOnline ? "status-online" : "status-offline"}`} />
                  <span className={`text-[10px] ${isOnline ? "text-success" : "text-destructive"}`}>{d.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="text-sm text-muted-foreground animate-pulse">Loading topology...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Network Topology</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Visual map of your infrastructure hierarchy</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {renderTier("Gateway / Router", routers, "text-warning")}
        {(routers.length > 0 && (firewalls.length > 0 || switches.length > 0 || servers.length > 0 || computers.length > 0)) && (
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        )}
        {renderTier("Firewall", firewalls, "text-destructive")}
        {firewalls.length > 0 && (switches.length > 0 || servers.length > 0 || computers.length > 0) && (
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        )}
        {renderTier("Switches", switches, "text-primary")}
        {switches.length > 0 && (servers.length > 0 || computers.length > 0) && (
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        )}
        {renderTier("Servers", servers, "text-chart-2")}
        {servers.length > 0 && computers.length > 0 && (
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        )}
        {renderTier("Computers / Endpoints", computers, "text-chart-4")}
        {renderTier("Other Devices", others, "text-muted-foreground")}
      </div>
    </div>
  );
};

export default TopologyPage;
