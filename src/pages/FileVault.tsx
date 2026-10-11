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
import { recordIdFor } from "@/lib/recordId";

const cats: ("All" | FileCategory)[] = ["All", "Identity", "Travel", "Agreement", "Medical", "Company Letter", "Other"];
const statuses = ["All", "Pending", "Reviewed", "Approved"] as const;
const PAGE_SIZE = 9;
const MAX_BYTES = 10 * 1024 * 1024;

export default function FileVault() {
  const { files, clients, addFile } = useApp();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<typeof cats[number]>("All");
  const [status, setStatus] = useState<string>("All");
  const [pg, setPg] = useState(1);
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

  const ql = q.trim().toLowerCase();
  const filtered = files.filter((f) => {
    const c = clients.find((c) => c.id === f.clientId);
    const hay = `${f.name} ${recordIdFor(f.id)} ${f.category} ${f.status} ${c?.name || ""} ${c?.reference || ""}`.toLowerCase();
    return (!ql || hay.includes(ql)) && (cat === "All" || f.category === cat) && (status === "All" || f.status === status);
  });
  const totalPg = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPg(1); }, [q, cat, status]);
  useEffect(() => { if (pg > totalPg) setPg(totalPg); }, [pg, totalPg]);
  const pageItems = filtered.slice((pg - 1) * PAGE_SIZE, pg * PAGE_SIZE);

  const validatePdf = async (file: File): Promise<string | null> => {
    if (file.size === 0) return "File is empty.";
    if (file.size > MAX_BYTES) return `File is ${(file.size / 1048576).toFixed(1)} MB — max is 10 MB.`;
    if (!/\.pdf$/i.test(file.name)) return "Only .pdf files are allowed.";
    if (file.type && file.type !== "application/pdf") return `Invalid file type (${file.type}). PDF required.`;
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (String.fromCharCode(...head) !== "%PDF-") return "File is not a valid PDF (corrupted or renamed).";
    return null;
  };

  const onPick = async (file: File | null) => {
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    const err = await validatePdf(file);
    if (err) { toast.error("Upload rejected", { description: err }); setSelFile(null); return; }
    setSelFile(file);
  };

  const submit = async () => {
    if (!selFile) { toast.error("Upload failed", { description: "Select a PDF file first." }); return; }
    if (!clientId) { toast.error("Upload failed", { description: "Select a client." }); return; }
    const err = await validatePdf(selFile);
    if (err) { toast.error("Upload rejected", { description: err }); return; }
    try {
      const nf = addFile({ file: selFile, clientId, category });
      toast.success("PDF uploaded to vault");
      setOpen(false); setSelFile(null);
      navigate(`/viewer/${nf.id}`);
    } catch {
      toast.error("Upload failed", { description: "Something went wrong. Please try again." });
    }
  };

  const iconFor = (mime?: string) => mime?.startsWith("image/") ? ImageIcon : mime === "application/pdf" ? FileType2 : FileText;

  const downloadFile = (e: React.MouseEvent, f: typeof files[number]) => {
    e.preventDefault(); e.stopPropagation();
    if (!f.blobUrl) { toast.error("File still preparing…"); return; }
    const a = document.createElement("a"); a.href = f.blobUrl; a.download = f.name; a.click();
    toast.success(`Downloading ${f.name}`);
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
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search record ID, title, category, status, client" className="pl-10 h-12 rounded-xl bg-card" />
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

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 items-center">
        <span className="text-xs text-muted-foreground mr-1">Status</span>
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition",
            status === s ? "bg-foreground text-background" : "bg-card text-muted-foreground border border-border hover:text-foreground")}>{s}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageItems.map((f) => {
          const c = clients.find((c) => c.id === f.clientId);
          const Icon = iconFor(f.mime);
          const pages = f.pages;
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary inline-flex items-center gap-1"><Layers className="h-2.5 w-2.5" /> {pages ? `${pages} ${pages === 1 ? "pg" : "pgs"}` : "…"}</span>
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

      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {(pg - 1) * PAGE_SIZE + 1}–{Math.min(pg * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" disabled={pg <= 1} onClick={() => setPg(pg - 1)}>Prev</Button>
            <span className="font-medium">{pg} / {totalPg}</span>
            <Button variant="outline" size="sm" className="rounded-xl" disabled={pg >= totalPg} onClick={() => setPg(pg + 1)}>Next</Button>
          </div>
        </div>
      )}


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Upload to vault</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary hover:bg-secondary transition">
              <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-sm font-medium">{selFile ? selFile.name : "Tap to select a PDF"}</div>
              <div className="text-xs text-muted-foreground mt-1">{selFile ? `${(selFile.size / 1048576).toFixed(2)} MB · valid PDF` : "PDF only · max 10 MB"}</div>
            </button>
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => onPick(e.target.files?.[0] || null)} />
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
