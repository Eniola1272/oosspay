"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, ChevronDown } from "lucide-react";

const COUNTRIES = [
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "SG", flag: "🇸🇬", name: "Singapore" },
];

export default function CountryPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
            <Flag size={22} className="text-[#AAAAAA]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E] text-center">Your country of primary residence</h1>
          <p className="text-sm text-[#999999] text-center">You can add another account later on, too.</p>
        </div>

        {/* Country selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#333333]">Choose Country</p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between px-4 h-12 border border-[#E0E0E0] rounded-xl bg-white text-sm text-[#333333] hover:border-[#BBBBBB] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{selected.flag}</span>
                {selected.name}
              </span>
              <ChevronDown size={16} className={`text-[#999999] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute z-10 top-full mt-1 w-full bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { setSelected(c); setOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#F5F5F5] transition-colors ${selected.code === c.code ? "bg-[#F5F5F5] font-medium" : "text-[#333333]"}`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push("/onboarding/phone")}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
