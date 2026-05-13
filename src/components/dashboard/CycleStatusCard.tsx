"use client";

import { useEffect, useState } from "react";
import { Lock, Unlock, Calendar, AlertTriangle } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { PENALTY_RATE } from "@/lib/savingsCycle";

interface CycleData {
  hasStarted: boolean;
  isInFreeWindow: boolean;
  daysUntilFreeWindow: number;
  daysLeftInCycle: number;
  cycleEnd: string;
  freeWindowStart: string;
  cycleNumber: number;
  penaltyRate: number;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function CycleStatusCard({ withdrawAmount = 0 }: { withdrawAmount?: number }) {
  const [data, setData] = useState<CycleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/savings-cycle")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-20 rounded-2xl bg-[#F5F5F5] animate-pulse" />
    );
  }

  if (!data || !data.hasStarted) {
    return (
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 text-sm text-blue-800">
        <Calendar size={15} className="shrink-0 mt-0.5 text-blue-500" />
        <p>
          Your savings cycle begins when your first deposit is confirmed. After that, a{" "}
          <strong>3-month lock window</strong> applies: withdrawals before the final 7 days attract a{" "}
          <strong>{(PENALTY_RATE * 100).toFixed(1)}% penalty</strong>.
        </p>
      </div>
    );
  }

  const penaltyAmt = withdrawAmount > 0 ? Math.round(withdrawAmount * data.penaltyRate * 100) / 100 : 0;
  const payoutAmt = withdrawAmount > 0 ? withdrawAmount - penaltyAmt : 0;

  if (data.isInFreeWindow) {
    return (
      <div className="bg-[#27AE60]/8 border border-[#27AE60]/25 rounded-2xl px-4 py-4 space-y-1">
        <div className="flex items-center gap-2">
          <Unlock size={15} className="text-[#27AE60] shrink-0" />
          <p className="font-semibold text-sm text-[#1a6e3a]">Withdrawal Day: No penalty!</p>
        </div>
        <p className="text-xs text-[#555] pl-5">
          You are in the free withdrawal window (Cycle {data.cycleNumber}). This window closes on{" "}
          <strong>{fmt(data.cycleEnd)}</strong>, with {data.daysLeftInCycle} day{data.daysLeftInCycle !== 1 ? "s" : ""} left.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 space-y-2">
      <div className="flex items-center gap-2">
        <Lock size={15} className="text-amber-600 shrink-0" />
        <p className="font-semibold text-sm text-amber-900">
          Savings locked: {data.daysUntilFreeWindow} day{data.daysUntilFreeWindow !== 1 ? "s" : ""} until Withdrawal Day
        </p>
      </div>
      <p className="text-xs text-amber-800 pl-5">
        Cycle {data.cycleNumber} free window opens <strong>{fmt(data.freeWindowStart)}</strong> and closes{" "}
        <strong>{fmt(data.cycleEnd)}</strong>. Withdrawing now attracts a{" "}
        <strong>{(data.penaltyRate * 100).toFixed(1)}% early penalty</strong>.
      </p>
      {withdrawAmount > 0 && (
        <div className="ml-5 mt-1 flex items-start gap-2 bg-amber-100 border border-amber-300 rounded-xl px-3 py-2">
          <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900">
            Penalty on <strong>{formatNaira(withdrawAmount)}</strong>:{" "}
            <strong className="text-[#E74C3C]">−{formatNaira(penaltyAmt)}</strong>.{" "}
            You will receive <strong>{formatNaira(payoutAmt)}</strong> to your bank account.
          </p>
        </div>
      )}
    </div>
  );
}
