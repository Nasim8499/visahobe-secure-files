import { Navigate } from "react-router-dom";
import { useApp } from "@/lib/store";
import AppLayout from "./AppLayout";
import { ReactNode } from "react";

export default function Protected({ children }: { children: ReactNode }) {
  const { authed } = useApp();
  if (!authed) return <Navigate to="/" replace />;
  return <AppLayout>{children}</AppLayout>;
}
