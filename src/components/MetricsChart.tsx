import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generateTimeSeriesData } from "@/lib/mockData";

export const MetricsChart = () => {
  const data = useMemo(() => generateTimeSeriesData(24), []);

  return (
    <div className="glass-card p-5 animate-slide-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">System Metrics — Last 2 Hours</h3>
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
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142,71%,45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
          <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
          <Tooltip
            contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "hsl(210,40%,92%)" }}
          />
          <Area type="monotone" dataKey="cpu" stroke="hsl(187,80%,48%)" fill="url(#cpuGrad)" strokeWidth={2} name="CPU" />
          <Area type="monotone" dataKey="memory" stroke="hsl(280,65%,60%)" fill="url(#memGrad)" strokeWidth={2} name="Memory" />
          <Area type="monotone" dataKey="network" stroke="hsl(142,71%,45%)" fill="url(#netGrad)" strokeWidth={2} name="Network" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
