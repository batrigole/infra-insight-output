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

    const { results } = await req.json() as {
      results: Array<{ id: string; status: "online" | "offline"; latency?: number }>;
    };

    if (!results || !Array.isArray(results)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();
    const updates = [];

    for (const result of results) {
      // First get current device data for uptime calculation
      const { data: device } = await supabase
        .from("monitored_devices")
        .select("created_at, last_seen")
        .eq("id", result.id)
        .single();

      const uptimeHours = result.status === "online" && device
        ? Math.floor((Date.now() - new Date(device.created_at).getTime()) / 3600000)
        : 0;

      const uptimeStr = result.status === "online"
        ? uptimeHours >= 24
          ? `${Math.floor(uptimeHours / 24)}d ${uptimeHours % 24}h`
          : `${uptimeHours}h`
        : "—";

      const { error } = await supabase
        .from("monitored_devices")
        .update({
          status: result.status,
          last_seen: result.status === "online" ? now : device?.last_seen,
          updated_at: now,
          uptime: uptimeStr,
        })
        .eq("id", result.id);

      updates.push({ id: result.id, status: result.status, error: error?.message || null });
    }

    return new Response(JSON.stringify({ updates, timestamp: now }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
