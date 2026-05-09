"use client";

import { useState } from "react";
import { X, ArrowLeftRight, ChevronDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "United States Dollar" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "GHS", flag: "🇬🇭", name: "Ghanaian Cedi" },
  { code: "KES", flag: "🇰🇪", name: "Kenyan Shilling" },
];

const CHART_DATA = [
  { d: "31 Jan", v: 20000 }, { d: "2 Feb", v: 25000 }, { d: "5 Feb", v: 22000 },
  { d: "8 Feb", v: 30000 }, { d: "11 Feb", v: 28000 }, { d: "14 Feb", v: 38000 },
  { d: "Today", v: 45000 },
];

function CurrencySelect({
  value,
  onChange,
}: {
  value: typeof CURRENCIES[0];
  onChange: (c: typeof CURRENCIES[0]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 h-12 border border-[#E0E0E0] rounded-xl bg-white text-sm text-[#333333] hover:border-[#BBBBBB] transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{value.flag}</span>
          {value.name}
        </span>
        <ChevronDown size={16} className={`text-[#999999] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { onChange(c); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#F5F5F5] transition-colors ${value.code === c.code ? "bg-[#F5F5F5] font-medium" : "text-[#333333]"}`}
            >
              <span className="text-lg">{c.flag}</span>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ExchangeRateDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ExchangeRateDrawer({ open, onClose }: ExchangeRateDrawerProps) {
  const [from, setFrom] = useState(CURRENCIES[0]);
  const [to, setTo] = useState(CURRENCIES[3]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB]">
          <h2 className="text-lg font-bold text-[#1A1A2E]">Exchange Rate</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666]">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Change currency label */}
          <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest">Change Currency</p>

          {/* From */}
          <CurrencySelect value={from} onChange={setFrom} />

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={() => { const t = from; setFrom(to); setTo(t); }}
              className="w-9 h-9 rounded-full border border-[#E0E0E0] bg-white hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666] transition-colors"
            >
              <ArrowLeftRight size={16} />
            </button>
          </div>

          {/* To */}
          <CurrencySelect value={to} onChange={setTo} />

          {/* Detail section */}
          <div className="space-y-3 pt-1">
            <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest">Detail Currency</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A1A2E]">Movements</span>
              <span className="w-4 h-4 rounded-full bg-[#27AE60] flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            {/* Line chart */}
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C2185B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#C2185B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#AAAAAA" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    formatter={(v) => [`₦${Number(v).toLocaleString()}`, from.code]}
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#C2185B"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#C2185B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-xs text-[#999999]">
              <span>31 Jan</span>
              <span className="font-semibold text-[#1A1A2E]">Today</span>
            </div>

            <div className="space-y-2 text-sm border-t border-[#F0F0F0] pt-3">
              <div className="flex justify-between">
                <span className="text-[#666666]">Per 1 {from.code}</span>
                <span className="text-[#999999]">Per 1 Currency</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Tax</span>
                <span className="font-semibold text-[#1A1A2E]">2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Exchange Fee</span>
                <span className="font-semibold text-[#1A1A2E]">1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <button className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors">
            Change
          </button>
        </div>
      </div>
    </>
  );
}
