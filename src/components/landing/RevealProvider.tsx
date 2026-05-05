"use client";

import { useReveal } from "@/hooks/useReveal";

export function RevealProvider({ children }: { children: React.ReactNode }) {
  useReveal();
  return <>{children}</>;
}
