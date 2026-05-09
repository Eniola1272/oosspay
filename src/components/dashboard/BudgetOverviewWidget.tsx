"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";

const DATA = [
  { month: "JUN", income: 22000, outcome: 18000 },
  { month: "JUN", income: 18000, outcome: 14000 },
  { month: "JUL", income: 30000, outcome: 25000 },
  { month: "AUG", income: 26000, outcome: 20000 },
  { month: "SEP", income: 42000, outcome: 38000 },
  { month: "OCT", income: 35000, outcome: 30000 },
  { month: "NOV", income: 48000, outcome: 22000 },
  { month: "NOV", income: 15000, outcome: 12000 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value: number; name: string}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A2E] text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name}>{p.name}: ₦{p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export function BudgetOverviewWidget() {
  const totalIncome = 17843.33;
  const totalExpense = 14256.55;

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#1A1A2E]">Budget Overview</span>
          <div className="flex items-center gap-2 text-xs text-[#666666]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1A1A2E] inline-block" />Outcome</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C2185B] inline-block" />Income</span>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#27AE60]" title="Live" />
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-[#999999] mb-0.5">
            Income <ArrowDown size={11} className="text-[#27AE60]" />
          </div>
          <p className="text-lg font-bold text-[#1A1A2E] tabular-nums">
            ₦{totalIncome.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-[#999999] mb-0.5">
            Expense <ArrowUp size={11} className="text-[#E74C3C]" />
          </div>
          <p className="text-lg font-bold text-[#1A1A2E] tabular-nums">
            ₦{totalExpense.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} barSize={8} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#AAAAAA" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#AAAAAA" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Bar dataKey="outcome" fill="#1A1A2E" radius={[3, 3, 0, 0]} name="Outcome" />
            <Bar dataKey="income" fill="#C2185B" radius={[3, 3, 0, 0]} name="Income" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
