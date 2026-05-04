import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-[#1A1A2E]">Reset your password</h1>
          <p className="mt-2 text-sm text-[#666666]">We will send a reset link to your email</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
