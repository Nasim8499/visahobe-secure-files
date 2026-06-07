import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Share2, Printer, ShieldCheck, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { DemoPage, pageCountFor, recordIdFor } from "@/components/DemoDocument";

export default function Viewer() {
  const { id = "" } = useParams();
  const { getFile, getClient } = useApp();
  const navigate = useNavigate();
  const f = getFile(id);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  if (!f) return <div className="p-8">File not found. <Link to="/files" className="text-primary">Back</Link></div>;
  const c = getClient(f.clientId);
  const isImage = f.mime?.startsWith("image/");
  const isPdf = f.mime === "application/pdf";
  const isDemo = !f.blobUrl;
  const totalPages = isDemo ? pageCountFor(f.category) : 1;
  const recordId = recordIdFor(f.id);

  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage(clamped);
    setPageInput(String(clamped));
  };

  const download = () => {
    if (f.blobUrl) {
      const a = document.createElement("a"); a.href = f.blobUrl; a.download = f.name; a.click();
      toast.success(`Downloading ${f.name}`);
    } else {
      const content = `VisaHOBe PTE. LTD. — Secure Company Preview\n\nFile: ${f.name}\nRecord ID: ${recordId}\nFile ID: ${f.id.toUpperCase()}\nClient: ${c?.name || "—"}\nReference: ${c?.reference || "—"}\nCategory: ${f.category}\nPages: ${totalPages}\nStatus: ${f.status}\nUploaded: ${f.uploadedAt}\nSize: ${f.size}\nVisibility: ${f.visibility}\n\nThis is a demo placeholder document for internal preview only.\nGenerated ${new Date().toISOString()}\nvisahobe.com · confidential`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = f.name.replace(/\.[^.]+$/, "") + "-preview.txt"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Demo placeholder downloaded");
    }
  };
  const share = async () => {
    const link = `https://vault.visahobe.com/share/${f.id}`;
    try { await navigator.clipboard.writeText(link); toast.success("Secure link copied", { description: link }); }
    catch { toast.error("Could not copy link"); }
  };
  const print = () => { toast("Opening print dialog…"); setTimeout(() => window.print(), 150); };

  return (
    <div className="fixed inset-0 z-50 bg-viewer text-viewer-foreground flex flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/10 glass-dark no-print gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"><ArrowLeft className="h-4 w-4" /></button>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{f.name}</div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono">{recordId}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--primary))]/30 text-white">{f.category}</span>
              <span className="text-[10px] text-white/60 flex items-center gap-1"><FileText className="h-3 w-3" /> {totalPages} {totalPages === 1 ? "page" : "pages"}</span>
              <span className="text-[10px] text-white/60 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { i: ZoomOut, a: () => setZoom((z) => Math.max(0.5, z - 0.1)), t: "Zoom out" },
            { i: ZoomIn, a: () => setZoom((z) => Math.min(3, z + 0.1)), t: "Zoom in" },
            { i: RotateCw, a: () => setRot((r) => r + 90), t: "Rotate" },
            { i: Download, a: download, t: "Download" },
            { i: Share2, a: share, t: "Share" },
            { i: Printer, a: print, t: "Print" },
          ].map(({ i: Icon, a, t }, k) => (
            <button key={k} onClick={a} title={t} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center"><Icon className="h-4 w-4" /></button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails */}
        {isDemo && totalPages > 1 && (
          <aside className="hidden md:flex flex-col w-28 border-r border-white/10 p-3 gap-2 overflow-auto no-print">
            <div className="text-[10px] uppercase tracking-wider text-white/50 px-1 mb-1">Pages</div>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const active = page === p;
              return (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`group relative rounded-lg overflow-hidden border-2 transition aspect-[1/1.414] ${active ? "border-[hsl(var(--primary-glow))] shadow-glow" : "border-white/10 hover:border-white/40"}`}
                >
                  <div className="absolute top-0 left-0 origin-top-left" style={{ width: "794px", transform: "scale(0.11)" }}>
                    <DemoPage name={f.name} status={f.status} category={f.category} client={c} fileId={f.id} page={i} />
                  </div>
                  <div className={`absolute bottom-0 inset-x-0 text-center text-[10px] py-0.5 ${active ? "bg-[hsl(var(--primary))] text-white" : "bg-black/60 text-white/80"}`}>{p}</div>
                </button>
              );
            })}
          </aside>
        )}


        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 lg:p-8 flex items-start justify-center print-area">
            <div style={{ transform: `scale(${zoom}) rotate(${rot}deg)`, transformOrigin: "top center", transition: "transform 0.2s" }} className="w-full max-w-[820px]">
              {isImage && f.blobUrl ? (
                <img src={f.blobUrl} alt={f.name} className="w-full rounded-2xl shadow-elevated" />
              ) : isPdf && f.blobUrl ? (
                <object data={f.blobUrl} type="application/pdf" className="w-full aspect-[1/1.414] rounded-2xl bg-white">
                  <div className="p-8 text-center text-black">Preview unavailable. <button onClick={download} className="underline">Download</button></div>
                </object>
              ) : isDemo ? (
                <>
                  <div className="screen-only">
                    <DemoPage name={f.name} status={f.status} category={f.category} client={c} fileId={f.id} page={page - 1} />
                  </div>
                  <div className="print-only space-y-0">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <div key={i} className="print-page">
                        <DemoPage name={f.name} status={f.status} category={f.category} client={c} fileId={f.id} page={i} />
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Page nav */}
          {isDemo && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-white/10 glass-dark no-print">
              <button onClick={() => goTo(page - 1)} disabled={page === 1} className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-40 flex items-center gap-1 text-sm"><ChevronLeft className="h-4 w-4" /> Prev</button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/60">Page</span>
                <input
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ""))}
                  onBlur={() => goTo(parseInt(pageInput) || 1)}
                  onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
                  className="w-12 h-9 text-center rounded-lg bg-white/10 border border-white/10 outline-none focus:border-white/40"
                />
                <span className="text-white/60">of {totalPages}</span>
              </div>
              <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-40 flex items-center gap-1 text-sm">Next <ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>

        {/* Side details */}
        <aside className="hidden lg:block w-80 border-l border-white/10 p-6 overflow-auto no-print">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Document metadata</div>
          <div className="space-y-3 text-sm">
            {[
              ["Title", f.name],
              ["Record ID", recordId],
              ["Category", f.category],
              ["Pages", String(totalPages)],
              ["Client", c?.name || "—"],
              ["Reference", c?.reference || "—"],
              ["Status", f.status],
              ["Uploaded", f.uploadedAt],
              ["Size", f.size],
              ["Visibility", f.visibility],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2 border-b border-white/5">
                <span className="text-white/60">{k}</span>
                <span className="font-medium text-right truncate max-w-[55%]">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl p-4 gradient-primary">
            <ShieldCheck className="h-5 w-5 mb-2" />
            <div className="text-sm font-semibold">A4 Print-ready</div>
            <div className="text-xs text-white/80 mt-1">Use Print to export all pages on A4. Encrypted in transit; for internal use only.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
