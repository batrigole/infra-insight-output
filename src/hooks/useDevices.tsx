import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  category: string;
  bandwidth: number;
  latency: number;
  saturation: boolean;
}

export const useDevices = () => {
  return useQuery({
    queryKey: ["monitored_devices"],
    refetchInterval: 15000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monitored_devices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as MonitoredDevice[]).map(d => ({
        ...d,
        cpu_usage: d.cpu_usage ?? 0,
        memory_usage: d.memory_usage ?? 0,
        disk_usage: d.disk_usage ?? 0,
        uptime: d.uptime ?? "—",
        bandwidth: d.bandwidth ?? 0,
        latency: d.latency ?? 0,
        saturation: d.saturation ?? false,
      }));
    },
  });
};

export const useDevice = (id: string) => {
  return useQuery({
    queryKey: ["monitored_device", id],
    refetchInterval: 1000, // 1 second like the PHP project
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monitored_devices")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      const d = data as unknown as MonitoredDevice;
      return {
        ...d,
        cpu_usage: d.cpu_usage ?? 0,
        memory_usage: d.memory_usage ?? 0,
        disk_usage: d.disk_usage ?? 0,
        uptime: d.uptime ?? "—",
        bandwidth: d.bandwidth ?? 0,
        latency: d.latency ?? 0,
        saturation: d.saturation ?? false,
      };
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
      category?: string;
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
