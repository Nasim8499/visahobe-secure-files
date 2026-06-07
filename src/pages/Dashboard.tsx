import { useApp } from "@/lib/store";
import { Link } from "react-router-dom";
import { Users, FolderLock, Clock, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, FileText, UserPlus, Eye, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerImg from "@/assets/dashboard-banner.jpg";

const KPI = ({ icon: Icon, label, value, trend, gradient }: any) => (
  <div className="card-elevated p-5 relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${gradient} opacity-10 group-hover:opacity-20 transition`} />
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        <div className="text-2xl lg:text-3xl font-bold mt-2">{value}</div>
        {trend && <div className="text-xs text-success mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trend}</div>}
      </div>
      <div className={`h-10 w-10 rounded-xl ${gradient} flex items-center justify-center text-primary-foreground`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const MiniChart = () => {
  const bars = [40, 65, 50, 80, 60, 90, 75, 95, 70, 88, 60, 100];
  return (
    <div className="flex items-end gap-1.5 h-32">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] opacity-80 hover:opacity-100 transition" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { activity, files, clients } = useApp();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Here is what is happening across your VisaHOBe workspace today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <KPI icon={Users} label="Total Clients" value="1,248" trend="+12% this month" gradient="gradient-primary" />
        <KPI icon={FolderLock} label="Total Files" value="3,562" trend="+8% this month" gradient="gradient-red" />
        <KPI icon={Clock} label="Pending" value="256" gradient="bg-warning" />
        <KPI icon={CheckCircle2} label="Completed" value="2,945" trend="+18%" gradient="bg-success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Workspace analytics</h3>
              <p className="text-xs text-muted-foreground">Files processed last 12 months</p>
            </div>
            <div className="text-xs px-2.5 py-1 rounded-full bg-secondary text-primary font-medium">+24%</div>
          </div>
          <MiniChart />
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-border">
            <div><div className="text-xs text-muted-foreground">Avg processing</div><div className="font-semibold mt-0.5">2.3 days</div></div>
            <div><div className="text-xs text-muted-foreground">Approval rate</div><div className="font-semibold mt-0.5">94.2%</div></div>
            <div><div className="text-xs text-muted-foreground">Active staff</div><div className="font-semibold mt-0.5">18</div></div>
          </div>
        </div>

        <Link to="/verify" className="card-elevated p-5 gradient-hero text-primary-foreground relative overflow-hidden block group">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <ShieldCheck className="h-8 w-8 mb-3" />
            <h3 className="font-semibold text-lg">Quick verify</h3>
            <p className="text-sm text-white/80 mt-1">Validate a VisaHOBe company record by ID.</p>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-medium group-hover:gap-3 transition-all">
              <ScanLine className="h-4 w-4" /> Verify a record <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent records</h3>
            <Link to="/clients" className="text-xs text-primary font-medium">View all</Link>
          </div>
          <div className="space-y-2">
            {clients.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${c.avatarColor} text-white flex items-center justify-center font-semibold`}>{c.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.reference} · {c.country}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === "Active" ? "bg-success/10 text-success" : c.status === "Pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent activity</h3>
            <Button variant="ghost" size="sm" className="text-xs">Filter</Button>
          </div>
          <div className="space-y-3">
            {activity.slice(0, 6).map((a) => {
              const Icon = a.type === "upload" ? FileText : a.type === "client" ? UserPlus : a.type === "verify" ? Eye : CheckCircle2;
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0"><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
