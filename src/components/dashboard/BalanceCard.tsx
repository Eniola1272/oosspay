"use client";

import Link from "next/link";
import { RefreshCw, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useBalance } from "@/hooks/useBalance";
import { formatNaira } from "@/lib/utils";

export function BalanceCard() {
  const { balance, isLoading, refetch } = useBalance();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#C2185B] via-[#8e1244] to-[#4A0820] p-6 text-white shadow-lg shadow-[#C2185B]/20 flex flex-col justify-between min-h-[220px]">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Total Savings Balance</p>
          {isLoading ? (
            <Skeleton className="h-11 w-52 bg-white/20 rounded-lg" />
          ) : (
            <p className="text-4xl font-extrabold tracking-tight tabular-nums leading-none">
              {formatNaira(balance)}
            </p>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Refresh balance"
        >
          <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-4 mt-auto pt-5">
        <div className="flex gap-3">
          <Link
            href="/dashboard/deposit"
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white text-[#C2185B] text-sm font-bold hover:bg-[#FCE4EC] transition-colors"
          >
            <ArrowDownLeft size={15} /> Save Now
          </Link>
          <Link
            href="/dashboard/withdraw"
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            <ArrowUpRight size={15} /> Withdraw
          </Link>
        </div>
        <p className="text-right text-[10px] text-white/40">
          Last updated: {timeStr}
        </p>
      </div>
    </div>
  );
}
