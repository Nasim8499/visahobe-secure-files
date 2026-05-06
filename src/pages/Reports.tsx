import { TrendingUp, FileText, Users, CheckCircle2 } from "lucide-react";

export default function Reports() {
  const cards = [
    { t: "Files processed", v: "3,562", d: "+8% vs last month", i: FileText, g: "gradient-primary" },
    { t: "New clients", v: "148", d: "+12%", i: Users, g: "gradient-red" },
    { t: "Approval rate", v: "94.2%", d: "+1.4 pts", i: CheckCircle2, g: "bg-success" },
    { t: "Avg turnaround", v: "2.3d", d: "-0.4d", i: TrendingUp, g: "bg-warning" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance overview · last 30 days</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.t} className="card-elevated p-5">
            <div className={`h-10 w-10 rounded-xl ${c.g} text-primary-foreground flex items-center justify-center mb-3`}><c.i className="h-5 w-5" /></div>
            <div className="text-xs text-muted-foreground">{c.t}</div>
            <div className="text-2xl font-bold mt-1">{c.v}</div>
            <div className="text-xs text-success mt-1">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">Files by category</h3>
          <div className="space-y-3">
            {[["Identity", 80], ["Travel", 65], ["Agreement", 50], ["Medical", 35], ["Company Letter", 90], ["Other", 25]].map(([k, v]: any) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="text-muted-foreground">{v}%</span></div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full gradient-primary" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">Top countries</h3>
          <div className="space-y-3">
            {[["India", 412], ["Singapore", 298], ["UAE", 211], ["Australia", 188], ["Italy", 142]].map(([k, v]: any) => (
              <div key={k} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <span>{k}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
