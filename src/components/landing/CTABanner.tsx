import Link from "next/link";
import { ArrowRight, Shield, Clock, Star, TrendingUp, Wallet, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section id="cta" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-wine" />
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#C2185B]/30 blur-[120px] animate-blob pointer-events-none" />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C2185B]/25 blur-[100px] animate-blob pointer-events-none"
        style={{ animationDelay: "5s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border-2 border-dashed border-white/10 animate-spin-slow pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <div className="reveal inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={12} className="text-[#FCE4EC]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-white">Free To Join</span>
        </div>

        <h2 className="reveal text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.02] mb-6 tracking-tight" data-reveal-delay="100">
          Your Financial Future<br />
          Doesn&apos;t Start Tomorrow.<br />
          <span className="bg-linear-to-r from-[#FCE4EC] via-white to-[#FCE4EC] bg-clip-text text-transparent">
            It Starts Today.
          </span>
        </h2>

        <p className="reveal text-white/75 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed" data-reveal-delay="220">
          Join a community of Nigerians who are taking control of their finances, one saving at a time. No minimum amount. No complicated forms. Just a decision to start.
        </p>

        <div className="reveal flex flex-wrap items-center justify-center gap-4" data-reveal-delay="320">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 bg-white hover:bg-[#FCE4EC] text-[#C2185B] px-8 py-4 rounded-full font-bold text-sm shadow-2xl transition-all hover:-translate-y-px"
          >
            Create Your Free Account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-sm transition-all"
          >
            Login Instead
          </Link>
        </div>

        <div className="reveal flex items-center justify-center gap-6 mt-10 text-white/70 text-xs sm:text-sm flex-wrap" data-reveal-delay="420">
          <span className="inline-flex items-center gap-1.5">
            <Star size={13} className="text-[#FCE4EC]" /> Free to join
          </span>
          <span className="text-white/30">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} className="text-[#FCE4EC]" /> 2-minute setup
          </span>
          <span className="text-white/30">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Shield size={13} className="text-[#FCE4EC]" /> No hidden fees
          </span>
        </div>

        <div className="reveal grid sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto" data-reveal-delay="500">
          {[
            { icon: TrendingUp, label: "Avg. monthly growth", value: "+12%" },
            { icon: Wallet, label: "Saved community-wide", value: "₦25M+" },
            { icon: Shield, label: "Withdrawals honoured", value: "100%" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon size={16} className="text-[#FCE4EC]" />
              </div>
              <div className="text-left">
                <p className="text-lg font-extrabold text-white tabular-nums">{value}</p>
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
