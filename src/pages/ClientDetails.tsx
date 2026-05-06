import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, Globe, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ClientDetails() {
  const { id = "" } = useParams();
  const { getClient, filesForClient, updateClient } = useApp();
  const navigate = useNavigate();
  const c = getClient(id);
  const [tab, setTab] = useState<"Files" | "Application" | "History" | "Notes">("Files");
  const [notes, setNotes] = useState(c?.notes || "");

  if (!c) return <div className="p-8">Client not found. <Link to="/clients" className="text-primary">Back</Link></div>;
  const files = filesForClient(c.id);

  return (
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</button>

      <div className="card-elevated p-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 gradient-hero opacity-90" />
        <div className="relative flex flex-col sm:flex-row gap-4 sm:items-end pt-10">
          <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${c.avatarColor} text-white flex items-center justify-center font-semibold text-3xl border-4 border-card shadow-card`}>{c.name[0]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{c.name}</h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === "Active" ? "bg-success/10 text-success" : c.status === "Pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
            </div>
            <div className="text-sm text-muted-foreground">{c.reference}</div>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-3 mt-2">
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{c.country}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>
            </div>
          </div>
          <Button onClick={() => navigate(`/files?upload=1&client=${c.id}`)} className="rounded-xl gradient-primary text-primary-foreground"><Upload className="h-4 w-4 mr-1" /> Upload file</Button>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {(["Files", "Application", "History", "Notes"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition",
            tab === t ? "bg-card shadow-soft text-foreground" : "text-muted-foreground")}>{t}</button>
        ))}
      </div>

      {tab === "Files" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {files.map((f) => (
            <Link key={f.id} to={`/viewer/${f.id}`} className="card-soft p-4 flex items-center gap-3 hover:shadow-card transition">
              <div className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center"><FileText className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.category} · {f.size}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground">{f.status}</span>
            </Link>
          ))}
          {files.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground text-sm card-soft">No files yet for this client.</div>}
        </div>
      )}

      {tab === "Application" && (
        <div className="card-elevated p-6">
          <h3 className="font-semibold mb-4">Application progress</h3>
          <div className="text-sm text-muted-foreground mb-4">Record ID: <span className="text-foreground font-medium">{c.reference}</span></div>
          <Link to="/applications" className="text-primary text-sm font-medium">View full timeline →</Link>
        </div>
      )}

      {tab === "History" && (
        <div className="card-elevated p-6 space-y-3">
          {[
            { d: "2026-05-01", t: "Company letter uploaded" },
            { d: "2026-04-28", t: "Travel itinerary reviewed" },
            { d: "2026-04-12", t: "Client onboarded" },
          ].map((h, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground w-24">{h.d}</span>
              <span>{h.t}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Notes" && (
        <div className="card-elevated p-6 space-y-3">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="rounded-xl" placeholder="Add internal notes..." />
          <Button onClick={() => { updateClient(c.id, { notes }); toast.success("Notes saved"); }} className="gradient-primary text-primary-foreground rounded-xl">Save notes</Button>
        </div>
      )}
    </div>
  );
}
