import { useState } from "react";
import { ScanLine, ShieldCheck, Search, XCircle, Copy, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export default function Verify() {
  const { clients } = useApp();
  const [id, setId] = useState("VH-2026-001248");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { found: true; ref: string; name: string; country: string; type: string; status: string; validUntil: string; issuedOn: string } | { found: false; ref: string }>(null);

  const verify = () => {
    const q = id.trim();
    if (!q) { toast.error("Please enter a Record ID"); return; }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const c = clients.find((c) => c.reference.toLowerCase() === q.toLowerCase());
      if (!c) {
        setResult({ found: false, ref: q });
        toast.error("No matching record");
      } else {
        setResult({
          found: true,
          ref: c.reference, name: c.name, country: c.country,
          type: "Company Record", status: "Verified",
          issuedOn: c.createdAt, validUntil: "2027-12-31",
        });
        toast.success("Record verified");
      }
      setLoading(false);
    }, 600);
  };

  const reset = () => { setResult(null); setId(""); };
  const copyRef = (v: string) => { navigator.clipboard.writeText(v); toast.success("Reference copied"); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Public Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">Validate a VisaHOBe company record by ID. Results show limited public information only.</p>
      </div>

      <div className="card-elevated p-6">
        <label className="text-xs font-medium text-muted-foreground">Record ID</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify()}
            className="pl-10 pr-12 h-12 rounded-xl"
            placeholder="VH-2026-XXXXXX"
          />
          <button onClick={() => toast("Scanner not available in demo")} aria-label="Scan" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><ScanLine className="h-4 w-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-muted-foreground self-center">Try:</span>
          {clients.slice(0, 3).map((c) => (
            <button key={c.id} onClick={() => setId(c.reference)} className="text-[11px] px-2 py-1 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition font-mono">{c.reference}</button>
          ))}
        </div>
        <Button onClick={verify} disabled={loading} className="w-full mt-4 h-12 rounded-xl gradient-primary text-primary-foreground shadow-glow">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying…</> : "Verify Now"}
        </Button>
      </div>

      {result && result.found && (
        <div className="card-elevated p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-2xl bg-success/10 text-success flex items-center justify-center"><ShieldCheck className="h-6 w-6" /></div>
            <div className="flex-1">
              <div className="font-semibold text-success">Record Verified</div>
              <div className="text-xs text-muted-foreground">Issued and verified by VisaHOBe PTE. LTD.</div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={reset}><RotateCcw className="h-3 w-3 mr-1" /> New search</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Record ID", result.ref], ["Client Name", result.name],
              ["Country", result.country], ["Record Type", result.type],
              ["Status", result.status], ["Issued On", result.issuedOn],
              ["Valid Until", result.validUntil],
            ].map(([k, v]) => (
              <div key={k} className="py-2 border-b border-border">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => copyRef(result.ref)}><Copy className="h-4 w-4 mr-1" /> Copy reference</Button>
            <Button className="flex-1 rounded-xl gradient-primary text-primary-foreground" onClick={() => { navigator.clipboard.writeText(`https://verify.visahobe.com/r/${result.ref}`); toast.success("Verification link copied"); }}>Share verification</Button>
          </div>
          <div className="mt-4 text-[11px] text-muted-foreground text-center">This is a limited public view. Full record details are restricted to authorised personnel.</div>
        </div>
      )}

      {result && !result.found && (
        <div className="card-elevated p-6 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center"><XCircle className="h-6 w-6" /></div>
            <div className="flex-1">
              <div className="font-semibold text-destructive">No record found</div>
              <div className="text-xs text-muted-foreground mt-0.5">No VisaHOBe record matches <span className="font-mono">{result.ref}</span>. Please check the ID and try again.</div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-xl" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Try another</Button>
        </div>
      )}
    </div>
  );
}
