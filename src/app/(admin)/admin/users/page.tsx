import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Users</h1>
      {/* TODO: UserTable with search and pagination */}
    </div>
  );
}
