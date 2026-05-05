"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Community Members" },
  { prefix: "₦", value: 10, suffix: "M+", label: "Total Savings Tracked" },
  { value: 100, suffix: "%", label: "Withdrawal Requests Honoured" },
  { value: 24, suffix: "/7", label: "Dashboard Access" },
];

function useCountUp(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

function StatItem({ prefix = "", value, suffix, label }: { prefix?: string; value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1200, active);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); observer.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-3xl md:text-4xl font-extrabold text-[#C2185B]">
        {prefix}{count}{suffix}
      </span>
      <span className="text-sm text-[#666666] text-center">{label}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <section className="bg-white border-y border-[#E0E0E0] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
