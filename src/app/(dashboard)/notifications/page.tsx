import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Notifications</h1>
      {/* TODO: List of NotificationItems with mark-all-read action */}
    </div>
  );
}
