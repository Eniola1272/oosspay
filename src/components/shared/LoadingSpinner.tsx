import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-2", lg: "h-12 w-12 border-4" };

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-[#C2185B] border-t-transparent", sizeMap[size], className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
      <p className="text-sm text-[#666666] animate-pulse">Loading…</p>
    </div>
  );
}
