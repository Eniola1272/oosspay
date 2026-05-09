"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function EmailSentPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("pending_email");
    if (stored) setEmail(stored);
  }, []);

  // Count down the resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function resend() {
    if (!email || cooldown > 0) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email re-sent. Check your inbox.");
      setCooldown(60);
    }
  }

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
          <h1 className="text-xl font-bold text-[#1A1A2E]">Check your email</h1>
          <p className="text-sm text-[#999999] text-center leading-relaxed">
            We&apos;ve sent a confirmation link to{" "}
            <strong className="text-[#1A1A2E]">{email || "your email address"}</strong>.
            Click the link to verify your account and continue.
          </p>
        </div>

        <button
          onClick={resend}
          disabled={loading || cooldown > 0 || !email}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60"
        >
          {loading
            ? "Sending…"
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend confirmation email"}
        </button>

        <p className="text-center text-xs text-[#999999]">
          Wrong email?{" "}
          <a href="/register" className="text-[#C2185B] hover:underline">
            Sign up again
          </a>
        </p>
      </div>
    </div>
  );
}
