export type ClientStatus = "Active" | "Inactive" | "Pending";
export type FileCategory = "Identity" | "Travel" | "Agreement" | "Medical" | "Company Letter" | "Other";
export type FileStatus = "Pending" | "Reviewed" | "Approved" | "Rejected";

export interface Client {
  id: string;
  name: string;
  reference: string;
  country: string;
  phone: string;
  email: string;
  status: ClientStatus;
  avatarColor: string;
  notes?: string;
  createdAt: string;
}

export interface VaultFile {
  id: string;
  name: string;
  clientId: string;
  category: FileCategory;
  size: string;
  uploadedAt: string;
  status: FileStatus;
  visibility: "Private" | "Shared";
  /** browser blob URL when uploaded locally */
  blobUrl?: string;
  mime?: string;
  isDemo?: boolean;
}

export interface Activity {
  id: string;
  text: string;
  time: string;
  type: "upload" | "review" | "client" | "verify";
}
