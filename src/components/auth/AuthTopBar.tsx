"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

export function AuthTopBar() {
  const pathname = usePathname();

  const rightSlot = pathname === "/register"
    ? { label: "Have an account?", link: "/login", linkLabel: "Login" }
    : pathname === "/login"
    ? { label: "New here?", link: "/register", linkLabel: "Sign Up" }
    : null;

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-[#E0E0E0]">
      <Logo size="md" />
      {rightSlot && (
        <p className="text-sm text-[#666666]">
          {rightSlot.label}{" "}
          <Link href={rightSlot.link} className="font-bold text-[#1A1A2E] hover:text-[#C2185B] transition-colors">
            {rightSlot.linkLabel}
          </Link>
        </p>
      )}
    </header>
  );
}
