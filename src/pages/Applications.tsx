import { Link } from "react-router-dom";
import { CheckCircle2, Circle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { t: "Record Created", d: "2026-04-12", done: true },
  { t: "Files Uploaded", d: "2026-04-22", done: true },
  { t: "Review Started", d: "2026-04-28", done: true, current: true },
  { t: "Partner Review", d: "Pending", done: false },
  { t: "Completed", d: "Pending", done: false },
];

export default function Applications() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Application Status</h1>
        <p className="text-sm text-muted-foreground mt-1">Record ID <span className="font-medium text-foreground">VH-2026-001248</span></p>
      </div>

      <div className="card-elevated p-6">
        <div className="space-y-1">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${s.current ? "gradient-primary text-primary-foreground shadow-glow" : s.done ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>
                  {s.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                {i < steps.length - 1 && <div className={`w-0.5 h-12 ${s.done ? "bg-success/40" : "bg-border"}`} />}
              </div>
              <div className="pt-1.5 pb-6 flex-1">
                <div className={`font-semibold text-sm ${s.current ? "text-primary" : ""}`}>{s.t}{s.current && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">In progress</span>}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/files"><Button className="rounded-xl gradient-primary text-primary-foreground mt-2"><FileText className="h-4 w-4 mr-1" /> View files</Button></Link>
      </div>
    </div>
  );
}
