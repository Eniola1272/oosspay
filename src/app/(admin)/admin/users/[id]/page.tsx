import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Detail" };

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">User Detail</h1>
      {/* TODO: Profile summary, BalanceUpdateForm, transaction history for user {params.id} */}
      <p className="text-sm text-muted-foreground">User ID: {params.id}</p>
    </div>
  );
}
