"use client";

import { useAuth } from "@/context/AuthContext";
import { useAdminSidebar } from "./AdminSidebarContext";
import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
}

export function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  const { profile, isSuperAdmin } = useAuth();
  const { collapsed } = useAdminSidebar();

  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB] transition-all duration-300",
      )}
      style={{ marginLeft: collapsed ? 0 : 0 }}
    >
      <div>
        <h1 className="text-xl font-bold text-[#1A1A2E]">{title}</h1>
        {subtitle && <p className="text-sm text-[#999999] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-[#1A1A2E]">{profile?.full_name}</p>
          <p className="text-[10px] text-[#999999]">{isSuperAdmin ? "Super Admin" : "Admin"}</p>
        </div>
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name ?? "Avatar"}
            className="w-9 h-9 rounded-full object-cover border border-[#E0E0E0]"
          />
        ) : (
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold",
            isSuperAdmin ? "bg-amber-500" : "bg-[#C2185B]"
          )}>
            {profile?.full_name?.charAt(0).toUpperCase() ?? "A"}
          </div>
        )}
      </div>
    </div>
  );
}
