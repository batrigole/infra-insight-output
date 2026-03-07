import { Server, Router, Monitor, Shield, Network, Wifi, WifiOff } from "lucide-react";
import { useDevices, MonitoredDevice } from "@/hooks/useDevices";

const typeIcons: Record<string, React.ElementType> = {
  server: Server,
  router: Router,
  computer: Monitor,
  switch: Network,
  firewall: Shield,
};

const usageBar = (value: number, label: string) => {
  const color = value > 80 ? "bg-destructive" : value > 60 ? "bg-warning" : "bg-success";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const DeviceCard = ({ device }: { device: MonitoredDevice }) => {
  const Icon = typeIcons[device.type] || Server;
  const isOnline = device.status === "online";

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOnline ? "bg-success/10" : "bg-destructive/10"}`}>
            <Icon className={`w-5 h-5 ${isOnline ? "text-success" : "text-destructive"}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{device.name}</h3>
            <p className="text-xs font-mono text-muted-foreground">{device.ip_address}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isOnline ? <Wifi className="w-3 h-3 text-success" /> : <WifiOff className="w-3 h-3 text-destructive" />}
          <span className={`text-[10px] font-semibold uppercase ${isOnline ? "text-success" : "text-destructive"}`}>
            {device.status}
          </span>
        </div>
      </div>

      {isOnline ? (
        <div className="space-y-3">
          {usageBar(device.cpu_usage, "CPU")}
          {usageBar(device.memory_usage, "Memory")}
          {device.type !== "router" && usageBar(device.disk_usage, "Disk")}
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-muted-foreground">Device unreachable</div>
      )}

      <div className="mt-4 pt-3 border-t border-border/30 flex justify-between text-[10px] text-muted-foreground">
        <span>Type: <span className="capitalize text-foreground">{device.type}</span></span>
        <span>Uptime: <span className="font-mono text-foreground">{device.uptime}</span></span>
      </div>
      {device.location && (
        <div className="mt-1 text-[10px] text-muted-foreground">
          Location: <span className="text-foreground">{device.location}</span>
        </div>
      )}
    </div>
  );
};

const DevicesPage = () => {
  const { data: devices, isLoading } = useDevices();

  const online = devices?.filter((d) => d.status === "online").length ?? 0;
  const total = devices?.length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Devices</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {online} of {total} devices online
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse">Loading devices...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {devices?.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
          {devices?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
              No devices found. Add devices from Settings.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
