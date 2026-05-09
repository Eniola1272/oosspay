"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail } from "lucide-react";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <Mail size={28} className="text-[#27AE60]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#27AE60] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Email Verified</h1>
          <p className="text-sm text-[#999999] text-center leading-relaxed">
            Your email address{" "}
            <strong className="text-[#1A1A2E]">{profile?.email ?? "your email"}</strong> has been verified. In the
            future, you need to use this email address when logging in to OOSSPAY.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
