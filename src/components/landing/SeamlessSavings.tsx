import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, BarChart3, Lock, Zap } from "lucide-react";

export function SeamlessSavings() {
  return (
    <section id="seamless" className="relative bg-white py-24 overflow-hidden">
      <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-[#FCE4EC]/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section header */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B] mb-4">
              Built For Real Life
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A2E] leading-[1.02] tracking-[-0.02em]">
              Seamless Savings.<br />
              <span className="text-[#C2185B]">Safer Loans.</span>
            </h2>
          </div>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 self-start md:self-end bg-[#1A1A2E] hover:bg-[#C2185B] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap"
          >
            Start Saving Today
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Left column: 2 stacked cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
            {/* Dark wine card -- No Registration Fees */}
            <div className="reveal relative overflow-hidden bg-mesh-wine rounded-3xl p-7 min-h-[420px] flex flex-col justify-between text-white group">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#C2185B]/30 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-6">
                  <Lock size={12} className="text-[#FCE4EC]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">Zero Friction</span>
                </div>

                {/* Tiny app card mockup */}
                <div className="bg-white/95 rounded-2xl p-3 shadow-2xl w-48 mb-6 transform group-hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Sign-up Cost</p>
                    <span className="text-[9px] font-bold text-[#27AE60]">FREE</span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1A1A2E] tabular-nums">&#8358;0.00</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex-1 h-1 rounded-full bg-[#27AE60]" />
                    <span className="text-[9px] font-bold text-[#27AE60]">No fees &middot; ever</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <h3 className="text-3xl font-extrabold leading-tight mb-3">
                  No Registration Fees
                </h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-[260px]">
                  Open your savings account in under 2 minutes. No sign-up cost, no hidden charges, no minimum balance &mdash; just a clear path to your goals.
                </p>
              </div>
            </div>

            {/* Pink gradient card -- Grow With Clarity */}
            <div className="reveal relative overflow-hidden bg-linear-to-br from-[#C2185B] via-[#a01549] to-[#4A0820] rounded-3xl p-7 min-h-[420px] flex flex-col justify-between text-white group" data-reveal-delay="120">
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[#FCE4EC]/20 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 mb-6">
                  <Sparkles size={12} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Crystal Clear</span>
                </div>

                {/* Mini analytics card */}
                <div className="bg-white/95 rounded-2xl p-3 w-full max-w-[240px] mb-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">6-Month Growth</p>
                    <BarChart3 size={11} className="text-[#C2185B]" />
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {[30, 45, 35, 60, 75, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-linear-to-t from-[#C2185B] to-[#FCE4EC]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[9px] font-bold">
                    <span className="text-gray-500">Apr</span>
                    <span className="text-[#27AE60]">&uarr; 217%</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <h3 className="text-3xl font-extrabold leading-tight mb-3">
                  Grow with clarity,<br />not confusion
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-5 max-w-[260px]">
                  Real-time dashboards, transparent transactions, and progress trackers that show exactly where every naira stands.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors"
                >
                  Learn More
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column: One tall card -- Safer Loans / Trust */}
          <div className="reveal lg:col-span-2 relative overflow-hidden bg-[#FCE4EC] rounded-3xl p-7 min-h-[420px] flex flex-col justify-between group" data-reveal-delay="240">
            <div className="absolute inset-0 bg-linear-to-br from-[#FCE4EC] via-[#FCE4EC] to-white pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C2185B]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-64 h-64 rounded-full bg-[#4A0820]/8 blur-3xl pointer-events-none" />

            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-2 border-dashed border-[#C2185B]/20 animate-spin-slow pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#C2185B]/20 rounded-full px-3 py-1.5 mb-6">
                <ShieldCheck size={12} className="text-[#C2185B]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C2185B]">Coming Soon</span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A2E] leading-[1.05] mb-4 tracking-tight">
                Borrow safely.<br />
                <span className="text-[#C2185B]">When the time is right.</span>
              </h3>
              <p className="text-sm text-[#1A1A2E]/60 leading-relaxed mb-6 max-w-[280px]">
                Once you&apos;ve built a savings track record, OOSSPAY unlocks community-backed micro-loans with humane terms &mdash; no predatory rates, ever.
              </p>
            </div>

            <div className="relative space-y-2.5">
              {[
                { icon: ShieldCheck, label: "Community-backed" },
                { icon: Zap, label: "24-hour disbursement" },
                { icon: Lock, label: "Transparent terms" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white">
                  <div className="w-7 h-7 rounded-lg bg-[#C2185B]/10 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-[#C2185B]" />
                  </div>
                  <p className="text-xs font-bold text-[#1A1A2E]">{label}</p>
                </div>
              ))}

              <div className="flex items-center justify-between mt-5 pt-5 border-t border-[#C2185B]/15">
                <div>
                  <p className="text-[9px] text-[#1A1A2E]/50 uppercase tracking-wider font-semibold">Avg APR</p>
                  <p className="text-2xl font-extrabold text-[#C2185B] tabular-nums">5.4%</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-[#1A1A2E]/50 uppercase tracking-wider font-semibold">Default Rate</p>
                  <p className="text-2xl font-extrabold text-[#27AE60] tabular-nums">&lt;1%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
