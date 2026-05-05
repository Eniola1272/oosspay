"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira, formatDate } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import type { Transaction } from "@/types";
import Link from "next/link";

function TransactionRow({ tx }: { tx: Transaction }) {
  const isDeposit = tx.type === "deposit";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#E0E0E0] last:border-0">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDeposit ? "bg-[#27AE60]/10" : "bg-[#E74C3C]/10"}`}>
        {isDeposit
          ? <ArrowDownLeft size={16} className="text-[#27AE60]" />
          : <ArrowUpRight size={16} className="text-[#E74C3C]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A2E] truncate">{tx.description ?? (isDeposit ? "Savings deposit" : "Withdrawal")}</p>
        <p className="text-xs text-[#666666]">{formatDate(tx.created_at)}</p>
      </div>
      <span className={`font-bold text-sm tabular-nums ${isDeposit ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
        {isDeposit ? "+" : "-"}{formatNaira(tx.amount)}
      </span>
    </div>
  );
}

export function TransactionList({ limit = 5 }: { limit?: number }) {
  const { transactions, isLoading } = useTransactions(limit);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-medium text-[#1A1A2E]">No transactions yet</p>
        <p className="text-sm text-[#666666] mt-1">Make your first deposit to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
      <Link href="/withdraw" className="block text-center text-sm text-[#C2185B] hover:underline mt-4 font-medium">
        View Full History →
      </Link>
    </div>
  );
}
