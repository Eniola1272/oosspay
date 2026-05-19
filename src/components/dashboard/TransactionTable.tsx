"use client";

import { useState } from "react";
import { MoreHorizontal, CreditCard, Landmark, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/types";

const PAGE_SIZE = 5;

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const map = {
    completed: "bg-[#27AE60]/10 text-[#27AE60]",
    pending: "bg-[#F39C12]/10 text-[#F39C12]",
    failed: "bg-[#E74C3C]/10 text-[#E74C3C]",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PaymentIcon({ type }: { type: Transaction["type"] }) {
  return type === "deposit"
    ? <Landmark size={16} className="text-[#999999]" />
    : <CreditCard size={16} className="text-[#999999]" />;
}

function Pager({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;

  const visible: (number | "…")[] = [];
  if (pages <= 5) {
    for (let i = 1; i <= pages; i++) visible.push(i);
  } else {
    visible.push(1);
    if (page > 3) visible.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) visible.push(i);
    if (page < pages - 2) visible.push("…");
    visible.push(pages);
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F5]">
      <p className="text-xs text-[#999999]">Page {page} of {pages}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 rounded flex items-center justify-center text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>
        {visible.map((v, i) =>
          v === "…" ? (
            <span key={`el${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-[#999999]">…</span>
          ) : (
            <button
              key={v}
              onClick={() => onPage(v as number)}
              className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                page === v ? "bg-[#1A1A2E] text-white" : "text-[#666666] hover:bg-[#F5F5F5]"
              }`}
            >
              {v}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          className="w-7 h-7 rounded flex items-center justify-center text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function TransactionTable() {
  const { transactions, isLoading } = useTransactions(100);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((t) => t.id)));
    }
  }

  const headers = ["To / From", "Amount", "Status", "Date & Time", "Payment", "Actions"];

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">

      {/* Mobile card list */}
      <div className="lg:hidden divide-y divide-[#F5F5F5]">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="px-4 py-3">
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          : paginated.length === 0
          ? (
            <div className="px-4 py-10 text-center text-sm text-[#999999]">
              No transactions found.
            </div>
          )
          : paginated.map((tx) => {
              const isDeposit = tx.type === "deposit";
              const initials = tx.description?.charAt(0).toUpperCase() ?? (isDeposit ? "D" : "W");
              const name = tx.description ?? (isDeposit ? "Deposit" : "Withdrawal");
              const date = new Date(tx.created_at);
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${isDeposit ? "bg-[#27AE60]" : "bg-[#C2185B]"}`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">{name}</p>
                    <p className="text-xs text-[#AAAAAA]">
                      {date.toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                      {" · "}
                      {date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold tabular-nums ${isDeposit ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
                      {isDeposit ? "+" : "-"}₦{tx.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              );
            })}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F0F0F0]">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-[#1A1A2E] cursor-pointer"
                />
              </th>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#999999] whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    {h}
                    {h !== "Actions" && (
                      <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="opacity-40">
                        <path d="M4 0L7 4H1L4 0ZM4 10L1 6H7L4 10Z" fill="#666" />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5]">
                    <td colSpan={7} className="px-4 py-3">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              : paginated.length === 0
              ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#999999]">
                    No transactions found.
                  </td>
                </tr>
              )
              : paginated.map((tx) => {
                  const isDeposit = tx.type === "deposit";
                  const initials = tx.description?.charAt(0).toUpperCase() ?? (isDeposit ? "D" : "W");
                  const name = tx.description ?? (isDeposit ? "Deposit" : "Withdrawal");
                  const date = new Date(tx.created_at);

                  return (
                    <tr key={tx.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                      <td className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(tx.id)}
                          onChange={() => toggleRow(tx.id)}
                          className="w-4 h-4 accent-[#1A1A2E] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isDeposit ? "bg-[#27AE60]" : "bg-[#C2185B]"}`}>
                            {initials}
                          </div>
                          <span className="font-medium text-[#1A1A2E] truncate max-w-[120px]">{name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold tabular-nums ${isDeposit ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
                          {isDeposit ? "+" : "-"}₦{tx.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-4 py-3 text-[#666666]">
                        <p className="font-medium">{date.toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p className="text-xs text-[#AAAAAA]">{date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</p>
                      </td>
                      <td className="px-4 py-3">
                        <PaymentIcon type={tx.type} />
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-[#999999] hover:text-[#666666]">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      <div className="px-5 pb-4 border-t border-[#F5F5F5]">
        <Pager page={page} total={transactions.length} onPage={setPage} />
      </div>
    </div>
  );
}
