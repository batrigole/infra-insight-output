/**
 * InfraInsight Local Monitoring Agent
 * 
 * This script runs on your local machine and sends ICMP pings
 * to all monitored devices, then reports their status to the database.
 * 
 * Setup:
 *   npm install ping node-fetch
 * 
 * Usage:
 *   node local-agent/monitor.mjs
 * 
 * It will ping all devices every 10 seconds and update their status.
 */

import ping from "ping";
import fetch from "node-fetch";

// ─── Configuration ───────────────────────────────────────────────
const SUPABASE_URL = "https://xbkzzuqhossperrqnamn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3p6dXFob3NzcGVycnFuYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDE3OTUsImV4cCI6MjA4NjkxNzc5NX0.F1xdJcLi6cEzdQv13lK1xlfNYCbxPE2plmF98nDaHVc";
const SCAN_INTERVAL_MS = 10_000; // 10 seconds
// ─────────────────────────────────────────────────────────────────

async function fetchDevices() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/monitored_devices?select=id,name,ip_address`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch devices: ${res.statusText}`);
  return res.json();
}

async function pingDevice(ip) {
  try {
    const result = await ping.promise.probe(ip, {
      timeout: 3,
      extra: ["-c", "1"], // Send 1 ping (Linux/Mac). On Windows, use ["-n", "1"]
    });
    return {
      alive: result.alive,
      latency: result.time === "unknown" ? null : parseFloat(result.time),
    };
  } catch {
    return { alive: false, latency: null };
  }
}

async function reportResults(results) {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/report-device-status`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ results }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Report failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function runScan() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n[${timestamp}] 🔍 Starting scan...`);

  try {
    const devices = await fetchDevices();
    if (!devices || devices.length === 0) {
      console.log("  No devices found in database.");
      return;
    }

    console.log(`  Found ${devices.length} device(s). Pinging...`);

    const results = [];
    for (const device of devices) {
      const { alive, latency } = await pingDevice(device.ip_address);
      const status = alive ? "online" : "offline";
      const latencyStr = latency !== null ? `${latency}ms` : "—";
      
      console.log(
        `  ${alive ? "🟢" : "🔴"} ${device.name.padEnd(20)} ${device.ip_address.padEnd(16)} ${status.padEnd(8)} ${latencyStr}`
      );

      results.push({
        id: device.id,
        status,
        latency: latency ?? undefined,
      });
    }

    const report = await reportResults(results);
    console.log(`  ✅ Reported to database (${report.updates?.length ?? 0} updated)`);
  } catch (err) {
    console.error(`  ❌ Scan error: ${err.message}`);
  }
}

// ─── Main Loop ───────────────────────────────────────────────────
console.log("╔══════════════════════════════════════════╗");
console.log("║   InfraInsight Local Monitoring Agent    ║");
console.log("╠══════════════════════════════════════════╣");
console.log(`║ Scan interval: ${SCAN_INTERVAL_MS / 1000}s                       ║`);
console.log(`║ Target: ${SUPABASE_URL.slice(8, 40)}...  ║`);
console.log("╚══════════════════════════════════════════╝");
console.log("\nPress Ctrl+C to stop.\n");

// Initial scan
runScan();

// Repeat every SCAN_INTERVAL_MS
setInterval(runScan, SCAN_INTERVAL_MS);
