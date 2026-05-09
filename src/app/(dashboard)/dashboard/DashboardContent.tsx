"use client";

import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { DepositAccountWidget } from "@/components/dashboard/DepositAccountWidget";
import { SavingsSummaryWidget } from "@/components/dashboard/SavingsSummaryWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { NotificationsPreviewWidget } from "@/components/dashboard/NotificationsPreviewWidget";

export function DashboardContent() {
  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      {/* Top bar */}
      <DashboardTopBar showGreeting />

      {/* Page content */}
      <div className="flex-1 p-5 lg:p-6 space-y-5">

        {/* Row 1: 3-column grid — Balance (hero) | Deposit Account | Savings Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <BalanceCard />
          <DepositAccountWidget />
          <SavingsSummaryWidget />
        </div>

        {/* Row 2: 3-column grid — Recent Activity (wide) | Notifications Preview (narrow) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <RecentActivityWidget />
          </div>
          <NotificationsPreviewWidget />
        </div>

      </div>
    </div>
  );
}
