
CREATE TABLE public.monitored_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'server',
  ip_address text NOT NULL,
  mac_address text,
  location text,
  status text NOT NULL DEFAULT 'offline',
  cpu_usage numeric DEFAULT 0,
  memory_usage numeric DEFAULT 0,
  disk_usage numeric DEFAULT 0,
  uptime text DEFAULT '—',
  last_seen timestamp with time zone DEFAULT now(),
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.monitored_devices ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view devices
CREATE POLICY "Authenticated users can view devices"
ON public.monitored_devices FOR SELECT TO authenticated
USING (true);

-- Only admins can insert devices
CREATE POLICY "Admins can insert devices"
ON public.monitored_devices FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update devices
CREATE POLICY "Admins can update devices"
ON public.monitored_devices FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete devices
CREATE POLICY "Admins can delete devices"
ON public.monitored_devices FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_monitored_devices_updated_at
  BEFORE UPDATE ON public.monitored_devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
