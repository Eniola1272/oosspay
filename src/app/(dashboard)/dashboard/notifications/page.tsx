"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";
import { createClient } from "@/lib/supabase/client";
import type { AppNotification, NotificationType } from "@/types";

const TABS: { label: string; value: "all" | NotificationType }[] = [
  { label: "All", value: "all" },
  { label: "Deposits", value: "deposit" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Announcements", value: "announcement" },
];

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, refetch, markAllRead } = useNotifications();
  const [tab, setTab] = useState<"all" | NotificationType>("all");
  const supabase = createClient();

  const filtered = tab === "all" ? notifications : notifications.filter((n) => n.type === tab);

  async function markRead(n: AppNotification) {
    if (n.is_read) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("notifications").update({ is_read: true }).eq("id", n.id);
    refetch();
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      <DashboardTopBar title="Notifications" subtitle="Stay up to date with your savings activity." />
      <div className="p-5 lg:p-6 space-y-5">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="bg-[#C2185B] text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadCount} unread</span>
          <Button variant="outline" size="sm" onClick={markAllRead} className="border-[#C2185B] text-[#C2185B]">
            Mark All as Read
          </Button>
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-[#FAFAFA] border border-[#E0E0E0] flex-wrap h-auto gap-1 p-1">
          {TABS.map(({ label, value }) => (
            <TabsTrigger key={value} value={value}
              className="text-xs data-[state=active]:bg-[#C2185B] data-[state=active]:text-white">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-2xl border border-[#E0E0E0] overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-[#E0E0E0]">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="p-4 flex gap-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Bell size={40} className="text-[#666666]/30 mx-auto" />
            <p className="font-medium text-[#1A1A2E]">No Notifications Yet</p>
            <p className="text-sm text-[#666666]">
              When your savings are updated or your withdrawal is processed, you&apos;ll see it here.
            </p>
          </div>
        ) : (
          filtered.map((n) => <NotificationItem key={n.id} notification={n} onClick={() => markRead(n)} />)
        )}
      </div>
      </div>
    </div>
  );
}
