import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/store";
import { LayoutDashboard, Users, FolderLock, ClipboardCheck, BarChart3, ShieldCheck, Settings, UsersRound, LogOut, ChevronRight } from "lucide-react";

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
  const { logout } = useApp();
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">More</h1>
      <div className="card-elevated divide-y divide-border">
        {items.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center gap-3 p-4 hover:bg-secondary transition">
            <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
            <span className="flex-1 font-medium text-sm">{label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
        <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-3 p-4 hover:bg-secondary transition w-full text-left">
          <div className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center"><LogOut className="h-4 w-4" /></div>
          <span className="flex-1 font-medium text-sm text-destructive">Log out</span>
        </button>
      </div>
      <div className="text-center text-xs text-muted-foreground">VisaHOBe PTE. LTD. · Version 1.0.0</div>
    </div>
  );
}
