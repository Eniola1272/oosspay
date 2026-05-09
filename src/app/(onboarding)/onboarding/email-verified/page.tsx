"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle } from "lucide-react";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const { profile } = useAuth();

  // Clean up the pending email we stored during registration
  useEffect(() => {
    sessionStorage.removeItem("pending_email");
  }, []);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8 space-y-6">
        {/* Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <CheckCircle size={32} className="text-[#27AE60]" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Email Verified!</h1>
          <p className="text-sm text-[#999999] text-center leading-relaxed">
            {profile?.email
              ? <>
                  <strong className="text-[#1A1A2E]">{profile.email}</strong> has been verified.
                </>
              : "Your email address has been verified."}{" "}
            Let&apos;s finish setting up your account.
          </p>
        </div>

        <button
          onClick={() => router.push("/onboarding/account-type")}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
