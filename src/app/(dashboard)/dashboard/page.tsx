import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Overview</h1>
      {/* TODO: BalanceCard, recent TransactionList, active SavingsTargetCards */}
    </div>
  );
}
