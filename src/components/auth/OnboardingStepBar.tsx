"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

const STEPS = [
  { label: "Email",        paths: ["/onboarding/email-sent", "/onboarding/email-verified"] },
  { label: "Account Type", paths: ["/onboarding/account-type"] },
  { label: "Country",      paths: ["/onboarding/country"] },
  { label: "Phone",        paths: ["/onboarding/phone"] },
];

export function OnboardingStepBar() {
  const pathname = usePathname();

  const currentIndex = STEPS.findIndex((s) => s.paths.some((p) => pathname.startsWith(p)));

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white border-b border-[#E0E0E0]">
      <Logo size="md" />

      <nav className="flex items-center gap-2">
        {STEPS.map((step, i) => {
          const isComplete = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  isComplete
                    ? "border-[#27AE60] bg-[#27AE60]/10 text-[#27AE60]"
                    : isActive
                    ? "border-[#1A1A2E] text-[#1A1A2E]"
                    : "border-[#DDDDDD] text-[#BBBBBB]"
                }`}
              >
                {isComplete ? (
                  <Check size={11} />
                ) : (
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${isActive ? "border-[#1A1A2E] text-[#1A1A2E]" : "border-[#DDDDDD] text-[#BBBBBB]"}`}>
                    {i + 1}
                  </span>
                )}
                {step.label}
              </div>
              {i < STEPS.length - 1 && <span className="text-[#DDDDDD] text-xs">›</span>}
            </div>
          );
        })}
      </nav>

      <Link href="/dashboard" className="text-xs text-[#999999] hover:text-[#666666] transition-colors">
        Skip for now →
      </Link>
    </header>
  );
}
