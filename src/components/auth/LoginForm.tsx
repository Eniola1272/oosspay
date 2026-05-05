"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
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

    // Redirect admin to /admin, regular users to /dashboard
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", authData.user.id).single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((profile as any)?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-1">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")}
          className={errors.email ? "border-[#E74C3C]" : ""} />
        {errors.email && <p className="text-xs text-[#E74C3C]">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPw ? "text" : "password"} placeholder="Enter your password"
            {...register("password")} className={`pr-10 ${errors.password ? "border-[#E74C3C]" : ""}`} />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-[#E74C3C]">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
          <label htmlFor="remember" className="text-sm text-[#666666] cursor-pointer">Remember me</label>
        </div>
        <Link href="/forgot-password" className="text-sm text-[#C2185B] hover:underline">
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#C2185B] hover:bg-[#a31545] text-white h-11">
        {loading ? "Logging in…" : "Log In"}
      </Button>

      <p className="text-center text-sm text-[#666666]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#C2185B] font-medium hover:underline">Create one free</Link>
      </p>
    </form>
  );
}
