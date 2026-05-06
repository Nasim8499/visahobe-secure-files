import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Upload, FileText, Image as ImageIcon, FileType2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileCategory } from "@/lib/types";

const cats: ("All" | FileCategory)[] = ["All", "Identity", "Travel", "Agreement", "Medical", "Company Letter", "Other"];

export default function FileVault() {
  const { files, clients, addFile } = useApp();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<typeof cats[number]>("All");
  const [open, setOpen] = useState(false);
  const [selFile, setSelFile] = useState<File | null>(null);
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [category, setCategory] = useState<FileCategory>("Company Letter");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.get("upload") === "1") {
      setOpen(true);
      const cid = params.get("client"); if (cid) setClientId(cid);
      params.delete("upload"); params.delete("client"); setParams(params);
    }
  }, [params, setParams]);

  const filtered = files.filter((f) => {
    const c = clients.find((c) => c.id === f.clientId);
    const m = `${f.name} ${c?.name || ""}`.toLowerCase().includes(q.toLowerCase());
    const k = cat === "All" || f.category === cat;
    return m && k;
  });

  const submit = () => {
    if (!selFile || !clientId) { toast.error("Select file and client"); return; }
    const nf = addFile({ file: selFile, clientId, category });
    toast.success("File uploaded to vault");
    setOpen(false); setSelFile(null);
    navigate(`/viewer/${nf.id}`);
  };

  const iconFor = (mime?: string) => mime?.startsWith("image/") ? ImageIcon : mime === "application/pdf" ? FileType2 : FileText;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">File Vault</h1>
          <p className="text-sm text-muted-foreground mt-1">{files.length} files secured</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-xl gradient-primary text-primary-foreground shadow-glow"><Upload className="h-4 w-4 mr-1" /> Upload</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files or clients" className="pl-10 h-12 rounded-xl bg-card" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition",
            cat === c ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card text-muted-foreground border border-border hover:text-foreground")}>{c}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((f) => {
          const c = clients.find((c) => c.id === f.clientId);
          const Icon = iconFor(f.mime);
          return (
            <Link key={f.id} to={`/viewer/${f.id}`} className="card-soft p-4 hover:shadow-card transition-all hover:-translate-y-0.5 block">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c?.name} · {f.category}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.size} · {f.uploadedAt}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${f.status === "Approved" ? "bg-success/10 text-success" : f.status === "Pending" ? "bg-warning/10 text-warning" : "bg-secondary text-foreground"}`}>{f.status}</span>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground text-sm">No files match.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Upload to vault</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary hover:bg-secondary transition">
              <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-sm font-medium">{selFile ? selFile.name : "Tap to select a file"}</div>
              <div className="text-xs text-muted-foreground mt-1">PDF, image or document</div>
            </button>
            <input ref={inputRef} type="file" className="hidden" onChange={(e) => setSelFile(e.target.files?.[0] || null)} />
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="rounded-xl border border-border bg-card px-3 h-11 text-sm">
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.reference}</option>)}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value as FileCategory)} className="rounded-xl border border-border bg-card px-3 h-11 text-sm">
              {(["Identity", "Travel", "Agreement", "Medical", "Company Letter", "Other"] as FileCategory[]).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={submit} className="rounded-xl gradient-primary text-primary-foreground">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
