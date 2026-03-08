import { Settings, Plus, Trash2, Monitor, Router, Server, Shield, Network, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDevices, useAddDevice, useDeleteDevice } from "@/hooks/useDevices";
import { useState } from "react";

const deviceTypes = [
  { value: "computer", label: "Ordinateur", icon: Monitor },
  { value: "router", label: "Routeur", icon: Router },
  { value: "server", label: "Serveur", icon: Server },
  { value: "switch", label: "Switch", icon: Network },
  { value: "firewall", label: "Pare-feu", icon: Shield },
  { value: "webpage", label: "Page Web", icon: Globe },
];

const categoryMap: Record<string, string> = {
  computer: "device",
  router: "router",
  server: "device",
  switch: "device",
  firewall: "device",
  webpage: "webpage",
};

const SettingsPage = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { data: devices } = useDevices();
  const addDevice = useAddDevice();
  const deleteDevice = useDeleteDevice();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "computer",
    ip_address: "",
    mac_address: "",
    location: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDevice.mutate(
      {
        name: form.name,
        type: form.type,
        ip_address: form.ip_address,
        mac_address: form.mac_address || undefined,
        location: form.location || undefined,
        notes: form.notes || undefined,
        category: categoryMap[form.type] || "device",
      },
      {
        onSuccess: () => {
          setForm({ name: "", type: "computer", ip_address: "", mac_address: "", location: "", notes: "" });
          setShowForm(false);
        },
      }
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Configuration système et gestion des appareils</p>
      </div>

      {/* Admin-only: Add Device */}
      {isAdmin && (
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Gestion des appareils surveillés</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Ajouter un appareil
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-4 rounded-lg bg-secondary/30 border border-border/30">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Nom *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ex: Bureau PC"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {deviceTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Adresse IP *</label>
                <input
                  required
                  value={form.ip_address}
                  onChange={(e) => setForm({ ...form, ip_address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ex: 192.168.1.100"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Adresse MAC</label>
                <input
                  value={form.mac_address}
                  onChange={(e) => setForm({ ...form, mac_address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ex: AA:BB:CC:DD:EE:FF"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Emplacement</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ex: Bureau, Salle serveur"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Notes</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Notes optionnelles"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addDevice.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {addDevice.isPending ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            </form>
          )}

          {/* Device list with delete */}
          <div className="space-y-2">
            {devices?.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-3">
                  <span className={`status-dot ${d.status === "online" ? "status-online" : "status-offline"}`} />
                  <span className="text-sm text-foreground">{d.name}</span>
                  <span className="text-xs font-mono text-muted-foreground">{d.ip_address}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{d.category}</span>
                </div>
                <button
                  onClick={() => deleteDevice.mutate(d.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Supprimer l'appareil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General settings */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Général</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Application</span>
            <span className="text-foreground font-mono">Infra-Insight v2.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Thème</span>
            <span className="text-foreground">Sombre (par défaut)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Intervalle de monitoring</span>
            <span className="text-foreground font-mono">15 secondes</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Rétention des données</span>
            <span className="text-foreground font-mono">30 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
