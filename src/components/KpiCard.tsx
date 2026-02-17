import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  variant?: "default" | "success" | "warning" | "destructive";
}

const variantStyles = {
  default: "border-border/50 text-primary",
  success: "border-success/30 text-success",
  warning: "border-warning/30 text-warning",
  destructive: "border-destructive/30 text-destructive",
};

const iconBg = {
  default: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  destructive: "bg-destructive/10",
};

export const KpiCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: KpiCardProps) => (
  <div className={`glass-card p-5 ${variantStyles[variant]} animate-slide-in`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold font-mono">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2.5 rounded-lg ${iconBg[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);
