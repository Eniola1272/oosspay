import { BellRing, TrendingUp, Wallet, Megaphone, Star } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { AppNotification } from "@/types";

const iconMap = {
  info: BellRing,
  deposit: TrendingUp,
  withdrawal: Wallet,
  announcement: Megaphone,
  target: Star,
};

const colorMap = {
  info: "text-blue-500 bg-blue-50",
  deposit: "text-[#27AE60] bg-[#27AE60]/10",
  withdrawal: "text-[#C2185B] bg-[#FCE4EC]",
  announcement: "text-[#F39C12] bg-[#F39C12]/10",
  target: "text-[#b7950b] bg-[#F1C40F]/10",
};

interface Props {
  notification: AppNotification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: Props) {
  const Icon = iconMap[notification.type] ?? BellRing;
  const colors = colorMap[notification.type] ?? "text-[#666666] bg-[#FAFAFA]";

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 border-b border-[#E0E0E0] last:border-0 transition-colors ${
        !notification.is_read ? "bg-[#FCE4EC]/20" : "bg-white"
      } ${onClick ? "cursor-pointer hover:bg-[#FAFAFA]" : ""}`}
    >
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-[#C2185B] shrink-0 mt-1.5" />
      )}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colors} ${notification.is_read ? "ml-5" : ""}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1A1A2E]">{notification.title}</p>
        <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">{notification.message}</p>
        <p className="text-[10px] text-[#666666]/70 mt-1">{formatDateTime(notification.created_at)}</p>
      </div>
    </div>
  );
}
