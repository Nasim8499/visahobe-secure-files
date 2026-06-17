import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/lib/store";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Share2, Printer, ShieldCheck, ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "@/lib/pdfWorker";
import { recordIdFor } from "@/lib/recordId";

export default function Viewer() {
  const { id = "" } = useParams();
  const { getFile, getClient } = useApp();
  const navigate = useNavigate();
  const f = getFile(id);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [totalPages, setTotalPages] = useState<number>(f?.pages ?? 0);
  const [pdfWidth, setPdfWidth] = useState(720);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      // Account for thumbnail sidebar (112px) + details sidebar (320px) + paddings on lg
      if (w >= 1024) setPdfWidth(Math.min(820, w - 112 - 320 - 80));
      else if (w >= 768) setPdfWidth(Math.min(820, w - 112 - 60));
      else setPdfWidth(Math.min(820, w - 32));
    };
    calc(); window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  if (!f) return <div className="p-8">File not found. <Link to="/files" className="text-primary">Back</Link></div>;
  const c = getClient(f.clientId);
  const isImage = f.mime?.startsWith("image/");
  const isPdf = (f.mime === "application/pdf") || (!!f.blobUrl && /\.pdf$/i.test(f.name));
  const recordId = recordIdFor(f.id);

  const file = useMemo(() => (f.blobUrl ? { url: f.blobUrl } : null), [f.blobUrl]);

  const onLoadSuccess = useCallback((pdf: { numPages: number }) => {
    setTotalPages(pdf.numPages);
  }, []);

  const goTo = (p: number) => {
    const max = totalPages || 1;
    const clamped = Math.max(1, Math.min(max, p));
    setPage(clamped); setPageInput(String(clamped));
  };

  const download = () => {
    if (f.blobUrl) {
      const a = document.createElement("a"); a.href = f.blobUrl; a.download = f.name; a.click();
      toast.success(`Downloading ${f.name}`);
    } else {
      toast.error("File not ready yet");
    }
  };
  const share = async () => {
    const link = `https://vault.visahobe.com/share/${f.id}`;
    try { await navigator.clipboard.writeText(link); toast.success("Secure link copied", { description: link }); }
    catch { toast.error("Could not copy link"); }
  };
  const print = () => {
    if (!f.blobUrl) { toast.error("File not ready yet"); return; }
    if (isPdf) {
      // Open the real PDF blob in a hidden iframe so the browser prints at exact A4 with no clipping.
      const existing = document.getElementById("vh-print-frame") as HTMLIFrameElement | null;
      existing?.remove();
      const iframe = document.createElement("iframe");
      iframe.id = "vh-print-frame";
      iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
      iframe.src = f.blobUrl;
      iframe.onload = () => { try { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); } catch { window.open(f.blobUrl, "_blank"); } };
      document.body.appendChild(iframe);
      toast("Opening print dialog…");
    } else {
      window.print();
    }
  };

  const pagesArr = totalPages > 0 ? Array.from({ length: totalPages }) : [];

  return (
    <div className="fixed inset-0 z-50 bg-viewer text-viewer-foreground flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/10 glass-dark gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"><ArrowLeft className="h-4 w-4" /></button>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{f.name}</div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono">{recordId}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--primary))]/30 text-white">{f.category}</span>
              <span className="text-[10px] text-white/60 flex items-center gap-1"><FileText className="h-3 w-3" /> {totalPages || "…"} {totalPages === 1 ? "page" : "pages"}</span>
              <span className="text-[10px] text-white/60 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { i: ZoomOut, a: () => setZoom((z) => Math.max(0.5, z - 0.1)), t: "Zoom out" },
            { i: ZoomIn, a: () => setZoom((z) => Math.min(2.5, z + 0.1)), t: "Zoom in" },
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
        {/* PDF document wrapper provides both the main page and the thumbnail strip */}
        {isPdf && file ? (
          <Document file={file} onLoadSuccess={onLoadSuccess} loading={<ViewerLoading />} error={<ViewerError onDownload={download} />} className="flex flex-1 min-w-0">
            {totalPages > 1 && (
              <aside className="hidden md:flex flex-col w-28 border-r border-white/10 p-3 gap-2 overflow-auto bg-black/20">
                <div className="text-[10px] uppercase tracking-wider text-white/50 px-1 mb-1">Pages</div>
                {pagesArr.map((_, i) => {
                  const p = i + 1; const active = page === p;
                  return (
                    <button key={p} onClick={() => goTo(p)}
                      className={`group relative rounded-lg overflow-hidden border-2 transition bg-white ${active ? "border-[hsl(var(--primary-glow))] shadow-glow" : "border-white/10 hover:border-white/40"}`}>
                      <Page pageNumber={p} width={88} renderAnnotationLayer={false} renderTextLayer={false} />
                      <div className={`absolute bottom-0 inset-x-0 text-center text-[10px] py-0.5 ${active ? "bg-[hsl(var(--primary))] text-white" : "bg-black/60 text-white/80"}`}>{p}</div>
                    </button>
                  );
                })}
              </aside>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto p-4 lg:p-8 flex items-start justify-center">
                <div style={{ transform: `rotate(${rot}deg)`, transformOrigin: "center top", transition: "transform 0.2s" }}>
                  <Page
                    pageNumber={page}
                    width={pdfWidth * zoom}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="shadow-elevated rounded-lg overflow-hidden bg-white"
                  />
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-white/10 glass-dark">
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
          </Document>
        ) : (
          <div className="flex-1 flex items-start justify-center overflow-auto p-4 lg:p-8">
            <div style={{ transform: `scale(${zoom}) rotate(${rot}deg)`, transformOrigin: "top center", transition: "transform 0.2s" }} className="w-full max-w-[820px]">
              {isImage && f.blobUrl ? (
                <img src={f.blobUrl} alt={f.name} className="w-full rounded-2xl shadow-elevated" />
              ) : (
                <ViewerLoading />
              )}
            </div>
          </div>
        )}

        {/* Side details */}
        <aside className="hidden lg:block w-80 border-l border-white/10 p-6 overflow-auto">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Document metadata</div>
          <div className="space-y-3 text-sm">
            {[
              ["Title", f.name],
              ["Record ID", recordId],
              ["Category", f.category],
              ["Pages", totalPages ? String(totalPages) : "…"],
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
            <div className="text-xs text-white/80 mt-1">Print opens the real PDF at exact A4. Encrypted in transit; for internal use only.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ViewerLoading() {
  return (
    <div className="flex flex-col items-center justify-center text-white/60 py-20 gap-3">
      <Loader2 className="h-6 w-6 animate-spin" />
      <div className="text-sm">Preparing secure preview…</div>
    </div>
  );
}
function ViewerError({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-white/70 gap-3 p-8">
      <div className="text-sm">Preview unavailable in this browser.</div>
      <button onClick={onDownload} className="text-sm underline">Download the file instead</button>
    </div>
  );
}
