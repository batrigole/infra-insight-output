import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { bandwidthData } from "@/lib/mockData";

export const BandwidthChart = () => (
  <div className="glass-card p-5 animate-slide-in">
    <h3 className="text-sm font-semibold text-foreground mb-4">Bandwidth Usage (Mbps)</h3>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={bandwidthData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
        <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,16%)", borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="inbound" fill="hsl(187,80%,48%)" radius={[4, 4, 0, 0]} name="Inbound" />
        <Bar dataKey="outbound" fill="hsl(187,80%,48%,0.4)" radius={[4, 4, 0, 0]} name="Outbound" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
