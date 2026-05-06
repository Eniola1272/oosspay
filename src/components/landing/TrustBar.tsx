"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ShieldCheck, Users, Zap, BarChart3, Lock, HeartHandshake, Wallet } from "lucide-react";

const stats = [
  { value: 500, suffix: "+", label: "Community Members" },
  { prefix: "₦", value: 25, suffix: "M+", label: "Total Savings Tracked" },
  { value: 100, suffix: "%", label: "Withdrawals Honoured" },
  { value: 24, suffix: "/7", label: "Dashboard Access" },
];

const marqueeFeatures = [
  { icon: Sparkles, label: "People Over Profit" },
  { icon: ShieldCheck, label: "Bank-Grade Security" },
  { icon: Users, label: "Community-Backed" },
  { icon: Zap, label: "Instant Dashboard" },
  { icon: BarChart3, label: "Real-Time Tracking" },
  { icon: Lock, label: "Zero Hidden Fees" },
  { icon: HeartHandshake, label: "Built for Nigerians" },
  { icon: Wallet, label: "Withdraw Anytime" },
];

function useCountUp(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

function StatItem({ prefix = "", value, suffix, label }: { prefix?: string; value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1400, active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-linear-to-br from-[#1A1A2E] to-[#C2185B] bg-clip-text text-transparent tabular-nums">
        {prefix}{count}{suffix}
      </span>
      <span className="text-xs sm:text-sm text-[#1A1A2E]/60 font-medium">{label}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <section className="bg-white border-y border-[#E0E0E0] relative overflow-hidden">
      {/* Marquee strip */}
      <div className="bg-[#1A1A2E] py-3.5 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#1A1A2E] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#1A1A2E] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track animate-marquee">
          {[...marqueeFeatures, ...marqueeFeatures].map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2 px-7 shrink-0">
              <Icon size={14} className="text-[#C2185B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white whitespace-nowrap">
                {label}
              </span>
              <span className="text-[#C2185B] ml-7">&#10022;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="container mx-auto px-4 max-w-6xl py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 divide-x divide-[#E0E0E0]">
          {stats.map((s, i) => (
            <div key={s.label} className={i === 0 ? "" : "px-6"}>
              <StatItem {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
