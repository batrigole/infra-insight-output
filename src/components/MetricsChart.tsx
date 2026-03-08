import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDevices } from "@/hooks/useDevices";
import { useMemo } from "react";

export const MetricsChart = () => {
  const { data: devices } = useDevices();

  const data = useMemo(() => {
    if (!devices || devices.length === 0) return [];
    return devices
      .filter((d) => d.status === "online")
      .map((d) => ({
        name: d.name,
        cpu: d.cpu_usage,
        memory: d.memory_usage,
        disk: d.disk_usage,
      }));
  }, [devices]);

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Device Resource Usage</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No online devices</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187,80%,48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(187,80%,48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280,65%,60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(280,65%,60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="diskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142,71%,45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210,40%,92%)" }}
            />
            <Area type="monotone" dataKey="cpu" stroke="hsl(187,80%,48%)" fill="url(#cpuGrad)" strokeWidth={2} name="CPU %" />
            <Area type="monotone" dataKey="memory" stroke="hsl(280,65%,60%)" fill="url(#memGrad)" strokeWidth={2} name="Memory %" />
            <Area type="monotone" dataKey="disk" stroke="hsl(142,71%,45%)" fill="url(#diskGrad)" strokeWidth={2} name="Disk %" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
