import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MonitoredDevice } from "./useDevices";

/**
 * Attempts to "ping" a device from the browser by loading a tiny resource.
 * Uses multiple techniques: fetch + image load as fallback.
 * Returns true if the device responded within the timeout.
 */
const probeDevice = (ip: string, timeoutMs = 3000): Promise<boolean> => {
  return new Promise((resolve) => {
    let settled = false;
    const done = (result: boolean) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    // Timeout fallback
    const timer = setTimeout(() => done(false), timeoutMs);

    // Technique 1: fetch with abort
    const controller = new AbortController();
    const protocols = ["http"];
    const ports = [80, 443, 8080];

    const fetchAttempts = protocols.flatMap((proto) =>
      ports.map((port) =>
        fetch(`${proto}://${ip}:${port}`, {
          method: "HEAD",
          mode: "no-cors",
          signal: controller.signal,
          cache: "no-store",
        })
          .then(() => {
            // In no-cors mode, any response (opaque) means reachable
            done(true);
            controller.abort();
          })
          .catch(() => {
            // This attempt failed, others may succeed
          })
      )
    );

    // Technique 2: Image probe (many devices serve something on port 80)
    const img = new Image();
    img.onload = () => {
      done(true);
      clearTimeout(timer);
    };
    img.onerror = () => {
      // onerror fires for CORS blocks too — but if it fires fast, device is likely up
      // We'll rely on fetch for accuracy; image is just a backup
    };
    img.src = `http://${ip}/favicon.ico?_t=${Date.now()}`;

    // After all fetch attempts complete, if none succeeded, wait for timeout
    Promise.allSettled(fetchAttempts).then(() => {
      // If still not settled, the timeout will handle it
    });
  });
};

/**
 * Runs local network probes from the browser and reports results
 * to the backend edge function for database updates.
 */
export const useLocalMonitor = (devices: MonitoredDevice[] | undefined) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = useRef(false);

  useEffect(() => {
    if (!devices || devices.length === 0) return;

    const runScan = async () => {
      if (isRunning.current) return;
      isRunning.current = true;

      try {
        const results = await Promise.all(
          devices.map(async (device) => {
            const reachable = await probeDevice(device.ip_address, 4000);
            return {
              id: device.id,
              status: reachable ? ("online" as const) : ("offline" as const),
            };
          })
        );

        // Report to backend
        await supabase.functions.invoke("report-device-status", {
          body: { results },
        });

        console.log("[LocalMonitor] Scan complete:", results.map(r => `${r.id.slice(0, 8)}=${r.status}`).join(", "));
      } catch (e) {
        console.error("[LocalMonitor] Scan failed:", e);
      } finally {
        isRunning.current = false;
      }
    };

    // Run immediately, then every 10 seconds
    runScan();
    intervalRef.current = setInterval(runScan, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [devices?.map(d => d.id).join(",")]);
};
