import { Bell, Lock, Globe, Moon, Shield, CreditCard, Save, Trash2, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [profile, setProfile] = useState({ name: "Operations Lead", email: "ops@visahobe.com" });
  const [prefs, setPrefs] = useState({ twoFA: true, notifications: true, darkViewer: true, weekly: false });

  const save = () => toast.success("Settings saved", { description: "Your preferences are up to date" });
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ profile, prefs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "visahobe-settings.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Settings exported");
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your VisaHOBe workspace.</p>
        </div>
        <Button onClick={save} className="rounded-xl gradient-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" /> Save changes</Button>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Profile</div>
        <div className="card-elevated p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Display name</label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1.5 h-11 rounded-xl" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Account</div>
        <div className="card-elevated divide-y divide-border">
          <button onClick={() => toast("Password reset email sent")} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Lock className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Change password</div><div className="text-xs text-muted-foreground">Update your sign-in credentials</div></div>
          </button>
          <div className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Shield className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Two-factor auth</div><div className="text-xs text-muted-foreground">Extra security on sign-in</div></div>
            <Switch checked={prefs.twoFA} onCheckedChange={(v) => { setPrefs({ ...prefs, twoFA: v }); toast(v ? "2FA enabled" : "2FA disabled"); }} />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Preferences</div>
        <div className="card-elevated divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Bell className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Email notifications</div><div className="text-xs text-muted-foreground">Activity and approvals</div></div>
            <Switch checked={prefs.notifications} onCheckedChange={(v) => { setPrefs({ ...prefs, notifications: v }); toast(v ? "Notifications on" : "Notifications off"); }} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Moon className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Dark viewer</div><div className="text-xs text-muted-foreground">Always use dark file viewer</div></div>
            <Switch checked={prefs.darkViewer} onCheckedChange={(v) => { setPrefs({ ...prefs, darkViewer: v }); toast(v ? "Dark viewer on" : "Dark viewer off"); }} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Bell className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Weekly digest</div><div className="text-xs text-muted-foreground">Summary every Monday</div></div>
            <Switch checked={prefs.weekly} onCheckedChange={(v) => { setPrefs({ ...prefs, weekly: v }); toast(v ? "Digest enabled" : "Digest disabled"); }} />
          </div>
          <button onClick={() => toast("Language picker opened")} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Globe className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Language</div><div className="text-xs text-muted-foreground">English (UK)</div></div>
          </button>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Billing</div>
        <div className="card-elevated p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center"><CreditCard className="h-4 w-4" /></div>
          <div className="flex-1">
            <div className="font-medium text-sm">Business · Annual</div>
            <div className="text-xs text-muted-foreground">Renews 12 Jan 2027 · €4,800/year</div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => toast("Manage billing opened")}>Manage</Button>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Data</div>
        <div className="card-elevated divide-y divide-border">
          <button onClick={exportData} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Download className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm">Export workspace settings</div><div className="text-xs text-muted-foreground">Download a JSON copy</div></div>
          </button>
          <button onClick={() => toast.error("Action requires admin confirmation")} className="w-full flex items-center gap-3 p-4 text-left hover:bg-destructive/5 transition">
            <div className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center"><Trash2 className="h-4 w-4" /></div>
            <div className="flex-1"><div className="font-medium text-sm text-destructive">Delete workspace</div><div className="text-xs text-muted-foreground">Permanently remove all data</div></div>
          </button>
        </div>
      </div>
    </div>
  );
}
