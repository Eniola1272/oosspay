"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";

export default function PhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!phone.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push("/onboarding/verify");
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
            <Phone size={22} className="text-[#AAAAAA]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E] text-center">Verify your phone number with a code</h1>
          <p className="text-sm text-[#999999] text-center">It helps your account to keep secure.</p>
        </div>

        {/* Phone input */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#333333]">Phone Number</p>
          <div className="flex items-center gap-2 border border-[#E0E0E0] rounded-xl px-4 h-12 focus-within:ring-2 focus-within:ring-[#C2185B]/30 bg-white">
            <span className="text-base">🇳🇬</span>
            <span className="text-sm text-[#666666] font-medium">+234</span>
            <div className="w-px h-5 bg-[#E0E0E0]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080 1234 5678"
              className="flex-1 text-sm text-[#333333] placeholder:text-[#BBBBBB] outline-none bg-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading || !phone.trim()}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60"
        >
          {loading ? "Sending code…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
