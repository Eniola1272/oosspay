"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/types";

type Tab = "Income" | "Outcome" | "Pending";

function TxRow({ tx }: { tx: Transaction }) {
  const isDeposit = tx.type === "deposit";
  const isPending = tx.status === "pending";

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${isDeposit ? "bg-[#27AE60]" : "bg-[#C2185B]"}`}>
          {tx.description?.charAt(0).toUpperCase() ?? (isDeposit ? "D" : "W")}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1A1A2E] truncate max-w-[140px]">
            {tx.description ?? (isDeposit ? "Deposit" : "Withdrawal")}
          </p>
          <p className="text-xs text-[#999999]">
            {new Date(tx.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold tabular-nums ${isDeposit ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
          {isDeposit ? "+" : "-"}₦{tx.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </p>
        {isPending && (
          <span className="text-[10px] text-[#F39C12] font-medium">Pending</span>
        )}
      </div>
    </div>
  );
}

export function RecentTransactionsPanel() {
  const { transactions, isLoading } = useTransactions(10);
  const [tab, setTab] = useState<Tab>("Outcome");

  const filtered = transactions.filter((tx) => {
    if (tab === "Income") return tx.type === "deposit" && tx.status !== "pending";
    if (tab === "Outcome") return tx.type === "withdrawal" && tx.status !== "pending";
    return tx.status === "pending";
  });

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1A1A2E]">
          <span>↻</span> Recent Transactions
        </div>
        <span className="text-xs text-[#999999]">Last Week</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#EBEBEB]">
        {(["Income", "Outcome", "Pending"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-medium pb-2 transition-colors ${
              tab === t ? "text-[#1A1A2E] border-b-2 border-[#1A1A2E]" : "text-[#AAAAAA] hover:text-[#666666]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 mb-2 rounded-lg" />)
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[#999999] text-center py-6">No {tab.toLowerCase()} transactions yet.</p>
        ) : (
          filtered.slice(0, 4).map((tx) => <TxRow key={tx.id} tx={tx} />)
        )}
      </div>

      <Link href="/dashboard/transactions" className="block text-center text-sm font-semibold text-[#C2185B] hover:underline">
        See All →
      </Link>
    </div>
  );
}
