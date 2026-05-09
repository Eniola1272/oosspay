"use client";

import { Search, Bell, SlidersHorizontal, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { ExchangeRateDrawer } from "./ExchangeRateDrawer";

const TIME_FILTERS = ["12M", "1M", "7D", "24H"] as const;
type TimeFilter = typeof TIME_FILTERS[number];

interface DashboardTopBarProps {
  title?: string;
  subtitle?: string;
}

export function DashboardTopBar({ title, subtitle }: DashboardTopBarProps) {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("1M");
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <>
      <div className="flex items-start justify-between px-6 pt-6 pb-4 bg-white border-b border-[#EBEBEB]">
        {/* Left: title + time filters */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">{title ?? "Your Financial Dashboard"}</h1>
            {subtitle && <p className="text-sm text-[#999999] mt-0.5">{subtitle}</p>}
            {!subtitle && (
              <p className="text-sm text-[#999999] mt-0.5">Welcome back, {firstName}!</p>
            )}
          </div>
          {/* Time filters */}
          <div className="flex gap-1">
            {TIME_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeFilter === f
                    ? "bg-[#F0F0F0] text-[#1A1A2E] font-semibold"
                    : "text-[#999999] hover:text-[#666666]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 pt-1">
          <button className="w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666] transition-colors">
            <Search size={18} />
          </button>
          <button className="relative w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666] transition-colors">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C2185B] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setExchangeOpen(true)}
            className="px-3 h-9 rounded-lg border border-[#E0E0E0] text-xs font-medium text-[#333333] hover:border-[#BBBBBB] transition-colors"
          >
            Exchange Rate
          </button>

          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[#E0E0E0] text-xs font-medium text-[#333333] hover:border-[#BBBBBB] transition-colors">
            <CalendarDays size={14} />
            <span>8 Feb – 15 Feb</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[#E0E0E0] text-xs font-medium text-[#333333] hover:border-[#BBBBBB] transition-colors">
            <SlidersHorizontal size={14} />
            Filter
          </button>
        </div>
      </div>

      <ExchangeRateDrawer open={exchangeOpen} onClose={() => setExchangeOpen(false)} />
    </>
  );
}
