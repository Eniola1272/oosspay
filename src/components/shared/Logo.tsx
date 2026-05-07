"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "colored" | "white";
  showTagline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { mark: 24, text: "text-base", tagline: "text-[9px]" },
  md: { mark: 32, text: "text-lg", tagline: "text-[10px]" },
  lg: { mark: 40, text: "text-2xl", tagline: "text-xs" },
};

export function Logo({ size = "md", variant = "colored", showTagline = false, className }: LogoProps) {
  const s = sizeMap[size];
  const isWhite = variant === "white";

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 leading-none", className)}>
      <span
        className="relative shrink-0 inline-block"
        style={{ width: s.mark, height: s.mark }}
      >
        <Image
          src="/images/oosspay-logo.png"
          alt="OOSSPAY"
          fill
          sizes={`${s.mark}px`}
          priority
          className="object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-extrabold tracking-tight", s.text)}>
          <span className={isWhite ? "text-white" : "text-[#C2185B]"}>OOSS</span>
          <span className={isWhite ? "text-white/70" : "text-[#1A1A2E]"}>PAY</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-medium tracking-wide uppercase mt-0.5",
              s.tagline,
              isWhite ? "text-white/50" : "text-[#666666]"
            )}
          >
            Powered by OOSS
          </span>
        )}
      </span>
    </Link>
  );
}
