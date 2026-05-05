"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="text-center space-y-4 w-full">
        <div className="w-16 h-16 rounded-full bg-[#27AE60]/10 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-[#27AE60]" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A2E]">Check Your Email</h2>
        <p className="text-[#666666] text-sm leading-relaxed">
          We&apos;ve sent a password reset link to{" "}
          <strong className="text-[#1A1A2E]">{sentEmail}</strong>.
          Check your inbox (and spam folder) and click the link to create a new password.
        </p>
        <p className="text-xs text-[#666666]">Didn&apos;t receive it? Wait 60 seconds and try again.</p>
        <Button variant="outline" onClick={() => setSent(false)} className="border-[#C2185B] text-[#C2185B]">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-1">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")}
          className={errors.email ? "border-[#E74C3C]" : ""} />
        {errors.email && <p className="text-xs text-[#E74C3C]">{errors.email.message}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#C2185B] hover:bg-[#a31545] text-white h-11">
        {loading ? "Sending…" : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-[#666666]">
        <Link href="/login" className="text-[#C2185B] hover:underline">← Back to Log In</Link>
      </p>
    </form>
  );
}
