import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Share2, Printer, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import DemoDocument from "@/components/DemoDocument";

function DemoPreview({ name, status }: { name: string; status: string }) {
  return (
    <div className="bg-white text-[#07111F] rounded-2xl shadow-elevated w-full max-w-2xl mx-auto p-8 relative overflow-hidden aspect-[3/4]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] text-6xl font-bold rotate-[-25deg] tracking-widest">
        VisaHOBe PTE. LTD.
      </div>
      <div className="relative">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-primary text-white flex items-center justify-center font-bold text-sm">VH</div>
            <div>
              <div className="font-semibold text-sm">VisaHOBe PTE. LTD.</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Secure Company Preview</div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">{status}</span>
        </div>
        <h2 className="font-semibold mt-6 text-lg">{name}</h2>
        <div className="text-xs text-gray-500 mt-1">Internal company record · For authorised personnel only</div>
        <div className="mt-6 space-y-2.5">
          {[100, 95, 88, 92, 80, 70, 85].map((w, i) => (
            <div key={i} className="h-2.5 rounded-full bg-gray-100" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {[90, 75, 60].map((w, i) => <div key={i} className="h-2 rounded-full bg-gray-100" style={{ width: `${w}%` }} />)}
          </div>
          <div className="rounded-lg border border-gray-200 p-3 grid grid-cols-5 gap-1">
            {Array.from({ length: 25 }).map((_, i) => <div key={i} className={`aspect-square rounded-[2px] ${Math.random() > 0.5 ? "bg-[#07111F]" : "bg-transparent"}`} />)}
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-200 pt-3 mt-8">
          <span>VH-DOC-{Math.floor(Math.random() * 9000 + 1000)}</span>
          <span>visahobe.com · confidential</span>
        </div>
      </div>
    </div>
  );
}

export default function Viewer() {
  const { id = "" } = useParams();
  const { getFile, getClient } = useApp();
  const navigate = useNavigate();
  const f = getFile(id);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);

  if (!f) return <div className="p-8">File not found. <Link to="/files" className="text-primary">Back</Link></div>;
  const c = getClient(f.clientId);
  const isImage = f.mime?.startsWith("image/");
  const isPdf = f.mime === "application/pdf";

  const download = () => {
    if (f.blobUrl) {
      const a = document.createElement("a"); a.href = f.blobUrl; a.download = f.name; a.click();
      toast.success(`Downloading ${f.name}`);
    } else {
      const content = `VisaHOBe PTE. LTD. — Secure Company Preview\n\nFile: ${f.name}\nFile ID: ${f.id.toUpperCase()}\nClient: ${c?.name || "—"}\nReference: ${c?.reference || "—"}\nCategory: ${f.category}\nStatus: ${f.status}\nUploaded: ${f.uploadedAt}\nSize: ${f.size}\nVisibility: ${f.visibility}\n\nThis is a demo placeholder document for internal preview only.\nGenerated ${new Date().toISOString()}\nvisahobe.com · confidential`;
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
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/10 glass-dark no-print">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></button>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{f.name}</div>
            <div className="text-[10px] text-white/60 flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Secure Company Preview</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { i: ZoomOut, a: () => setZoom((z) => Math.max(0.5, z - 0.1)) },
            { i: ZoomIn, a: () => setZoom((z) => Math.min(3, z + 0.1)) },
            { i: RotateCw, a: () => setRot((r) => r + 90) },
            { i: Download, a: download },
            { i: Share2, a: share },
            { i: Printer, a: print },
          ].map(({ i: Icon, a }, k) => (
            <button key={k} onClick={a} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center"><Icon className="h-4 w-4" /></button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 flex items-start justify-center">
          <div style={{ transform: `scale(${zoom}) rotate(${rot}deg)`, transformOrigin: "top center", transition: "transform 0.2s" }} className="w-full max-w-2xl">
            {isImage && f.blobUrl ? (
              <img src={f.blobUrl} alt={f.name} className="w-full rounded-2xl shadow-elevated" />
            ) : isPdf && f.blobUrl ? (
              <object data={f.blobUrl} type="application/pdf" className="w-full aspect-[3/4] rounded-2xl bg-white">
                <div className="p-8 text-center text-black">Preview unavailable. <button onClick={download} className="underline">Download</button></div>
              </object>
            ) : (
              <DemoPreview name={f.name} status={f.status} />
            )}
          </div>
        </div>

        {/* Side details */}
        <aside className="hidden lg:block w-80 border-l border-white/10 p-6 overflow-auto no-print">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">File details</div>
          <div className="space-y-3 text-sm">
            {[
              ["File ID", f.id.toUpperCase()],
              ["Client", c?.name || "—"],
              ["Reference", c?.reference || "—"],
              ["Category", f.category],
              ["Status", f.status],
              ["Uploaded", f.uploadedAt],
              ["Size", f.size],
              ["Visibility", f.visibility],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2 border-b border-white/5">
                <span className="text-white/60">{k}</span>
                <span className="font-medium text-right truncate">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl p-4 gradient-primary">
            <ShieldCheck className="h-5 w-5 mb-2" />
            <div className="text-sm font-semibold">Secure Company Preview</div>
            <div className="text-xs text-white/80 mt-1">Encrypted in transit. For internal VisaHOBe team use only.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
