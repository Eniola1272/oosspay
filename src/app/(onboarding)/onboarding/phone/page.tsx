"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function PhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Normalise local Nigerian input to international format
  function normalise(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("234")) return `+${digits}`;
    if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
    return `+234${digits}`;
  }

  async function handleSave() {
    if (!phone.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("profiles")
        .update({ phone: normalise(phone) })
        .eq("id", user.id);
      if (error) {
        toast.error("Couldn't save phone number. You can add it later in Profile settings.");
      }
    }
    setLoading(false);
    router.push("/dashboard");
  }

  const isValid = phone.replace(/\D/g, "").length >= 10;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
            <Phone size={22} className="text-[#AAAAAA]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E] text-center">Add your phone number</h1>
          <p className="text-sm text-[#999999] text-center">
            We&apos;ll use this to reach you about your savings activity.
          </p>
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
              placeholder="0801 234 5678"
              className="flex-1 text-sm text-[#333333] placeholder:text-[#BBBBBB] outline-none bg-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !isValid}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? "Saving…" : <><span>Continue to Dashboard</span><ArrowRight size={16} /></>}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full text-center text-sm text-[#999999] hover:text-[#666666] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
