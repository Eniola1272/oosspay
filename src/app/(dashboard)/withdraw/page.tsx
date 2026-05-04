import type { Metadata } from "next";

export const metadata: Metadata = { title: "Withdraw Funds" };

export default function WithdrawPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Withdraw Funds</h1>
      {/* TODO: WithdrawalForm + past withdrawal requests table */}
    </div>
  );
}
