# InfraInsight Local Monitoring Agent

This agent runs on your local machine and sends **real ICMP pings** to your network devices, then reports their online/offline status to the InfraInsight database.

## Requirements

- **Node.js** 18 or later
- Your computer must be on the **same network** as the monitored devices

## Setup

```bash
cd local-agent
npm install
```

## Usage

```bash
npm start
```

You'll see output like:

```
╔══════════════════════════════════════════╗
║   InfraInsight Local Monitoring Agent    ║
╚══════════════════════════════════════════╝

[12:30:00] 🔍 Starting scan...
  Found 3 device(s). Pinging...
  🟢 HP ProBook            192.168.1.117    online   2.5ms
  🟢 MTN Home Box          192.168.1.1      online   1.2ms
  🔴 Samsung galaxy s10    192.168.1.109    offline  —
  ✅ Reported to database (3 updated)
```

## Notes

- Scans run every **10 seconds**
- On **Linux/Mac**, you may need `sudo` for ICMP pings (or set capabilities)
- On **Windows**, pings work without elevated permissions
- The agent uses the Supabase anon key (safe for local use)
- Keep this running while you want real-time device monitoring
