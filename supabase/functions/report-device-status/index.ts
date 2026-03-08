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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { devices } = await req.json();

    if (!Array.isArray(devices)) {
      return new Response(JSON.stringify({ error: "devices must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (const device of devices) {
      const { ip_address, status, cpu_usage, memory_usage, disk_usage, uptime, bandwidth, latency, saturation } = device;

      if (!ip_address) continue;

      const updateData: Record<string, unknown> = {
        status: status || "offline",
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (cpu_usage !== undefined) updateData.cpu_usage = cpu_usage;
      if (memory_usage !== undefined) updateData.memory_usage = memory_usage;
      if (disk_usage !== undefined) updateData.disk_usage = disk_usage;
      if (uptime !== undefined) updateData.uptime = uptime;
      if (bandwidth !== undefined) updateData.bandwidth = bandwidth;
      if (latency !== undefined) updateData.latency = latency;
      if (saturation !== undefined) updateData.saturation = saturation;

      const { error } = await supabase
        .from("monitored_devices")
        .update(updateData)
        .eq("ip_address", ip_address);

      results.push({ ip_address, success: !error, error: error?.message });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
