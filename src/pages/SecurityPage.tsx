import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

const SecurityPage = () => {
  const securityItems = [
    { icon: Lock, title: "Authentication", description: "Email/password auth with email verification enabled", status: "Active", color: "text-success" },
    { icon: Shield, title: "Row Level Security", description: "RLS policies enforced on all database tables", status: "Enabled", color: "text-success" },
    { icon: Eye, title: "Role-Based Access", description: "4-tier RBAC: Admin, IT Staff, Manager, Client", status: "Active", color: "text-success" },
    { icon: AlertTriangle, title: "Password Policy", description: "Minimum 6 characters required for all accounts", status: "Basic", color: "text-warning" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Security</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Security overview and access policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityItems.map((item) => (
          <div key={item.title} className="glass-card p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <span className={`text-[10px] font-bold uppercase ${item.color}`}>{item.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityPage;
