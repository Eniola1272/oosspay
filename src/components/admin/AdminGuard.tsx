"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isSuperAdmin, isLoading, profile } = useAuth();

  const allowed = pathname.startsWith("/dashboard/super-admin")
    ? isSuperAdmin
    : isAdmin;

  useEffect(() => {
    if (isLoading || !profile || allowed) return;
    router.replace("/dashboard");
  }, [allowed, isLoading, profile, router]);

  if (isLoading || !profile) {
    return <div className="min-h-screen bg-[#F5F6FA]" />;
  }

  if (!allowed) {
    return <div className="min-h-screen bg-[#F5F6FA]" />;
  }

  return <>{children}</>;
}
