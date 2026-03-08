import { Server, Router, Monitor, Network, Globe } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { useNavigate } from "react-router-dom";

const typeIcons: Record<string, React.ElementType> = {
  server: Server,
  router: Router,
  computer: Monitor,
  switch: Network,
  webpage: Globe,
};

const statusClass: Record<string, string> = {
  online: "status-online",
  warning: "status-warning",
  offline: "status-offline",
};

export const DeviceTable = () => {
  const { data: devices, isLoading } = useDevices();
  const navigate = useNavigate();

  if (isLoading) return <div className="glass-card p-5 animate-pulse text-sm text-muted-foreground">Chargement...</div>;

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Appareils surveillés</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
              <th className="text-left pb-3 pl-2">Appareil</th>
              <th className="text-left pb-3">IP</th>
              <th className="text-left pb-3">État</th>
              <th className="text-left pb-3">Latence</th>
              <th className="text-left pb-3">Bande passante</th>
            </tr>
          </thead>
          <tbody>
            {devices?.map((d) => {
              const Icon = typeIcons[d.type] || Server;
              return (
                <tr
                  key={d.id}
                  onClick={() => d.category !== "webpage" && navigate(`/devices/${d.id}`)}
                  className={`border-b border-border/30 transition-colors ${
                    d.category !== "webpage" ? "hover:bg-secondary/30 cursor-pointer" : ""
                  }`}
                >
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
                      <span className={`text-xs font-bold ${d.status === "online" ? "text-success" : "text-destructive"}`}>
                        {d.status === "online" ? "UP" : "DOWN"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {d.status === "online" ? `${d.latency}ms` : "—"}
                  </td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {d.status === "online" ? `${d.bandwidth} Mbps` : "—"}
                  </td>
                </tr>
              );
            })}
            {(!devices || devices.length === 0) && (
              <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">Aucun appareil trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
