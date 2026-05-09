"use client";

import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { MyBalanceWidget } from "@/components/dashboard/MyBalanceWidget";
import { MyCardsWidget } from "@/components/dashboard/MyCardsWidget";
import { SpendingSummaryWidget } from "@/components/dashboard/SpendingSummaryWidget";
import { BudgetOverviewWidget } from "@/components/dashboard/BudgetOverviewWidget";
import { RecentTransactionsPanel } from "@/components/dashboard/RecentTransactionsPanel";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { SupportChatWidget } from "@/components/dashboard/SupportChatWidget";

export function DashboardContent() {
  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      {/* Top bar */}
      <DashboardTopBar />

      {/* Main content */}
      <div className="flex-1 p-5 lg:p-6 space-y-6">
        {/* Row 1: Balance | Cards | Spending Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <MyBalanceWidget />
          <MyCardsWidget />
          <SpendingSummaryWidget />
        </div>

        {/* Row 2: Budget Overview (wide) | Recent Transactions (narrow) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <BudgetOverviewWidget />
          </div>
          <RecentTransactionsPanel />
        </div>

        {/* Row 3: Full-width transaction table */}
        <TransactionTable />
      </div>

      {/* Support chat */}
      <SupportChatWidget />
    </div>
  );
}
