import type { Metadata } from "next";

export const metadata: Metadata = { title: "Withdrawal Requests" };

export default function AdminWithdrawalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Withdrawal Requests</h1>
      {/* TODO: Filterable list of WithdrawalApprovalCards grouped by status */}
    </div>
  );
}
