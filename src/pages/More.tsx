import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/store";
import { LayoutDashboard, Users, FolderLock, ClipboardCheck, BarChart3, ShieldCheck, Settings, UsersRound, LogOut, ChevronRight, Upload, UserPlus, HelpCircle, Mail } from "lucide-react";
import { toast } from "sonner";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/files", icon: FolderLock, label: "File Vault" },
  { to: "/applications", icon: ClipboardCheck, label: "Applications" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/verify", icon: ShieldCheck, label: "Verification" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/team", icon: UsersRound, label: "Team" },
];

export default function More() {
  const { logout, clients, files } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">More</h1>

      <div className="card-elevated p-5 gradient-primary text-primary-foreground">
        <div className="text-xs uppercase tracking-wider opacity-80">Workspace</div>
        <div className="text-lg font-semibold mt-1">VisaHOBe PTE. LTD.</div>
        <div className="text-xs opacity-80 mt-0.5">Business · Annual plan</div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div><div className="text-xl font-bold">{clients.length}</div><div className="text-[10px] opacity-80 uppercase tracking-wider">Clients</div></div>
          <div><div className="text-xl font-bold">{files.length}</div><div className="text-[10px] opacity-80 uppercase tracking-wider">Files</div></div>
          <div><div className="text-xl font-bold">98%</div><div className="text-[10px] opacity-80 uppercase tracking-wider">Uptime</div></div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Quick actions</div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/files?upload=1")} className="card-soft p-4 text-left hover:shadow-card transition">
            <div className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center mb-2"><Upload className="h-4 w-4" /></div>
            <div className="font-medium text-sm">Upload file</div>
            <div className="text-xs text-muted-foreground mt-0.5">Add to vault</div>
          </button>
          <button onClick={() => navigate("/clients")} className="card-soft p-4 text-left hover:shadow-card transition">
            <div className="h-10 w-10 rounded-xl gradient-red text-primary-foreground flex items-center justify-center mb-2"><UserPlus className="h-4 w-4" /></div>
            <div className="font-medium text-sm">New client</div>
            <div className="text-xs text-muted-foreground mt-0.5">Onboard quickly</div>
          </button>
          <button onClick={() => { navigator.clipboard.writeText("https://vault.visahobe.com/invite/team"); toast.success("Invite link copied"); }} className="card-soft p-4 text-left hover:shadow-card transition">
            <div className="h-10 w-10 rounded-xl bg-success text-primary-foreground flex items-center justify-center mb-2"><Mail className="h-4 w-4" /></div>
            <div className="font-medium text-sm">Invite teammate</div>
            <div className="text-xs text-muted-foreground mt-0.5">Copy share link</div>
          </button>
          <button onClick={() => toast("Help center coming soon")} className="card-soft p-4 text-left hover:shadow-card transition">
            <div className="h-10 w-10 rounded-xl bg-warning text-primary-foreground flex items-center justify-center mb-2"><HelpCircle className="h-4 w-4" /></div>
            <div className="font-medium text-sm">Help & support</div>
            <div className="text-xs text-muted-foreground mt-0.5">Get assistance</div>
          </button>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Navigate</div>
        <div className="card-elevated divide-y divide-border">
          {items.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="flex items-center gap-3 p-4 hover:bg-secondary transition">
              <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
              <span className="flex-1 font-medium text-sm">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
          <button onClick={() => { logout(); toast("Signed out"); navigate("/"); }} className="flex items-center gap-3 p-4 hover:bg-secondary transition w-full text-left">
            <div className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center"><LogOut className="h-4 w-4" /></div>
            <span className="flex-1 font-medium text-sm text-destructive">Log out</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">VisaHOBe PTE. LTD. · Version 1.0.0</div>
    </div>
  );
}
