import type { Metadata } from "next";

export const metadata: Metadata = { title: "Platform Settings" };

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Platform Settings</h1>
      {/* TODO: DepositAccountForm (bank details) + AnnouncementForm */}
    </div>
  );
}
