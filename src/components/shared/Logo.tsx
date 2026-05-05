"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "colored" | "white";
  showTagline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { text: "text-lg", tagline: "text-[10px]" },
  md: { text: "text-2xl", tagline: "text-xs" },
  lg: { text: "text-3xl", tagline: "text-sm" },
};

export function Logo({ size = "md", variant = "colored", showTagline = false, className }: LogoProps) {
  const s = sizeMap[size];
  const isWhite = variant === "white";

  return (
    <Link href="/" className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-extrabold tracking-tight", s.text)}>
        <span className={isWhite ? "text-white" : "text-[#C2185B]"}>OOSS</span>
        <span className={isWhite ? "text-white/70" : "text-[#1A1A2E]"}>PAY</span>
      </span>
      {showTagline && (
        <span className={cn("font-medium tracking-wide uppercase mt-0.5", s.tagline, isWhite ? "text-white/50" : "text-[#666666]")}>
          Powered by OOSS
        </span>
      )}
    </Link>
  );
}
