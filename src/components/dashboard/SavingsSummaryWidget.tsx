"use client";

import Link from "next/link";
import { Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "./ProgressRing";
import { useSavingsTargets } from "@/hooks/useSavingsTargets";
import { formatNaira, getSavingsProgress } from "@/lib/utils";

export function SavingsSummaryWidget() {
  const { targets, isLoading } = useSavingsTargets();

  const active = targets.filter((t) => t.status === "active");
  const completed = targets.filter((t) => t.status === "completed");
  const top = active.slice(0, 2);

  const totalTarget = active.reduce((s, t) => s + t.target_amount, 0);
  const totalSaved  = active.reduce((s, t) => s + t.current_amount, 0);
  const overallPct  = totalTarget > 0 ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FCE4EC] flex items-center justify-center">
            <Target size={16} className="text-[#C2185B]" />
          </div>
          <p className="text-sm font-bold text-[#1A1A2E]">Savings Targets</p>
        </div>
        <Link href="/dashboard/savings" className="text-xs text-[#C2185B] font-semibold hover:underline">
          View All →
        </Link>
      </div>

      {/* Overall progress ring */}
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ) : active.length === 0 ? (
        <div className="text-center py-4 space-y-2">
          <Target size={32} className="text-[#C2185B]/30 mx-auto" />
          <p className="text-xs text-[#999999]">No active targets yet.</p>
          <Link
            href="/dashboard/savings"
            className="inline-block text-xs font-bold text-white bg-[#C2185B] hover:bg-[#a31545] px-4 py-1.5 rounded-lg transition-colors"
          >
            Create Your First Target
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Overall */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#F0F0F0]">
            <ProgressRing percentage={overallPct} size={56} strokeWidth={6} />
            <div>
              <p className="text-xs text-[#999999]">Overall progress</p>
              <p className="text-sm font-bold text-[#1A1A2E]">
                {formatNaira(totalSaved)}
                <span className="text-[#999999] font-normal"> / {formatNaira(totalTarget)}</span>
              </p>
              {completed.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-[#27AE60] mt-0.5">
                  <CheckCircle2 size={10} />
                  {completed.length} target{completed.length > 1 ? "s" : ""} completed
                </div>
              )}
            </div>
          </div>

          {/* Top active targets */}
          {top.map((t) => {
            const pct = getSavingsProgress(t.current_amount, t.target_amount);
            return (
              <div key={t.id} className="flex items-center gap-3">
                <ProgressRing percentage={pct} size={40} strokeWidth={4} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A2E] truncate">{t.name}</p>
                  <p className="text-[10px] text-[#999999]">
                    {formatNaira(t.current_amount)} of {formatNaira(t.target_amount)}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#C2185B]">{pct}%</span>
              </div>
            );
          })}

          {active.length > 2 && (
            <p className="text-[10px] text-[#999999] text-center">
              +{active.length - 2} more active target{active.length - 2 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
