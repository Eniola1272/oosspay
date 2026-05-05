"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNaira } from "@/lib/utils";
import { useBalance } from "@/hooks/useBalance";

export function BalanceCard() {
  const { balance, isLoading, refetch } = useBalance();

  return (
    <div className="rounded-2xl bg-linear-to-r from-[#C2185B] to-[#880e4f] p-6 text-white shadow-lg shadow-[#C2185B]/20">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-white/70 text-sm font-medium">Total Savings Balance</p>
          {isLoading ? (
            <Skeleton className="h-10 w-48 bg-white/20" />
          ) : (
            <p className="text-4xl font-extrabold tracking-tight tabular-nums">
              {formatNaira(balance)}
            </p>
          )}
        </div>
        <button onClick={() => refetch()} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="flex gap-3 mt-6">
        <a
          href="#deposit-details"
          className={cn(buttonVariants({ size: "sm" }), "bg-white text-[#C2185B] hover:bg-[#FCE4EC] font-semibold")}
        >
          Save Now
        </a>
        <Link
          href="/withdraw"
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "border-white/40 text-white hover:bg-white/10")}
        >
          Withdraw
        </Link>
      </div>
    </div>
  );
}
