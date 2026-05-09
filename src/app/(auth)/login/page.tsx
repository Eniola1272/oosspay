import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log In — OOSSPAY" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-[#E0E0E0] p-8">
        <LoginForm />
      </div>
    </div>
  );
}
