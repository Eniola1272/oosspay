import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-linear-to-br from-white via-[#FCE4EC]/30 to-white pt-16"
    >
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">
              Powered by OOSS • People First Economic Community
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A2E] leading-tight">
              Your Wealth Starts With Your{" "}
              <span className="text-[#C2185B]">Community</span>
            </h1>
            <p className="text-lg text-[#666666] leading-relaxed max-w-xl">
              OOSSPAY is a people-first savings platform built to help you save consistently, hit your financial targets, and grow alongside a community that puts your wealth above everything else.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "bg-[#C2185B] hover:bg-[#a31545] text-white text-base px-8 shadow-lg shadow-[#C2185B]/30")}
              >
                Start Saving Today <ArrowRight size={18} className="ml-2" />
              </Link>
              <a
                href="#how-it-works"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-[#C2185B] text-[#C2185B] hover:bg-[#FCE4EC] text-base px-8")}
              >
                See How It Works <ChevronDown size={18} className="ml-2" />
              </a>
            </div>
            <p className="text-sm text-[#666666] flex items-center gap-2">
              <span className="flex -space-x-2">
                {["EA", "NG", "CK", "AB"].map((initials) => (
                  <span
                    key={initials}
                    className="w-7 h-7 rounded-full bg-[#C2185B] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white"
                  >
                    {initials}
                  </span>
                ))}
              </span>
              Join <strong className="text-[#1A1A2E]">500+</strong> members already saving with OOSSPAY
            </p>
          </div>

          {/* Visual */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-[420px] h-[420px]">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#C2185B]/10 to-[#FCE4EC] animate-pulse" />
              <div className="absolute inset-6 rounded-full bg-linear-to-br from-[#C2185B]/20 to-[#FCE4EC]/80" />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <div className="bg-white rounded-2xl shadow-xl p-5 w-64">
                  <p className="text-xs text-[#666666] mb-1">Total Savings</p>
                  <p className="text-3xl font-extrabold text-[#1A1A2E]">₦150,000<span className="text-lg">.00</span></p>
                  <div className="mt-3 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#27AE60] rounded-full w-3/4 transition-all" />
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1">75% of your ₦200,000 goal</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-3 w-52 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#27AE60]/10 flex items-center justify-center">
                    <span className="text-[#27AE60] font-bold text-sm">+</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1A1A2E]">Deposit Confirmed</p>
                    <p className="text-[11px] text-[#666666]">₦25,000 added</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
