#!/usr/bin/env node
/**
 * Local Network Monitoring Agent
 * 
 * Pings devices on the local network and reports their status
 * to the Supabase edge function every 15 seconds.
 * 
 * Usage:
 *   1. cd agent
 *   2. npm install ping systeminformation
 *   3. node monitor.js
 * 
 * Requires: Node.js 18+
 */

const ping = require("ping");
const si = require("systeminformation");

const SUPABASE_URL = "https://xbkzzuqhossperrqnamn.supabase.co";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/report-device-status`;
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3p6dXFob3NzcGVycnFuYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDE3OTUsImV4cCI6MjA4NjkxNzc5NX0.F1xdJcLi6cEzdQv13lK1xlfNYCbxPE2plmF98nDaHVc";

const DEVICES = [
  { ip_address: "192.168.1.117", name: "HP ProBook" },
  { ip_address: "192.168.1.1", name: "MTN Home Box" },
];

const INTERVAL_MS = 15000;

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

async function getLocalStats() {
  try {
    const [cpu, mem, disk, osInfo] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.time(),
    ]);
    return {
      cpu_usage: Math.round(cpu.currentLoad),
      memory_usage: Math.round((mem.used / mem.total) * 100),
      disk_usage: Math.round(disk[0]?.use || 0),
      uptime: formatUptime(osInfo.uptime),
    };
  } catch {
    return {};
  }
}

async function checkDevices() {
  const results = [];

  for (const device of DEVICES) {
    try {
      const res = await ping.promise.probe(device.ip_address, { timeout: 5 });
      const entry = {
        ip_address: device.ip_address,
        status: res.alive ? "online" : "offline",
      };

      // If this is the local machine, get real system stats
      if (device.ip_address === "192.168.1.117" && res.alive) {
        const stats = await getLocalStats();
        Object.assign(entry, stats);
      }

      results.push(entry);
      console.log(
        `  ${res.alive ? "✅" : "❌"} ${device.name} (${device.ip_address}): ${entry.status}`
      );
    } catch (err) {
      results.push({ ip_address: device.ip_address, status: "offline" });
      console.log(`  ❌ ${device.name} (${device.ip_address}): error - ${err.message}`);
    }
  }

  return results;
}

async function report(devices) {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ devices }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("  ⚠️  Report failed:", data);
    } else {
      console.log("  📡 Reported to cloud successfully");
    }
  } catch (err) {
    console.error("  ⚠️  Network error:", err.message);
  }
}

async function tick() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n[${timestamp}] Scanning devices...`);
  const devices = await checkDevices();
  await report(devices);
}

console.log("🔍 InfraInsight Local Agent started");
console.log(`   Monitoring ${DEVICES.length} devices every ${INTERVAL_MS / 1000}s`);
console.log(`   Reporting to: ${FUNCTION_URL}\n`);

tick();
setInterval(tick, INTERVAL_MS);
