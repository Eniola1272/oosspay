"use client";

import { CalendarDays, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressRing } from "./ProgressRing";
import { formatNaira, formatDate, getSavingsProgress } from "@/lib/utils";
import type { SavingsTarget } from "@/types";

const statusColors: Record<string, string> = {
  active: "bg-[#27AE60]/10 text-[#27AE60]",
  completed: "bg-[#F1C40F]/10 text-[#b7950b]",
  cancelled: "bg-[#666666]/10 text-[#666666]",
};

export function SavingsTargetCard({
  target,
  onEdit,
  onDelete,
}: {
  target: SavingsTarget;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const progress = getSavingsProgress(target.current_amount, target.target_amount);
  const remaining = target.target_amount - target.current_amount;

  const daysLeft = target.deadline
    ? Math.max(0, Math.ceil((new Date(target.deadline).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 hover:shadow-md transition-shadow space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-[#1A1A2E] text-base leading-tight flex-1 min-w-0 truncate">{target.name}</h3>
        <Badge className={`text-[10px] shrink-0 ${statusColors[target.status] ?? ""}`}>
          {target.status.charAt(0).toUpperCase() + target.status.slice(1)}
        </Badge>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="shrink-0 p-1 rounded-lg text-[#999999] hover:text-[#1A1A2E] hover:bg-[#F5F5F5] transition-colors outline-none">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onEdit}>
                  <Pencil size={13} /> Edit target
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-[#E74C3C] focus:text-[#E74C3C]"
                  onClick={onDelete}
                >
                  <Trash2 size={13} /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
