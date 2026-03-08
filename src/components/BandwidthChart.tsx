import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDevices } from "@/hooks/useDevices";
import { useMemo } from "react";

export const BandwidthChart = () => {
  const { data: devices } = useDevices();

  const chartData = useMemo(() => {
    if (!devices || devices.length === 0) return [];
    return devices.map((d) => ({
      name: d.name,
      cpu: d.cpu_usage,
      memory: d.memory_usage,
      disk: d.disk_usage,
    }));
  }, [devices]);

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Device Performance Comparison</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No devices</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="cpu" fill="hsl(187,80%,48%)" radius={[4, 4, 0, 0]} name="CPU %" />
            <Bar dataKey="memory" fill="hsl(280,65%,60%)" radius={[4, 4, 0, 0]} name="Memory %" />
            <Bar dataKey="disk" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} name="Disk %" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
