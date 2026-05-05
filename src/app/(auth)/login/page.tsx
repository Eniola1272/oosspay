import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = { title: "Log In — OOSSPAY" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FCE4EC]/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo showTagline />
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Welcome Back</h1>
            <p className="text-sm text-[#666666] text-center">
              Log in to your OOSSPAY dashboard and check on your savings.
            </p>
          </div>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-[#666666] mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#C2185B] hover:underline">Create one free</Link>
        </p>
      </div>
    </main>
  );
}
