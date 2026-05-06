import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FolderLock, ClipboardCheck, ShieldCheck, BarChart3, Settings, UsersRound, LogOut, Search, Bell, Plus, Upload, UserPlus, ScanLine, MoreHorizontal, FileText } from "lucide-react";
import { ReactNode, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/files", icon: FolderLock, label: "File Vault" },
  { to: "/applications", icon: ClipboardCheck, label: "Applications" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/verify", icon: ShieldCheck, label: "Verification" },
  { to: "/team", icon: UsersRound, label: "Team" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-12 w-12 text-lg" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("rounded-xl gradient-primary text-primary-foreground font-bold flex items-center justify-center shadow-glow", sz)}>VH</div>
      <div className="leading-tight">
        <div className="font-semibold text-foreground">VisaHOBe</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Secure Vault</div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-xl p-5 sticky top-0 h-screen">
      <div className="mb-8"><BrandMark /></div>
      <nav className="flex-1 space-y-1">
        {navItems.map((it) => (
          <NavLink key={it.to} to={it.to} className={({ isActive }) =>
            cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground")
          }>
            <it.icon className="h-4 w-4" />
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div className="text-[10px] text-muted-foreground px-3">v1.0.0 · VisaHOBe PTE. LTD.</div>
    </aside>
  );
}

function Topbar() {
  const navigate = useNavigate();
  const { logout } = useApp();
  return (
    <header className="hidden lg:flex items-center justify-between gap-4 px-8 py-4 border-b border-border bg-card/40 backdrop-blur-xl sticky top-0 z-30 no-print">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Search clients, files, references..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm border border-transparent focus:border-primary/30 focus:outline-none transition" />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl"><Bell className="h-5 w-5" /></Button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="h-9 w-9 rounded-full gradient-red text-white flex items-center justify-center font-semibold text-sm">VH</div>
          <div className="text-sm leading-tight">
            <div className="font-semibold">Admin</div>
            <div className="text-xs text-muted-foreground">VisaHOBe Team</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}><LogOut className="h-4 w-4" /></Button>
      </div>
    </header>
  );
}

function MobileTopbar() {
  return (
    <header className="lg:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border no-print">
      <BrandMark size="sm" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl"><Search className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" className="rounded-xl"><Bell className="h-5 w-5" /></Button>
      </div>
    </header>
  );
}

function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const item = (to: string, Icon: any, label: string) => (
    <NavLink to={to} className={cn("flex flex-col items-center gap-0.5 text-[10px] font-medium",
      pathname.startsWith(to) ? "text-primary" : "text-muted-foreground")}>
      <Icon className="h-5 w-5" /><span>{label}</span>
    </NavLink>
  );
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] no-print">
      <div className="flex items-end justify-between gap-1">
        {item("/dashboard", LayoutDashboard, "Home")}
        {item("/clients", Users, "Clients")}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="-mt-7 h-14 w-14 rounded-2xl gradient-primary text-primary-foreground shadow-glow flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl border-0">
            <SheetHeader><SheetTitle>Quick actions</SheetTitle></SheetHeader>
            <div className="grid grid-cols-3 gap-3 pt-4">
              <button onClick={() => { setOpen(false); navigate("/files?upload=1"); }} className="card-soft p-4 flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-primary" /><span className="text-xs font-medium">Upload File</span>
              </button>
              <button onClick={() => { setOpen(false); navigate("/clients?new=1"); }} className="card-soft p-4 flex flex-col items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary" /><span className="text-xs font-medium">New Client</span>
              </button>
              <button onClick={() => { setOpen(false); navigate("/verify"); }} className="card-soft p-4 flex flex-col items-center gap-2">
                <ScanLine className="h-6 w-6 text-primary" /><span className="text-xs font-medium">Scan Record</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
        {item("/files", FileText, "Files")}
        {item("/more", MoreHorizontal, "More")}
      </div>
    </nav>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <MobileTopbar />
        <main className="flex-1 px-5 lg:px-8 py-5 lg:py-8 pb-28 lg:pb-12 animate-fade-in">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
