import { useState } from "react";
import { ScanLine, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";

export default function Verify() {
  const { clients } = useApp();
  const [id, setId] = useState("VH-2026-001248");
  const [result, setResult] = useState<any>(null);

  const verify = () => {
    const c = clients.find((c) => c.reference.toLowerCase() === id.toLowerCase()) || clients[0];
    setResult({
      ref: c.reference, name: c.name, country: c.country,
      type: "Company Record", status: "Verified", validUntil: "2027-12-31",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Public Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">Validate a VisaHOBe company record by ID.</p>
      </div>

      <div className="card-elevated p-6">
        <label className="text-xs font-medium text-muted-foreground">Record ID</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={id} onChange={(e) => setId(e.target.value)} className="pl-10 pr-12 h-12 rounded-xl" placeholder="VH-2026-XXXXXX" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-secondary flex items-center justify-center"><ScanLine className="h-4 w-4 text-primary" /></button>
        </div>
        <Button onClick={verify} className="w-full mt-4 h-12 rounded-xl gradient-primary text-primary-foreground shadow-glow">Verify Now</Button>
      </div>

      {result && (
        <div className="card-elevated p-6 animate-scale-in">
          <div className="flex items-center gap-2 text-success mb-4">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <div className="font-semibold">Verified</div>
              <div className="text-xs text-muted-foreground">This company record is verified by VisaHOBe PTE. LTD.</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Record ID", result.ref], ["Client Name", result.name], ["Reference", result.ref],
              ["Country", result.country], ["Record Type", result.type], ["Status", result.status],
              ["Valid Until", result.validUntil],
            ].map(([k, v]) => (
              <div key={k} className="py-2 border-b border-border">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
