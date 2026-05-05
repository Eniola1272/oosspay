import Link from "next/link";
import { ArrowRight, ChevronDown, Star, TrendingUp, Bell } from "lucide-react";

const AVATAR_INITIALS = ["EA", "NG", "CK", "AB"];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-mesh-pink pt-32 pb-20 overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute -top-40 -right-32 w-[640px] h-[640px] bg-[#C2185B]/15 rounded-full blur-[120px] pointer-events-none animate-blob" />
      <div
        className="absolute top-1/2 -left-40 w-[480px] h-[480px] bg-[#4A0820]/15 rounded-full blur-[100px] pointer-events-none animate-blob"
        style={{ animationDelay: "4s" }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Announcement pill */}
        <div className="reveal flex justify-center lg:justify-start mb-8">
          <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#C2185B]/20 text-[#C2185B] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-[#C2185B] opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-[#C2185B]" />
            </span>
            Powered by OOSS &middot; People First Economic Community
          </span>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <h1
              className="reveal text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold leading-[0.98] tracking-[-0.03em] mb-6"
              data-reveal-delay="80"
            >
              <span className="block text-[#1A1A2E]">Making Many</span>
              <span className="block text-[#1A1A2E]">Wealthy.</span>
              <span className="block bg-linear-to-r from-[#C2185B] via-[#a01549] to-[#4A0820] bg-clip-text text-transparent">
                Starting With You.
              </span>
            </h1>

            <p
              className="reveal text-lg text-[#1A1A2E]/65 mb-10 leading-relaxed max-w-md"
              data-reveal-delay="200"
            >
              A people-first savings platform built for collective growth. Set targets, save consistently, and watch your financial future take shape &mdash; together.
            </p>

            <div
              className="reveal flex flex-wrap items-center gap-4 mb-12"
              data-reveal-delay="320"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-[#C2185B] hover:bg-[#a01549] text-white px-8 py-4 rounded-full font-semibold text-sm shadow-xl shadow-[#C2185B]/30 transition-all hover:-translate-y-px"
              >
                Start Saving Today
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#1A1A2E] px-8 py-4 rounded-full font-semibold text-sm border border-[#1A1A2E]/10 hover:border-[#C2185B] hover:text-[#C2185B] transition-all"
              >
                See How It Works
                <ChevronDown size={16} />
              </a>
            </div>

            {/* Social proof */}
            <div
              className="reveal flex items-center gap-4"
              data-reveal-delay="440"
            >
              <div className="flex -space-x-2.5">
                {AVATAR_INITIALS.map((initials, i) => (
                  <span
                    key={initials}
                    className="w-10 h-10 rounded-full border-2 border-[#FCE4EC] flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                    style={{
                      background: i % 2 === 0
                        ? "linear-gradient(135deg, #C2185B, #4A0820)"
                        : "linear-gradient(135deg, #1A1A2E, #4A0820)",
                    }}
                  >
                    {initials}
                  </span>
                ))}
                <span className="w-10 h-10 rounded-full border-2 border-[#FCE4EC] bg-white flex items-center justify-center text-[10px] font-extrabold text-[#C2185B] shadow-sm">
                  +5k
                </span>
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={13} className="text-[#C2185B] fill-[#C2185B]" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  Trusted by <span className="text-[#C2185B]">500+</span> Nigerian savers
                </p>
              </div>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="reveal relative flex justify-center lg:justify-end" data-reveal-delay="200">
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-white pointer-events-none z-0" />
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-72 lg:w-80">
      {/* Decorative ring */}
      <div className="absolute inset-0 m-auto w-[420px] h-[420px] rounded-full border-2 border-dashed border-[#C2185B]/15 animate-spin-slow pointer-events-none" />
      <div className="absolute inset-0 m-auto w-[520px] h-[520px] rounded-full border border-[#4A0820]/10 pointer-events-none" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[#C2185B]/25 blur-3xl scale-90 translate-y-12 rounded-full pointer-events-none" />

      {/* Phone frame */}
      <div className="relative bg-[#1A1A2E] rounded-[2.5rem] p-2 shadow-2xl shadow-[#4A0820]/40">
        <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/19]">
          {/* Status bar */}
          <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[10px] font-bold text-[#1A1A2E]">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-1.5 bg-[#1A1A2E] rounded-sm" />
              <span className="w-1 h-1 bg-[#1A1A2E] rounded-full" />
              <span className="w-4 h-1.5 border border-[#1A1A2E] rounded-sm" />
            </div>
          </div>

          {/* App content */}
          <div className="px-5 pt-3 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wide">Welcome back</p>
                <p className="text-sm font-bold text-[#1A1A2E]">Adaeze</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center text-white text-[10px] font-bold">
                AO
              </div>
            </div>

            {/* Balance card */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#C2185B] via-[#a01549] to-[#4A0820] rounded-2xl p-4 text-white mb-3">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-6 w-20 h-20 rounded-full bg-white/5" />
              <p className="text-[10px] text-white/70 font-medium relative">Total Balance</p>
              <p className="text-2xl font-extrabold mb-2 relative tabular-nums">
                &#8358;20,000<span className="text-sm text-white/60">.00</span>
              </p>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                <div className="h-full w-3/4 bg-white rounded-full" />
              </div>
              <p className="text-[9px] text-white/70 mt-1 relative">75% of &#8358;26,500 goal</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#FCE4EC]/60 rounded-xl p-2.5">
                <p className="text-[8px] text-gray-500 uppercase font-medium">This Month</p>
                <p className="text-xs font-bold text-[#1A1A2E] tabular-nums">&#8358;5,200</p>
              </div>
              <div className="bg-[#FCE4EC]/60 rounded-xl p-2.5">
                <p className="text-[8px] text-gray-500 uppercase font-medium">Streak</p>
                <p className="text-xs font-bold text-[#1A1A2E]">28 days</p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="space-y-1.5">
              <p className="text-[8px] text-gray-400 uppercase tracking-wide font-semibold">Recent</p>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#27AE60]/15 flex items-center justify-center text-[9px] text-[#27AE60] font-bold">+</div>
                  <span className="text-[9px] font-semibold text-[#1A1A2E]">Deposit</span>
                </div>
                <span className="text-[9px] font-bold text-[#27AE60] tabular-nums">+&#8358;5,000</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#C2185B]/15 flex items-center justify-center text-[9px] text-[#C2185B] font-bold">&#9733;</div>
                  <span className="text-[9px] font-semibold text-[#1A1A2E]">Goal hit</span>
                </div>
                <span className="text-[9px] font-bold text-[#1A1A2E]">Phone</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card: Growth */}
      <div className="absolute -left-12 lg:-left-20 top-24 bg-white rounded-2xl shadow-2xl border border-gray-100 px-3 py-2.5 animate-float z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#27AE60]/15 flex items-center justify-center shrink-0">
            <TrendingUp size={14} className="text-[#27AE60]" />
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">Growth</p>
            <p className="text-xs font-extrabold text-[#1A1A2E]">+12% MoM</p>
          </div>
        </div>
      </div>

      {/* Floating card: Notification */}
      <div
        className="absolute -right-10 lg:-right-16 top-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 px-3 py-2.5 animate-float-slow z-20"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C2185B]/15 flex items-center justify-center shrink-0">
            <Bell size={14} className="text-[#C2185B]" />
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">Notification</p>
            <p className="text-xs font-extrabold text-[#1A1A2E]">Goal reached!</p>
          </div>
        </div>
      </div>

      {/* Floating chip: Streak */}
      <div
        className="absolute -left-8 bottom-12 bg-[#1A1A2E] rounded-2xl shadow-2xl px-3 py-2 animate-float z-20"
        style={{ animationDelay: "0.8s", animationDuration: "5s" }}
      >
        <p className="text-[8px] text-white/60 uppercase tracking-wide font-medium">Streak</p>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-[#F39C12]">&#9889;</span>
          <p className="text-xs font-extrabold text-white">28 days</p>
        </div>
      </div>
    </div>
  );
}
