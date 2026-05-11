"use client";

import Link from "next/link";
import { Bell, BellOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

export function NotificationsPreviewWidget() {
  const { notifications, unreadCount, isLoading } = useNotifications();
  const preview = notifications.filter((n) => !n.is_read).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#1A1A2E]">Notifications</p>
          {unreadCount > 0 && (
            <span className="bg-[#C2185B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        <Link href="/dashboard/notifications" className="text-xs text-[#C2185B] font-semibold hover:underline">
          View All
        </Link>
      </div>

      {isLoading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-2.5 w-full" />
            </div>
          </div>
        ))
      ) : preview.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <BellOff size={28} className="text-[#999999]/30 mx-auto" />
          <p className="text-xs text-[#999999]">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F5F5F5] -mx-5">
          {preview.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}
    </div>
  );
}
