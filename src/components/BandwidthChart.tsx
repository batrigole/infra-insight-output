import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDevices } from "@/hooks/useDevices";
import { useMemo } from "react";

export const BandwidthChart = () => {
  const { data: devices } = useDevices();

  const chartData = useMemo(() => {
    if (!devices || devices.length === 0) return [];
    return devices
      .filter((d) => d.status === "online")
      .map((d) => ({
        name: d.name,
        bandwidth: d.bandwidth,
        latency: d.latency,
      }));
  }, [devices]);

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Bande passante & Latence par appareil</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Aucun appareil en ligne</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="bandwidth" fill="hsl(187,80%,48%)" radius={[4, 4, 0, 0]} name="Bande passante (Mbps)" />
            <Bar dataKey="latency" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} name="Latence (ms)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
