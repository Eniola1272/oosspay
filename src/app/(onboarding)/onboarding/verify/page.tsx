"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";

const CODE_LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    if (digit && i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  async function handleContinue() {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/onboarding/email-sent");
  }

  const isFull = digits.every((d) => d !== "");

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
            <FileText size={22} className="text-[#AAAAAA]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Enter 6 digit code</h1>
          <p className="text-sm text-[#999999] text-center">
            We sent it to your phone number.{" "}
            <Link href="/onboarding/phone" className="text-[#C2185B] hover:underline">Change</Link>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#333333]">Your digit 6 code</p>
          <div className="flex items-center justify-center gap-2">
            {digits.map((d, i) => (
              <div key={i} className="flex items-center">
                <input
                  ref={(el) => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-bold text-[#1A1A2E] border-2 rounded-xl outline-none focus:border-[#1A1A2E] border-[#E0E0E0] bg-white transition-colors"
                />
                {i === 2 && (
                  <div className="mx-1 h-8 border-l-2 border-dashed border-[#CCCCCC]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!isFull || loading}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Continue"}
        </button>

        <p className="text-center text-sm">
          <button
            type="button"
            onClick={() => router.push("/onboarding/phone")}
            className="text-[#C2185B] hover:underline text-sm"
          >
            Didn&apos;t receive a code?
          </button>
        </p>
      </div>
    </div>
  );
}
