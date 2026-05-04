import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 font-bold text-xl", className)}
    >
      <span
        className={cn(
          "tracking-tight",
          variant === "white" ? "text-white" : "text-[#C2185B]"
        )}
      >
        OOSS
        <span className={variant === "white" ? "text-white/80" : "text-[#1A1A2E]"}>
          PAY
        </span>
      </span>
    </Link>
  );
}
