import { Users, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UsersPage = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["all_user_roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role");
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["all_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, created_at");
      if (error) throw error;
      return data;
    },
  });

  const enriched = roles?.map((r) => {
    const profile = profiles?.find((p) => p.user_id === r.user_id);
    return { ...r, display_name: profile?.display_name ?? "Unknown", created_at: profile?.created_at };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Users</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage user accounts and roles</p>
        </div>
        <Users className="w-5 h-5 text-primary" />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse">Loading users...</div>
      ) : (
        <div className="glass-card p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <th className="text-left pb-3">User</th>
                <th className="text-left pb-3">Role</th>
                <th className="text-left pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {enriched?.map((u) => (
                <tr key={u.id} className="border-b border-border/30">
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                      {u.display_name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="text-foreground">{u.display_name}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-primary" />
                      <span className="capitalize text-xs text-muted-foreground">{u.role}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground font-mono">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
