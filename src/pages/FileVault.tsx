import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Upload, FileText, Image as ImageIcon, FileType2, Download, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileCategory } from "@/lib/types";
import { pageCountFor, recordIdFor } from "@/components/DemoDocument";

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

  const downloadFile = (e: React.MouseEvent, f: typeof files[number]) => {
    e.preventDefault(); e.stopPropagation();
    if (f.blobUrl) {
      const a = document.createElement("a"); a.href = f.blobUrl; a.download = f.name; a.click();
      toast.success(`Downloading ${f.name}`);
    } else {
      const c = clients.find((c) => c.id === f.clientId);
      const content = `VisaHOBe PTE. LTD. — Secure Company Preview\n\nFile: ${f.name}\nFile ID: ${f.id.toUpperCase()}\nClient: ${c?.name || "—"}\nReference: ${c?.reference || "—"}\nCategory: ${f.category}\nStatus: ${f.status}\nUploaded: ${f.uploadedAt}\nSize: ${f.size}\n\nDemo placeholder · visahobe.com · confidential`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = f.name.replace(/\.[^.]+$/, "") + "-preview.txt"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Demo placeholder downloaded");
    }
  };

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
        {cats.map((c) => {
          const count = c === "All" ? files.length : files.filter((f) => f.category === c).length;
          return (
            <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition inline-flex items-center gap-2",
              cat === c ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card text-muted-foreground border border-border hover:text-foreground")}>
              {c}
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-mono", cat === c ? "bg-white/20" : "bg-secondary text-foreground")}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((f) => {
          const c = clients.find((c) => c.id === f.clientId);
          const Icon = iconFor(f.mime);
          const isDemo = !f.blobUrl;
          const pages = isDemo ? pageCountFor(f.category) : 1;
          const recId = recordIdFor(f.id);
          return (
            <Link key={f.id} to={`/viewer/${f.id}`} className="card-soft p-4 hover:shadow-card transition-all hover:-translate-y-0.5 block">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c?.name} · {f.category}</div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-secondary text-foreground">{recId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary inline-flex items-center gap-1"><Layers className="h-2.5 w-2.5" /> {pages} {pages === 1 ? "pg" : "pgs"}</span>
                    <span className="text-[10px] text-muted-foreground">{f.size}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${f.status === "Approved" ? "bg-success/10 text-success" : f.status === "Pending" ? "bg-warning/10 text-warning" : "bg-secondary text-foreground"}`}>{f.status}</span>
                  <button onClick={(e) => downloadFile(e, f)} aria-label="Download" className="h-8 w-8 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition"><Download className="h-3.5 w-3.5" /></button>
                </div>
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
