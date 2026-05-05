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
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { toast } from "sonner";

function PasswordStrength({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-[#E74C3C]", "bg-[#F39C12]", "bg-[#27AE60]", "bg-[#27AE60]"];
  if (!password) return null;
  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-[#E0E0E0]"}`} />
        ))}
      </div>
      <p className="text-xs text-[#666666]">{labels[score]}</p>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  async function onSubmit(data: RegisterInput) {
    if (!agreed) { toast.error("Please agree to the Terms of Service to continue."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name, phone: data.phone ?? "" } },
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        toast.error("An account with this email already exists. Log in instead?");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(`Welcome to OOSSPAY, ${data.full_name.split(" ")[0]}! Your savings journey starts now.`);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-1">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" placeholder="Enter your full name" {...register("full_name")}
          className={errors.full_name ? "border-[#E74C3C]" : ""} />
        {errors.full_name && <p className="text-xs text-[#E74C3C]">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")}
          className={errors.email ? "border-[#E74C3C]" : ""} />
        {errors.email && <p className="text-xs text-[#E74C3C]">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="08012345678" {...register("phone")}
          className={errors.phone ? "border-[#E74C3C]" : ""} />
        {errors.phone && <p className="text-xs text-[#E74C3C]">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPw ? "text" : "password"} placeholder="Create a strong password"
            {...register("password")} className={`pr-10 ${errors.password ? "border-[#E74C3C]" : ""}`} />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <PasswordStrength password={password} />
        {errors.password && <p className="text-xs text-[#E74C3C]">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <div className="relative">
          <Input id="confirm_password" type={showConfirm ? "text" : "password"} placeholder="Confirm your password"
            {...register("confirm_password")} className={`pr-10 ${errors.confirm_password ? "border-[#E74C3C]" : ""}`} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirm_password && <p className="text-xs text-[#E74C3C]">{errors.confirm_password.message}</p>}
      </div>

      <div className="flex items-start gap-2 pt-1">
        <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
        <label htmlFor="terms" className="text-sm text-[#666666] leading-relaxed cursor-pointer">
          I agree to the{" "}
          <Link href="/terms" className="text-[#C2185B] hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#C2185B] hover:underline">Privacy Policy</Link>
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#C2185B] hover:bg-[#a31545] text-white h-11">
        {loading ? "Creating your account…" : "Create My Account"}
      </Button>

      <p className="text-center text-sm text-[#666666]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#C2185B] font-medium hover:underline">Log in</Link>
      </p>

      <p className="text-center text-xs text-[#666666]">
        Join 500+ Nigerians already saving with OOSSPAY
      </p>
    </form>
  );
}
