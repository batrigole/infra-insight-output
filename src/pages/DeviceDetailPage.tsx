import { useParams, useNavigate } from "react-router-dom";
import { useDevice } from "@/hooks/useDevices";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Wifi, WifiOff, Activity, Clock, HardDrive, Cpu, MemoryStick } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface LatencyPoint {
  time: string;
  latency: number;
}

const DeviceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: device, isLoading } = useDevice(id!);

  // Real-time latency history (like the PHP project's pingChart)
  const [latencyHistory, setLatencyHistory] = useState<LatencyPoint[]>([]);
  const maxPoints = 30;

  useEffect(() => {
    if (!device) return;
    const now = new Date();
    const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    
    setLatencyHistory((prev) => {
      const next = [...prev, { time: timeLabel, latency: device.latency }];
      if (next.length > maxPoints) next.shift();
      return next;
    });
  }, [device]);

  // Simulated hour/day latency data (like the PHP project)
  const hourData = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      time: `${i}min`,
      latency: Math.floor(Math.random() * 100) + 20,
    }))
  ).current;

  const dayData = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}h`,
      latency: Math.floor(Math.random() * 100) + 20,
    }))
  ).current;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground animate-pulse">Chargement...</div>;
  }

  if (!device) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Appareil non trouvé</p>
        <button onClick={() => navigate("/devices")} className="mt-4 text-primary text-sm hover:underline">
          ← Retour
        </button>
      </div>
    );
  }

  const isOnline = device.status === "online";
  const isRouter = device.category === "router";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/devices")}
          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Détails {isRouter ? "du routeur" : "du device"}: {device.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rafraîchissement chaque seconde
          </p>
        </div>
      </div>

      {/* Info block (like PHP's .info-block) */}
      <div className="glass-card p-6 mb-6 animate-slide-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOnline ? "bg-success/10" : "bg-destructive/10"}`}>
              {isOnline ? <Wifi className="w-5 h-5 text-success" /> : <WifiOff className="w-5 h-5 text-destructive" />}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Statut</p>
              <p className={`text-lg font-bold ${isOnline ? "text-success" : "text-destructive"}`}>
                {isOnline ? "UP" : "DOWN"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Adresse IP</p>
              <p className="text-sm font-mono text-foreground">{device.ip_address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-chart-3/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Latence</p>
              <p className="text-lg font-bold font-mono text-foreground">
                {isOnline ? `${device.latency}ms` : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-chart-4/10">
              <HardDrive className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Bande passante</p>
              <p className="text-lg font-bold font-mono text-foreground">
                {isOnline ? `${device.bandwidth} Mbps` : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Saturation réseau</p>
            <p className={`text-sm font-bold ${device.saturation ? "text-destructive" : "text-success"}`}>
              {device.saturation ? "Oui" : "Non"}
            </p>
          </div>
          {device.category === "device" && (
            <>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">CPU</p>
                <p className="text-sm font-mono text-foreground">{device.cpu_usage}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Mémoire</p>
                <p className="text-sm font-mono text-foreground">{device.memory_usage}%</p>
              </div>
            </>
          )}
          {device.location && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Emplacement</p>
              <p className="text-sm text-foreground">{device.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Real-time latency chart (like PHP's pingChart) */}
      <div className="glass-card p-5 mb-6 animate-slide-in">
        <h3 className="text-sm font-semibold text-foreground mb-4">Latence en temps réel</h3>
        {latencyHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">En attente de données...</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={latencyHistory}>
              <defs>
                <linearGradient id="latencyRtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(222, 47%, 30%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(222, 47%, 30%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} unit="ms" />
              <Tooltip
                contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "hsl(210,40%,92%)" }}
              />
              <Area type="monotone" dataKey="latency" stroke="hsl(215,60%,55%)" fill="url(#latencyRtGrad)" strokeWidth={2} name="Latence (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Hour latency chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 animate-slide-in">
          <h3 className="text-sm font-semibold text-foreground mb-4">Latence sur 1 heure</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 9 }} tickLine={false} axisLine={false} interval={9} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} unit="ms" />
              <Tooltip
                contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="latency" stroke="hsl(172,66%,50%)" strokeWidth={2} dot={false} name="Latence (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Day latency chart */}
        <div className="glass-card p-5 animate-slide-in">
          <h3 className="text-sm font-semibold text-foreground mb-4">Latence sur 1 jour</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} unit="ms" />
              <Tooltip
                contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="latency" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} name="Latence (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailPage;
