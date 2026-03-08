import { Server, Router, Monitor, Wifi, WifiOff, Globe, ArrowRight } from "lucide-react";
import { useDevices, MonitoredDevice } from "@/hooks/useDevices";
import { useNavigate } from "react-router-dom";

const categoryConfig = {
  router: { title: "Routeurs", icon: Router, rowClass: "router-row" },
  device: { title: "Devices", icon: Monitor, rowClass: "device-row" },
  webpage: { title: "Pages Web & Serveur", icon: Globe, rowClass: "webpage-row" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const isUp = status === "online";
  return (
    <div className="flex items-center gap-2">
      <span className={`status-dot ${isUp ? "status-online" : "status-offline"}`} />
      <span className={`text-xs font-bold uppercase ${isUp ? "text-success" : "text-destructive"}`}>
        {isUp ? "UP" : "DOWN"}
      </span>
    </div>
  );
};

const DeviceTable = ({ 
  title, 
  devices, 
  icon: Icon, 
  clickable = true 
}: { 
  title: string; 
  devices: MonitoredDevice[]; 
  icon: React.ElementType;
  clickable?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-5 animate-slide-in mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground ml-auto">{devices.length} devices</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
              <th className="text-left pb-3 pl-2">{title === "Routeurs" ? "Routeur" : title === "Devices" ? "Device" : "Page Web"}</th>
              <th className="text-left pb-3">Adresse IP</th>
              <th className="text-left pb-3">État</th>
              <th className="text-left pb-3">Latence</th>
              <th className="text-left pb-3">Bande passante</th>
              {clickable && <th className="text-right pb-3 pr-2"></th>}
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr
                key={d.id}
                onClick={() => clickable && navigate(`/devices/${d.id}`)}
                className={`border-b border-border/30 transition-colors ${
                  clickable ? "hover:bg-secondary/30 cursor-pointer" : ""
                }`}
              >
                <td className="py-3 pl-2">
                  <span className="font-medium text-foreground">{d.name}</span>
                </td>
                <td className="py-3 font-mono text-muted-foreground">{d.ip_address}</td>
                <td className="py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="py-3 font-mono text-muted-foreground">
                  {d.status === "online" ? `${d.latency}ms` : "—"}
                </td>
                <td className="py-3 font-mono text-muted-foreground">
                  {d.status === "online" ? `${d.bandwidth} Mbps` : "—"}
                </td>
                {clickable && (
                  <td className="py-3 pr-2 text-right">
                    <ArrowRight className="w-4 h-4 text-muted-foreground inline-block" />
                  </td>
                )}
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                  Aucun appareil trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DevicesPage = () => {
  const { data: devices, isLoading } = useDevices();

  const routers = devices?.filter((d) => d.category === "router") ?? [];
  const computers = devices?.filter((d) => d.category === "device") ?? [];
  const webpages = devices?.filter((d) => d.category === "webpage") ?? [];

  const online = devices?.filter((d) => d.status === "online").length ?? 0;
  const total = devices?.length ?? 0;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground animate-pulse">Chargement des appareils...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Monitoring Réseau</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {online} sur {total} appareils en ligne · rafraîchissement toutes les 15s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-online" />
          <span className="text-xs font-mono text-muted-foreground">Live</span>
        </div>
      </div>

      <DeviceTable title="Routeurs" devices={routers} icon={Router} />
      <DeviceTable title="Devices" devices={computers} icon={Monitor} />
      <DeviceTable title="Pages Web & Serveur" devices={webpages} icon={Globe} clickable={false} />
    </div>
  );
};

export default DevicesPage;
