import type { Metadata } from "next";

export const metadata: Metadata = { title: "Savings Targets" };

export default function SavingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Savings Targets</h1>
      {/* TODO: List of SavingsTargetCards + create target button */}
    </div>
  );
}
