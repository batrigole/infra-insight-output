import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export interface MonitoredDevice {
  id: string;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string | null;
  location: string | null;
  status: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: string;
  last_seen: string;
  added_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const triggerMonitoringScan = async () => {
  try {
    await supabase.functions.invoke("monitor-devices");
  } catch (e) {
    console.error("Monitoring scan failed:", e);
  }
};

export const useDevices = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Trigger the edge function every 10 seconds
  useEffect(() => {
    triggerMonitoringScan();
    intervalRef.current = setInterval(triggerMonitoringScan, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return useQuery({
    queryKey: ["monitored_devices"],
    refetchInterval: 10000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monitored_devices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MonitoredDevice[];
    },
  });
};

export const useAddDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (device: {
      name: string;
      type: string;
      ip_address: string;
      mac_address?: string;
      location?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("monitored_devices")
        .insert(device)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitored_devices"] });
      toast.success("Device added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add device: " + error.message);
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("monitored_devices")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitored_devices"] });
      toast.success("Device removed");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete device: " + error.message);
    },
  });
};
