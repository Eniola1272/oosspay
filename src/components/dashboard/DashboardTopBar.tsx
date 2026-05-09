"use client";

import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { getGreeting } from "@/lib/utils";

interface DashboardTopBarProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export function DashboardTopBar({ title, subtitle, showGreeting = false }: DashboardTopBarProps) {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB]">
      {/* Left: title / greeting */}
      <div>
        {showGreeting ? (
          <>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              {getGreeting()}, {firstName}! 🌟
            </h1>
            <p className="text-sm text-[#999999] mt-0.5">
              Here&apos;s a snapshot of your savings journey.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[#1A1A2E]">{title ?? "Dashboard"}</h1>
            {subtitle && <p className="text-sm text-[#999999] mt-0.5">{subtitle}</p>}
          </>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666] transition-colors">
          <Search size={18} />
        </button>
        <Link
          href="/notifications"
          className="relative w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666] transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C2185B] rounded-full" />
          )}
        </Link>
      </div>
    </div>
  );
}
