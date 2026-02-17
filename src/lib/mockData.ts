export const kpiData = {
  devicesOnline: 142,
  devicesOffline: 3,
  networkHealth: 97.8,
  activeAlerts: 7,
  avgResponseTime: 12,
};

export const generateTimeSeriesData = (points = 24) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now - (points - i) * 300000);
    return {
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.round(35 + Math.random() * 40 + Math.sin(i / 3) * 15),
      memory: Math.round(55 + Math.random() * 20 + Math.cos(i / 4) * 10),
      network: Math.round(20 + Math.random() * 60 + Math.sin(i / 2) * 20),
      disk: Math.round(62 + Math.random() * 8),
    };
  });
};

export const devices = [
  { id: "srv-001", name: "web-prod-01", type: "server", ip: "10.0.1.10", status: "online", cpu: 45, memory: 72, uptime: "45d 12h" },
  { id: "srv-002", name: "web-prod-02", type: "server", ip: "10.0.1.11", status: "online", cpu: 38, memory: 65, uptime: "45d 12h" },
  { id: "srv-003", name: "db-primary", type: "server", ip: "10.0.2.10", status: "online", cpu: 67, memory: 84, uptime: "120d 3h" },
  { id: "srv-004", name: "db-replica", type: "server", ip: "10.0.2.11", status: "warning", cpu: 82, memory: 91, uptime: "120d 3h" },
  { id: "rtr-001", name: "core-router-01", type: "router", ip: "10.0.0.1", status: "online", cpu: 12, memory: 34, uptime: "230d 8h" },
  { id: "sw-001", name: "dist-switch-01", type: "switch", ip: "10.0.0.10", status: "online", cpu: 8, memory: 22, uptime: "180d 1h" },
  { id: "sw-002", name: "access-switch-03", type: "switch", ip: "10.0.0.13", status: "offline", cpu: 0, memory: 0, uptime: "—" },
  { id: "fw-001", name: "edge-firewall", type: "firewall", ip: "10.0.0.254", status: "online", cpu: 23, memory: 45, uptime: "90d 6h" },
];

export const alerts = [
  { id: 1, severity: "critical", message: "db-replica CPU > 85% for 5 minutes", device: "srv-004", time: "2 min ago" },
  { id: 2, severity: "critical", message: "access-switch-03 unreachable", device: "sw-002", time: "8 min ago" },
  { id: 3, severity: "warning", message: "db-replica memory usage at 91%", device: "srv-004", time: "12 min ago" },
  { id: 4, severity: "warning", message: "Disk usage at 88% on web-prod-01", device: "srv-001", time: "25 min ago" },
  { id: 5, severity: "info", message: "Backup completed on db-primary", device: "srv-003", time: "1h ago" },
  { id: 6, severity: "warning", message: "High bandwidth on core-router-01 Gi0/1", device: "rtr-001", time: "1h ago" },
  { id: 7, severity: "info", message: "Certificate renewal in 14 days", device: "fw-001", time: "3h ago" },
];

export const bandwidthData = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(i * 2).padStart(2, "0")}:00`,
  inbound: Math.round(200 + Math.random() * 600 + Math.sin(i) * 200),
  outbound: Math.round(150 + Math.random() * 400 + Math.cos(i) * 150),
}));
