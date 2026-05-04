import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-[#1A1A2E]">Create your account</h1>
          <p className="mt-2 text-sm text-[#666666]">Join thousands of Nigerians saving smarter</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
