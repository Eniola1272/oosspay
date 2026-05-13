"use client";

import { ArrowUp, ArrowDown, Settings, TrendingUp } from "lucide-react";
import { useBalance } from "@/hooks/useBalance";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function fmt(n: number) {
  return new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function MyBalanceWidget() {
  const { balance, isLoading } = useBalance();

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A2E]">
          <span>🏦</span> My Balance
        </div>
        <button className="text-[#999999] hover:text-[#666666]">
          <Settings size={15} />
        </button>
      </div>

      {/* Currency */}
      <div className="flex items-center gap-1.5 text-sm text-[#666666]">
        <span>Nigerian Naira</span>
        <span className="text-base">🇳🇬</span>
      </div>

      {/* Balance amount */}
      {isLoading ? (
        <Skeleton className="h-10 w-48" />
      ) : (
        <p className="text-4xl font-bold text-[#1A1A2E] tabular-nums tracking-tight">
          ₦{fmt(balance ?? 0)}
        </p>
      )}

      {/* % change */}
      <div className="flex items-center gap-1 text-sm text-[#27AE60]">
        <TrendingUp size={14} />
        <span className="font-semibold">15.43%</span>
        <span className="text-[#999999]">than last month</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Link
          href="/dashboard/withdraw"
          className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white text-sm font-semibold transition-colors"
        >
          <ArrowUp size={15} /> Send
        </Link>
        <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#F5F5F5] text-sm font-semibold transition-colors">
          <ArrowDown size={15} /> Request
        </button>
      </div>
    </div>
  );
}
