import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = { title: "Create Your Account — OOSSPAY" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FCE4EC]/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo showTagline />
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Join the OOSSPAY Community</h1>
            <p className="text-sm text-[#666666] text-center">
              Create your free account and start your journey to financial discipline. It takes less than 2 minutes.
            </p>
          </div>
          <RegisterForm />
        </div>
        <p className="text-center text-xs text-[#666666] mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C2185B] hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
