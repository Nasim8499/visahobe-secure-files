export const recordIdFor = (fileId: string) =>
  `VH-${fileId.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-6).padStart(6, "0")}`;
