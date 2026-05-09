"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useBalance } from "@/hooks/useBalance";

type CardTab = "Virtual" | "Physical";

export function MyCardsWidget() {
  const { balance } = useBalance();
  const [tab, setTab] = useState<CardTab>("Virtual");
  const [showBalance, setShowBalance] = useState(true);

  const displayBalance = balance != null
    ? new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2 }).format(balance)
    : "—";

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1A2E]">My Cards</span>
        <button className="flex items-center gap-1 text-xs text-[#C2185B] font-medium hover:underline">
          <Plus size={13} /> More Option
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#EBEBEB] pb-1">
        {(["Virtual", "Physical"] as CardTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-medium pb-1 transition-colors ${
              tab === t
                ? "text-[#1A1A2E] border-b-2 border-[#1A1A2E]"
                : "text-[#999999] hover:text-[#666666]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Card visual */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#1A1A2E] via-[#2d2d50] to-[#1A1A2E] p-5 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

        {/* Chip */}
        <div className="w-8 h-6 bg-[#F39C12]/80 rounded-sm mb-4 relative z-10">
          <div className="absolute inset-0 grid grid-cols-2 gap-[1px] p-0.5">
            <div className="bg-[#F39C12]/60 rounded-[1px]" />
            <div className="bg-[#F39C12]/60 rounded-[1px]" />
            <div className="bg-[#F39C12]/60 rounded-[1px]" />
            <div className="bg-[#F39C12]/60 rounded-[1px]" />
          </div>
        </div>

        {/* Balance */}
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-white/60 mb-0.5">
            <span>Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-white/50 hover:text-white/80">
              {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          </div>
          <p className="text-xl font-bold tabular-nums">
            {showBalance ? `₦${displayBalance}` : "••••••"}
          </p>
        </div>

        {/* VISA */}
        <div className="flex justify-between items-end mt-4 relative z-10">
          <p className="text-[10px] text-white/40 tracking-widest">•••• •••• •••• 4832</p>
          <span className="text-lg font-black tracking-tighter text-white/90">VISA</span>
        </div>
      </div>

      {tab === "Physical" && (
        <p className="text-xs text-center text-[#999999]">No physical card linked yet.</p>
      )}
    </div>
  );
}
