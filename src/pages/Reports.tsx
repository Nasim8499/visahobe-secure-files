import { TrendingUp, FileText, Users, CheckCircle2, Download, RefreshCw, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ranges = ["7d", "30d", "90d", "1y"] as const;

export default function Reports() {
  const [range, setRange] = useState<typeof ranges[number]>("30d");
  const [refreshing, setRefreshing] = useState(false);

  const cards = [
    { t: "Files processed", v: "3,562", d: "+8% vs last period", i: FileText, g: "gradient-primary" },
    { t: "New clients", v: "148", d: "+12%", i: Users, g: "gradient-red" },
    { t: "Approval rate", v: "94.2%", d: "+1.4 pts", i: CheckCircle2, g: "bg-success" },
    { t: "Avg turnaround", v: "2.3d", d: "-0.4d", i: TrendingUp, g: "bg-warning" },
  ];

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.success("Reports refreshed"); }, 700);
  };

  const exportCsv = () => {
    const rows = [
      ["Metric", "Value", "Change"],
      ...cards.map((c) => [c.t, c.v, c.d]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `visahobe-reports-${range}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Report exported");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance overview · last {range}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={refresh}><RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refresh</Button>
          <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
        {ranges.map((r) => (
          <button key={r} onClick={() => { setRange(r); toast(`Showing last ${r}`); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${range === r ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{r}</button>
        ))}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Files by category</h3>
            <button onClick={() => toast("Filter applied")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Filter className="h-3 w-3" /> Filter</button>
          </div>
          <div className="space-y-3">
            {[["Identity", 80], ["Travel", 65], ["Agreement", 50], ["Medical", 35], ["Company Letter", 90], ["Other", 25]].map(([k, v]: any) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="text-muted-foreground">{v}%</span></div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full gradient-primary transition-all" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4">Top countries</h3>
          <div className="space-y-1">
            {[["India", 412], ["Singapore", 298], ["UAE", 211], ["Australia", 188], ["Italy", 142]].map(([k, v]: any) => (
              <button key={k} onClick={() => toast(`${k}: ${v} files`)} className="w-full flex items-center justify-between text-sm py-2.5 border-b border-border last:border-0 hover:bg-secondary/50 px-2 -mx-2 rounded-lg transition">
                <span>{k}</span><span className="font-semibold">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-elevated p-5">
        <h3 className="font-semibold mb-4">Recent activity</h3>
        <div className="space-y-2 text-sm">
          {[
            ["09:42", "12 files approved by Partner Review"],
            ["08:15", "3 new clients onboarded"],
            ["Yesterday", "Monthly compliance report generated"],
            ["2 days ago", "Public verifications: 47"],
          ].map(([t, d]) => (
            <div key={d} className="flex gap-3 py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{t}</span>
              <span className="flex-1">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
