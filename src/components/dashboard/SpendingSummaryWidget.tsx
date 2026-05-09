"use client";

import { Info, ChevronDown } from "lucide-react";
import { useBalance } from "@/hooks/useBalance";

function GaugeChart({ percent }: { percent: number }) {
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * r; // half circle
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#F0F0F0"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Progress (outcome – pink/wine) */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#C2185B"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      {/* Tick marks */}
      {Array.from({ length: 25 }).map((_, i) => {
        const angle = -180 + (i / 24) * 180;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + (r + 2) * Math.cos(rad);
        const y1 = cy + (r + 2) * Math.sin(rad);
        const x2 = cx + (r + 8) * Math.cos(rad);
        const y2 = cy + (r + 8) * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E0E0E0" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

export function SpendingSummaryWidget() {
  const { balance } = useBalance();
  const spent = balance ? Math.min(balance * 0.26, 99999) : 16654450;
  const weeklyLimit = 2000;
  const gaugePercent = Math.min(60, (spent / weeklyLimit) * 10);

  function fmt(n: number) {
    return new Intl.NumberFormat("en-NG", { minimumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A2E]">
          <span>🕐</span> Spending Summary
        </div>
        <button className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#333333]">
          More Option <ChevronDown size={13} />
        </button>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <GaugeChart percent={gaugePercent} />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <p className="text-[10px] text-[#999999]">Spent</p>
            <p className="text-lg font-bold text-[#1A1A2E] tabular-nums">₦{fmt(spent)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        {[
          { color: "#1A1A2E", label: "Outcome" },
          { color: "#BBBBBB", label: "Income" },
          { color: "#E0E0E0", label: "Others" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[#666666]">{label}</span>
          </div>
        ))}
      </div>

      {/* Weekly limit note */}
      <div className="flex items-center justify-between text-xs bg-[#FFF8F1] rounded-lg px-3 py-2">
        <p className="text-[#666666]">
          Your weekly spending limit is{" "}
          <span className="font-bold text-[#C2185B]">₦{weeklyLimit.toLocaleString()}</span>
        </p>
        <Info size={13} className="text-[#AAAAAA]" />
      </div>
    </div>
  );
}
