"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { toast } from "sonner";

function IconInput({
  icon: Icon,
  error,
  ...props
}: { icon: React.ElementType; error?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex items-center gap-3 border rounded-xl px-4 h-12 bg-white focus-within:ring-2 focus-within:ring-[#C2185B]/30 transition-shadow ${error ? "border-[#E74C3C]" : "border-[#E0E0E0]"}`}>
      <Icon size={16} className="text-[#999999] shrink-0" />
      <input
        className="flex-1 text-sm text-[#333333] placeholder:text-[#BBBBBB] outline-none bg-transparent"
        {...props}
      />
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) { toast.error("Invalid email or password. Please try again."); return; }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", authData.user.id).single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push((profile as any)?.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 pb-1">
        <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
          <LogIn size={24} className="text-[#999999]" />
        </div>
        <h1 className="text-xl font-bold text-[#1A1A2E]">Welcome back</h1>
        <p className="text-sm text-[#999999]">Log in to your OOSSPAY account.</p>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <IconInput
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          error={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-[#E74C3C] pl-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className={`flex items-center gap-3 border rounded-xl px-4 h-12 bg-white focus-within:ring-2 focus-within:ring-[#C2185B]/30 transition-shadow ${errors.password ? "border-[#E74C3C]" : "border-[#E0E0E0]"}`}>
          <Lock size={16} className="text-[#999999] shrink-0" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            className="flex-1 text-sm text-[#333333] placeholder:text-[#BBBBBB] outline-none bg-transparent"
            {...register("password")}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="text-[#999999] hover:text-[#666666]">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-[#E74C3C] pl-1">{errors.password.message}</p>}
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-[#C2185B] hover:underline">
          Forgot your password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log In"}
      </button>

      {/* Register link */}
      <p className="text-center text-xs text-[#999999]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-[#1A1A2E] hover:text-[#C2185B] transition-colors">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
