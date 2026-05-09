"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Check } from "lucide-react";

type AccountType = "personal" | "business";

const options: { type: AccountType; label: string; desc: string; icon: React.ElementType }[] = [
  { type: "personal", label: "Personal Account", desc: "For individual use", icon: User },
  { type: "business", label: "Business Account", desc: "For company use", icon: Briefcase },
];

export default function AccountTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AccountType>("personal");

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
            <User size={24} className="text-[#AAAAAA]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E] text-center">
            What kind of account would you open today?
          </h1>
          <p className="text-sm text-[#999999] text-center">You can add another account later on, too.</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map(({ type, label, desc, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelected(type)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all ${
                selected === type ? "border-[#1A1A2E]" : "border-[#E0E0E0] hover:border-[#BBBBBB]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-[#999999]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{label}</p>
                  <p className="text-xs text-[#999999]">{desc}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                selected === type ? "bg-[#1A1A2E] border-[#1A1A2E]" : "border-[#CCCCCC]"
              }`}>
                {selected === type && <Check size={12} className="text-white" />}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push("/onboarding/country")}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
