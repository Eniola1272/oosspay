import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">My Profile</h1>
      {/* TODO: Profile form (name, phone, bank details) using profileSchema */}
    </div>
  );
}
