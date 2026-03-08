import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all devices
    const { data: devices, error: fetchError } = await supabase
      .from("monitored_devices")
      .select("*");

    if (fetchError) throw fetchError;
    if (!devices || devices.length === 0) {
      return new Response(JSON.stringify({ message: "No devices to monitor" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (const device of devices) {
      let isOnline = false;

      // Try HTTP(S) connection to check reachability
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        // Try common ports: 80 (HTTP), 443 (HTTPS), 8080
        const ports = [80, 443, 8080];
        for (const port of ports) {
          try {
            const protocol = port === 443 ? "https" : "http";
            const resp = await fetch(`${protocol}://${device.ip_address}:${port}`, {
              method: "HEAD",
              signal: controller.signal,
              // @ts-ignore - Deno supports this
              redirect: "manual",
            });
            // Any response (even error pages) means the device is reachable
            isOnline = true;
            await resp.text(); // consume body
            break;
          } catch {
            // This port didn't work, try next
          }
        }

        clearTimeout(timeout);
      } catch {
        isOnline = false;
      }

      // Also try a raw TCP connection as fallback
      if (!isOnline) {
        try {
          const conn = await Deno.connect({
            hostname: device.ip_address,
            port: 80,
            transport: "tcp",
          });
          isOnline = true;
          conn.close();
        } catch {
          // not reachable
        }
      }

      const now = new Date().toISOString();
      const uptimeHours = isOnline
        ? Math.floor(
            (Date.now() - new Date(device.created_at).getTime()) / 3600000
          )
        : 0;

      const updateData: Record<string, unknown> = {
        status: isOnline ? "online" : "offline",
        last_seen: isOnline ? now : device.last_seen,
        updated_at: now,
        uptime: isOnline ? `${uptimeHours}h` : "—",
      };

      const { error: updateError } = await supabase
        .from("monitored_devices")
        .update(updateData)
        .eq("id", device.id);

      results.push({
        id: device.id,
        name: device.name,
        ip: device.ip_address,
        status: isOnline ? "online" : "offline",
        error: updateError?.message || null,
      });
    }

    return new Response(JSON.stringify({ results, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
