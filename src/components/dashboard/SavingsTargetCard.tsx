"use client";

import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "./ProgressRing";
import { formatNaira, formatDate, getSavingsProgress } from "@/lib/utils";
import type { SavingsTarget } from "@/types";

const statusColors: Record<string, string> = {
  active: "bg-[#27AE60]/10 text-[#27AE60]",
  completed: "bg-[#F1C40F]/10 text-[#b7950b]",
  cancelled: "bg-[#666666]/10 text-[#666666]",
};

export function SavingsTargetCard({ target }: { target: SavingsTarget }) {
  const progress = getSavingsProgress(target.current_amount, target.target_amount);
  const remaining = target.target_amount - target.current_amount;

  const daysLeft = target.deadline
    ? Math.max(0, Math.ceil((new Date(target.deadline).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 hover:shadow-md transition-shadow space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-[#1A1A2E] text-base leading-tight">{target.name}</h3>
        <Badge className={`text-[10px] shrink-0 ${statusColors[target.status] ?? ""}`}>
          {target.status.charAt(0).toUpperCase() + target.status.slice(1)}
        </Badge>
      </div>

      <div className="flex items-center gap-5">
        <ProgressRing percentage={progress} size={72} strokeWidth={7} />
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1A2E] tabular-nums">
            {formatNaira(target.current_amount)}
            <span className="text-[#666666] font-normal"> of {formatNaira(target.target_amount)}</span>
          </p>
          {remaining > 0 && (
            <p className="text-xs text-[#666666]">{formatNaira(remaining)} remaining</p>
          )}
          {target.deadline && (
            <div className="flex items-center gap-1 text-xs text-[#666666]">
              <CalendarDays size={11} />
              Due {formatDate(target.deadline)}
              {daysLeft !== null && (
                <span className="text-[#F39C12] font-medium ml-1">({daysLeft}d left)</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SavingsTargetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 space-y-4 animate-pulse">
      <div className="h-5 bg-[#E0E0E0] rounded w-2/3" />
      <div className="flex items-center gap-5">
        <div className="w-18 h-18 rounded-full bg-[#E0E0E0]" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-[#E0E0E0] rounded w-full" />
          <div className="h-3 bg-[#E0E0E0] rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
