"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import { formatNaira, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

function TxRow({ tx }: { tx: Transaction }) {
  const isDeposit = tx.type === "deposit";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F5] last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isDeposit ? "bg-[#27AE60]/10" : "bg-[#E74C3C]/10"
      }`}>
        {isDeposit
          ? <ArrowDownLeft size={15} className="text-[#27AE60]" />
          : <ArrowUpRight  size={15} className="text-[#E74C3C]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1A1A2E] truncate">
          {tx.description ?? (isDeposit ? "Savings Deposit" : "Withdrawal")}
        </p>
        <p className="text-[10px] text-[#999999]">{formatDate(tx.created_at)}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold tabular-nums ${isDeposit ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
          {isDeposit ? "+" : "−"}{formatNaira(tx.amount)}
        </p>
        {tx.status === "pending" && (
          <span className="text-[10px] text-[#F39C12] font-medium">Pending</span>
        )}
      </div>
    </div>
  );
}

export function RecentActivityWidget() {
  const { transactions, isLoading } = useTransactions(7);

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#1A1A2E]">Recent Activity</p>
        <Link href="/withdraw" className="text-xs text-[#C2185B] font-semibold hover:underline">
          View Full History →
        </Link>
      </div>

      <div>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[#F5F5F5]">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Inbox size={32} className="text-[#999999]/30 mx-auto" />
            <p className="text-xs text-[#999999]">No transactions yet. Make your first deposit to get started!</p>
          </div>
        ) : (
          transactions.map((tx) => <TxRow key={tx.id} tx={tx} />)
        )}
      </div>
    </div>
  );
}
