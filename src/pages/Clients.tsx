import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Plus, Phone, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Clients() {
  const { clients, addClient } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"All" | "Active" | "Inactive">("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", reference: "", country: "", phone: "", email: "", status: "Active" as const, notes: "" });

  useEffect(() => { if (params.get("new") === "1") { setOpen(true); params.delete("new"); setParams(params); } }, [params, setParams]);

  const filtered = clients.filter((c) => {
    const m = `${c.name} ${c.reference} ${c.phone}`.toLowerCase().includes(q.toLowerCase());
    const t = tab === "All" || c.status === tab;
    return m && t;
  });

  const submit = () => {
    if (!form.name || !form.reference) { toast.error("Name and reference are required"); return; }
    addClient(form);
    toast.success("Client added");
    setOpen(false);
    setForm({ name: "", reference: "", country: "", phone: "", email: "", status: "Active", notes: "" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} total records</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-xl gradient-primary text-primary-foreground shadow-glow"><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, reference, or phone" className="pl-10 h-12 rounded-xl bg-card" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin">
        {(["All", "Active", "Inactive"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition",
            tab === t ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card text-muted-foreground hover:text-foreground border border-border")}>{t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <Link key={c.id} to={`/clients/${c.id}`} className="card-soft p-4 hover:shadow-card transition-all hover:-translate-y-0.5 block">
            <div className="flex items-start gap-3">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.avatarColor} text-white flex items-center justify-center font-semibold text-lg shrink-0`}>{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold truncate">{c.name}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${c.status === "Active" ? "bg-success/10 text-success" : c.status === "Pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.reference}</div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{c.country}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone.split(" ")[0]}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground text-sm">No clients match your search.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Add new client</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
            <Input placeholder="Reference (e.g. VH-2026-001300)" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className="rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="rounded-xl" />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" />
            </div>
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={submit} className="rounded-xl gradient-primary text-primary-foreground">Add client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
