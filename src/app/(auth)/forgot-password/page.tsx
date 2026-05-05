import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = { title: "Reset Password — OOSSPAY" };

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#FCE4EC]/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo showTagline />
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Reset Your Password</h1>
            <p className="text-sm text-[#666666] text-center">
              Enter the email address you used to register. We&apos;ll send you a link to create a new password.
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
