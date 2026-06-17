import { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import { Activity, Client, VaultFile, FileCategory } from "./types";
import { generateDemoPdf } from "./generatePdf";
import { recordIdFor } from "./recordId";
import { pdfjs } from "./pdfWorker";

const seedClients: Client[] = [
  { id: "c1", name: "Aarav Sharma", reference: "VH-2026-001248", country: "India", phone: "+91 98201 22345", email: "aarav@example.com", status: "Active", avatarColor: "from-[#003B73] to-[#177BBB]", notes: "Priority client. Renewal due Q3.", createdAt: "2026-04-12" },
  { id: "c2", name: "Mei Lin Tan", reference: "VH-2026-001211", country: "Singapore", phone: "+65 8123 9921", email: "mei@example.com", status: "Active", avatarColor: "from-[#177BBB] to-[#E63946]", notes: "Files complete.", createdAt: "2026-03-22" },
  { id: "c3", name: "Daniel Okeke", reference: "VH-2026-001190", country: "Nigeria", phone: "+234 802 998 1122", email: "daniel@example.com", status: "Pending", avatarColor: "from-[#E63946] to-[#F1573D]", notes: "Awaiting medical letter.", createdAt: "2026-03-10" },
  { id: "c4", name: "Sofia Rossi", reference: "VH-2026-001173", country: "Italy", phone: "+39 333 221 4490", email: "sofia@example.com", status: "Inactive", avatarColor: "from-[#003B73] to-[#E63946]", notes: "Archived account.", createdAt: "2026-02-19" },
  { id: "c5", name: "Liam Walker", reference: "VH-2026-001165", country: "Australia", phone: "+61 412 778 211", email: "liam@example.com", status: "Active", avatarColor: "from-[#177BBB] to-[#003B73]", notes: "", createdAt: "2026-02-08" },
  { id: "c6", name: "Noor Hassan", reference: "VH-2026-001150", country: "UAE", phone: "+971 50 882 1190", email: "noor@example.com", status: "Active", avatarColor: "from-[#F1573D] to-[#177BBB]", notes: "", createdAt: "2026-01-30" },
];

const seedFiles: VaultFile[] = [
  { id: "f1", name: "Company Letter - Aarav.pdf", clientId: "c1", category: "Company Letter", size: "248 KB", uploadedAt: "2026-05-01", status: "Approved", visibility: "Private", isDemo: true, mime: "application/pdf" },
  { id: "f2", name: "Travel Itinerary.pdf", clientId: "c1", category: "Travel", size: "612 KB", uploadedAt: "2026-04-28", status: "Reviewed", visibility: "Private", isDemo: true, mime: "application/pdf" },
  { id: "f3", name: "Identity Reference.pdf", clientId: "c2", category: "Identity", size: "1.2 MB", uploadedAt: "2026-04-22", status: "Approved", visibility: "Shared", isDemo: true, mime: "application/pdf" },
  { id: "f4", name: "Service Agreement.pdf", clientId: "c2", category: "Agreement", size: "344 KB", uploadedAt: "2026-04-19", status: "Pending", visibility: "Private", isDemo: true, mime: "application/pdf" },
  { id: "f5", name: "Medical Summary.pdf", clientId: "c3", category: "Medical", size: "188 KB", uploadedAt: "2026-04-12", status: "Pending", visibility: "Private", isDemo: true, mime: "application/pdf" },
  { id: "f6", name: "Onboarding Notes.pdf", clientId: "c5", category: "Other", size: "92 KB", uploadedAt: "2026-04-08", status: "Reviewed", visibility: "Private", isDemo: true, mime: "application/pdf" },
];

const seedActivity: Activity[] = [
  { id: "a1", text: "Aarav Sharma uploaded Company Letter", time: "12m ago", type: "upload" },
  { id: "a2", text: "Mei Lin Tan record approved by partner", time: "1h ago", type: "review" },
  { id: "a3", text: "New client Noor Hassan added", time: "3h ago", type: "client" },
  { id: "a4", text: "Public verification: VH-2026-001248", time: "5h ago", type: "verify" },
  { id: "a5", text: "Daniel Okeke awaiting medical document", time: "Yesterday", type: "review" },
];

interface AppCtx {
  clients: Client[];
  files: VaultFile[];
  activity: Activity[];
  authed: boolean;
  login: () => void;
  logout: () => void;
  addClient: (c: Omit<Client, "id" | "createdAt" | "avatarColor">) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  addFile: (f: { file: File; clientId: string; category: FileCategory }) => VaultFile;
  getClient: (id: string) => Client | undefined;
  getFile: (id: string) => VaultFile | undefined;
  filesForClient: (id: string) => VaultFile[];
}

const Ctx = createContext<AppCtx | null>(null);

const palettes = [
  "from-[#003B73] to-[#177BBB]",
  "from-[#177BBB] to-[#E63946]",
  "from-[#E63946] to-[#F1573D]",
  "from-[#003B73] to-[#E63946]",
  "from-[#F1573D] to-[#177BBB]",
];

async function pdfPageCount(blob: Blob): Promise<number> {
  try {
    const buf = await blob.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    return doc.numPages;
  } catch { return 1; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [files, setFiles] = useState<VaultFile[]>(seedFiles);
  const [activity, setActivity] = useState<Activity[]>(seedActivity);
  const [authed, setAuthed] = useState(false);
  const generated = useRef(false);

  // Generate real PDFs for all seeded demo files once.
  useEffect(() => {
    if (generated.current) return;
    generated.current = true;
    setFiles((prev) => prev.map((f) => {
      if (f.blobUrl || !f.isDemo) return f;
      const client = seedClients.find((c) => c.id === f.clientId);
      const pc: any = client ? { name: client.name, reference: client.reference, country: client.country, email: client.email, phone: client.phone } : undefined;
      const { url, pages } = generateDemoPdf({
        category: f.category, name: f.name, refId: recordIdFor(f.id),
        status: f.status, client: pc,
      });
      return { ...f, blobUrl: url, pages, mime: "application/pdf" };
    }));
  }, []);

  const login = useCallback(() => setAuthed(true), []);
  const logout = useCallback(() => setAuthed(false), []);

  const addClient: AppCtx["addClient"] = useCallback((c) => {
    const newClient: Client = {
      ...c,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      avatarColor: palettes[Math.floor(Math.random() * palettes.length)],
    };
    setClients((p) => [newClient, ...p]);
    setActivity((p) => [{ id: `a${Date.now()}`, text: `New client ${newClient.name} added`, time: "Just now", type: "client" }, ...p]);
    return newClient;
  }, []);

  const updateClient: AppCtx["updateClient"] = useCallback((id, patch) => {
    setClients((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addFile: AppCtx["addFile"] = useCallback(({ file, clientId, category }) => {
    const blobUrl = URL.createObjectURL(file);
    const id = `f${Date.now()}`;
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    const newFile: VaultFile = {
      id, name: file.name, clientId, category,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
      status: "Pending",
      visibility: "Private",
      blobUrl, mime: file.type,
      pages: isImage ? 1 : isPdf ? undefined : 1,
    };
    setFiles((p) => [newFile, ...p]);
    setActivity((p) => [{ id: `a${Date.now()}`, text: `Uploaded ${file.name}`, time: "Just now", type: "upload" }, ...p]);
    if (isPdf) {
      pdfPageCount(file).then((pages) => {
        setFiles((p) => p.map((x) => (x.id === id ? { ...x, pages } : x)));
      });
    }
    return newFile;
  }, []);

  const value = useMemo<AppCtx>(() => ({
    clients, files, activity, authed, login, logout, addClient, updateClient, addFile,
    getClient: (id) => clients.find((c) => c.id === id),
    getFile: (id) => files.find((f) => f.id === id),
    filesForClient: (id) => files.filter((f) => f.clientId === id),
  }), [clients, files, activity, authed, login, logout, addClient, updateClient, addFile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
