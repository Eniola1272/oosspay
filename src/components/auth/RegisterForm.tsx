"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Mail, Lock, Camera } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

function PasswordStrengthBars({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const segmentColor = (i: number) => {
    if (i > score) return "bg-[#E0E0E0]";
    if (score <= 1) return "bg-[#E74C3C]";
    if (score === 2) return "bg-[#F39C12]";
    return "bg-[#27AE60]";
  };
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-[#666666]">Password strength</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${segmentColor(i)}`} />
        ))}
      </div>
    </div>
  );
}

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

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  }

  async function onSubmit(data: FormData) {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name, phone: "" } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.toLowerCase().includes("already")
        ? "An account with this email already exists."
        : error.message);
      return;
    }
    toast.success(`Welcome to OOSSPAY, ${data.full_name.split(" ")[0]}!`);
    router.push("/onboarding/account-type");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 pb-1">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-full bg-[#EEEEEE] flex items-center justify-center group"
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
            : <User size={32} className="text-[#AAAAAA]" />}
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1A1A2E] flex items-center justify-center shadow">
            <Camera size={12} className="text-white" />
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#1A1A2E]">Create a new account</h1>
          <p className="text-sm text-[#999999] mt-0.5">Enter your details to register.</p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <IconInput
          icon={User}
          placeholder="John Doe"
          error={!!errors.full_name}
          {...register("full_name")}
        />
        {errors.full_name && <p className="text-xs text-[#E74C3C] pl-1">{errors.full_name.message}</p>}
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
            placeholder="Create a strong password"
            className="flex-1 text-sm text-[#333333] placeholder:text-[#BBBBBB] outline-none bg-transparent"
            {...register("password")}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="text-[#999999] hover:text-[#666666]">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-[#999999] pl-1">Must contain 1 uppercase letter, 1 number, min. 8 characters</p>
        <PasswordStrengthBars password={password} />
        {errors.password && <p className="text-xs text-[#E74C3C] pl-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Sign Up"}
      </button>

      {/* Terms */}
      <p className="text-center text-xs text-[#999999] leading-relaxed">
        By clicking Register, you agree to accept{" "}
        <strong className="text-[#1A1A2E]">OOSSPAY Financial&apos;s</strong>{" "}
        <Link href="/terms" className="text-[#C2185B] hover:underline">Terms and Condition</Link>
      </p>
    </form>
  );
}
