import { Bell, Lock, Globe, Moon, Shield, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const sections = [
  { t: "Account", items: [
    { i: Lock, l: "Change password", d: "Update your sign-in credentials" },
    { i: Shield, l: "Two-factor auth", d: "Extra security on sign-in", toggle: true },
  ]},
  { t: "Preferences", items: [
    { i: Bell, l: "Email notifications", d: "Weekly digest and alerts", toggle: true },
    { i: Moon, l: "Dark viewer", d: "Always use dark file viewer", toggle: true },
    { i: Globe, l: "Language", d: "English (UK)" },
  ]},
  { t: "Billing", items: [
    { i: CreditCard, l: "Plan", d: "Business · Annual" },
  ]},
];

export default function Settings() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your VisaHOBe workspace.</p>
      </div>
      {sections.map((s) => (
        <div key={s.t}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">{s.t}</div>
          <div className="card-elevated divide-y divide-border">
            {s.items.map((it) => (
              <div key={it.l} className="flex items-center gap-3 p-4">
                <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><it.i className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{it.l}</div>
                  <div className="text-xs text-muted-foreground">{it.d}</div>
                </div>
                {it.toggle && <Switch defaultChecked />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
