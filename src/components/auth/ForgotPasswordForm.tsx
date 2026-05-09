"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSentEmail(data.email);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#27AE60]/10 flex items-center justify-center">
          <CheckCircle size={32} className="text-[#27AE60]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">Check your email</h2>
          <p className="text-sm text-[#999999] mt-1 leading-relaxed">
            We&apos;ve sent a reset link to <strong className="text-[#1A1A2E]">{sentEmail}</strong>.
            Click the link to create a new password.
          </p>
        </div>
        <button
          onClick={() => setSent(false)}
          className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors"
        >
          Send it again
        </button>
        <Link href="/login" className="text-xs text-[#C2185B] hover:underline">← Back to Log In</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 pb-1">
        <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
          <Lock size={24} className="text-[#999999]" />
        </div>
        <h1 className="text-xl font-bold text-[#1A1A2E]">Forgot Your Password</h1>
        <p className="text-sm text-[#999999] text-center leading-relaxed">
          Enter your email and we will send you a link to reset your password.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <div className={`flex items-center gap-3 border rounded-xl px-4 h-12 bg-white focus-within:ring-2 focus-within:ring-[#C2185B]/30 transition-shadow ${errors.email ? "border-[#E74C3C]" : "border-[#E0E0E0]"}`}>
          <Mail size={16} className="text-[#999999] shrink-0" />
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 text-sm text-[#333333] placeholder:text-[#BBBBBB] outline-none bg-transparent"
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-xs text-[#E74C3C] pl-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send Email"}
      </button>

      <p className="text-center text-xs text-[#999999]">
        <Link href="/login" className="text-[#C2185B] hover:underline">← Back to Log In</Link>
      </p>
    </form>
  );
}
