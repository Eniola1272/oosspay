import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Admin Overview</h1>
      {/* TODO: Summary stats — total users, total savings, pending withdrawals */}
    </div>
  );
}
