
-- Add new columns for bandwidth, latency, saturation, and category
ALTER TABLE public.monitored_devices 
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'device',
  ADD COLUMN IF NOT EXISTS bandwidth numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS latency numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS saturation boolean DEFAULT false;
