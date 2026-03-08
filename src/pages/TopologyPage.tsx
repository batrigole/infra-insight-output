import { useDevices } from "@/hooks/useDevices";
import { Globe, Router, Monitor, Server, Network } from "lucide-react";

const TopologyPage = () => {
  const { data: devices, isLoading } = useDevices();

  const routers = devices?.filter((d) => d.category === "router") ?? [];
  const computers = devices?.filter((d) => d.category === "device") ?? [];
  const webpages = devices?.filter((d) => d.category === "webpage") ?? [];

  // Group computers by location/router association (from network_architecture.php)
  const routerGroups = [
    { 
      router: routers.find(r => r.ip_address === "192.168.1.1"),
      devices: computers.filter(c => ["192.168.1.10", "192.168.1.21"].includes(c.ip_address)),
      label: "ACCUEIL(TROISIEME)"
    },
    {
      router: routers.find(r => r.ip_address === "192.168.1.2"),
      devices: computers.filter(c => ["192.168.1.247"].includes(c.ip_address)),
      label: "TECHNICAL OFFICE"
    },
    {
      router: routers.find(r => r.ip_address === "192.168.137.1"),
      devices: computers.filter(c => ["192.168.137.3", "192.168.137.4"].includes(c.ip_address)),
      label: "NOC (SIXIÈME)"
    },
  ];

  if (isLoading) return <div className="text-sm text-muted-foreground animate-pulse">Chargement...</div>;

  const isOnline = (status: string) => status === "online";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Architecture Réseau</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Topologie Cisco-style de votre infrastructure</p>
      </div>

      <div className="glass-card p-6 animate-slide-in">
        {/* Internet Cloud */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-5 h-5 text-primary mx-auto mb-0.5" />
              <span className="text-[10px] font-bold text-primary">Internet</span>
            </div>
          </div>
          <div className="w-0.5 h-8 bg-border/50" />
        </div>

        {/* Webpages monitored */}
        {webpages.length > 0 && (
          <div className="flex justify-center gap-4 mb-4">
            {webpages.map(w => (
              <div key={w.id} className={`px-3 py-1.5 rounded-lg border text-center ${isOnline(w.status) ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
                <p className="text-[10px] font-bold text-foreground">{w.name}</p>
                <p className="text-[9px] font-mono text-muted-foreground">{w.ip_address}</p>
                <span className={`text-[9px] font-bold ${isOnline(w.status) ? "text-success" : "text-destructive"}`}>
                  {isOnline(w.status) ? "UP" : "DOWN"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mb-2">
          <div className="w-0.5 h-6 bg-border/50" />
        </div>

        {/* Router groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routerGroups.map((group, idx) => {
            const router = group.router;
            const routerOnline = router ? isOnline(router.status) : false;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Router */}
                <div className={`w-full max-w-[200px] p-3 rounded-xl border-2 text-center mb-2 ${
                  routerOnline ? "border-primary/40 bg-primary/5" : "border-destructive/30 bg-destructive/5 opacity-60"
                }`}>
                  <Router className={`w-6 h-6 mx-auto mb-1 ${routerOnline ? "text-primary" : "text-destructive"}`} />
                  <p className="text-xs font-bold text-foreground truncate">{router?.name || group.label}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{router?.ip_address || "—"}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className={`status-dot ${routerOnline ? "status-online" : "status-offline"}`} />
                    <span className={`text-[9px] font-bold ${routerOnline ? "text-success" : "text-destructive"}`}>
                      {routerOnline ? "UP" : "DOWN"}
                    </span>
                  </div>
                </div>

                {/* Switch */}
                <div className="w-0.5 h-4 bg-border/50" />
                <div className="w-20 h-5 rounded bg-chart-1/20 border border-chart-1/30 flex items-center justify-center mb-2">
                  <Network className="w-3 h-3 text-chart-1 mr-1" />
                  <span className="text-[8px] text-chart-1 font-bold">Switch</span>
                </div>
                <div className="w-0.5 h-4 bg-border/50" />

                {/* Connected PCs */}
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {group.devices.map((dev) => {
                    const devOnline = isOnline(dev.status);
                    return (
                      <div key={dev.id} className={`p-2 rounded-lg border text-center min-w-[80px] ${
                        devOnline ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5 opacity-50"
                      }`}>
                        <Monitor className={`w-4 h-4 mx-auto mb-0.5 ${devOnline ? "text-foreground" : "text-destructive"}`} />
                        <p className="text-[9px] font-bold text-foreground truncate">{dev.name}</p>
                        <p className="text-[8px] font-mono text-muted-foreground">{dev.ip_address}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Server (shared resource, connected to NOC) */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-0.5 h-6 bg-border/50" />
          <div className="p-3 rounded-xl border-2 border-chart-2/30 bg-chart-2/5 text-center">
            <Server className="w-6 h-6 mx-auto mb-1 text-chart-2" />
            <p className="text-xs font-bold text-foreground">Serveur Local</p>
            <p className="text-[10px] font-mono text-muted-foreground">10.255.74.9</p>
          </div>
          {/* Dashed lines to other switches */}
          <div className="flex gap-8 mt-2">
            <div className="border-t-2 border-dashed border-primary/30 w-16" />
            <div className="border-t-2 border-dashed border-primary/30 w-16" />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 rounded-lg bg-secondary/20 border border-border/30">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Légende</p>
          <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Router className="w-3 h-3 text-primary" />
              <span>Routeur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Network className="w-3 h-3 text-chart-1" />
              <span>Switch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3 h-3 text-foreground" />
              <span>PC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="w-3 h-3 text-chart-2" />
              <span>Serveur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-primary" />
              <span>Internet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopologyPage;
