import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DeviceReport {
  ip_address: string;
  is_online: boolean;
  latency_ms?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const reports: DeviceReport[] = body.devices;

    if (!reports || !Array.isArray(reports)) {
      return new Response(JSON.stringify({ error: "Invalid payload. Expected { devices: [...] }" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];
    const now = new Date().toISOString();

    for (const report of reports) {
      // Find the device by IP
      const { data: device, error: findError } = await supabase
        .from("monitored_devices")
        .select("id, name, created_at, last_seen")
        .eq("ip_address", report.ip_address)
        .single();

      if (findError || !device) {
        results.push({ ip: report.ip_address, status: "not_found", error: findError?.message });
        continue;
      }

      const uptimeHours = report.is_online
        ? Math.floor((Date.now() - new Date(device.created_at).getTime()) / 3600000)
        : 0;

      const updateData: Record<string, unknown> = {
        status: report.is_online ? "online" : "offline",
        last_seen: report.is_online ? now : device.last_seen,
        updated_at: now,
        uptime: report.is_online ? `${uptimeHours}h` : "—",
      };

      const { error: updateError } = await supabase
        .from("monitored_devices")
        .update(updateData)
        .eq("id", device.id);

      results.push({
        ip: report.ip_address,
        name: device.name,
        status: report.is_online ? "online" : "offline",
        latency_ms: report.latency_ms,
        error: updateError?.message || null,
      });
    }

    return new Response(JSON.stringify({ results, timestamp: now }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
