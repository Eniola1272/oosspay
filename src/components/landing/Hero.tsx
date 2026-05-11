import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Star, TrendingUp, Bell } from "lucide-react";

const HERO_AVATARS = [
  { src: "/images/person-1.png", alt: "Member" },
  { src: "/images/testimonial-3.png", alt: "Member" },
  { src: "/images/person-3.png", alt: "Member" },
  { src: "/images/person-2.png", alt: "Member" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-white pt-32 pb-20 overflow-hidden"
    >
      {/* Soft abstract decorations */}
      <PiggyBankIllustration />

      {/* Pink dotted pattern (top-left area) */}
      <svg
        aria-hidden
        className="absolute top-32 left-8 w-32 h-32 opacity-50 pointer-events-none"
        viewBox="0 0 120 120"
        fill="none"
      >
        <defs>
          <pattern
            id="hero-dots"
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="#C2185B" fillOpacity="0.35" />
          </pattern>
        </defs>
        <rect width="120" height="120" fill="url(#hero-dots)" />
      </svg>

      {/* Floating pink balls — abstract, varied sizes */}
      <div className="absolute top-40 right-[18%] w-6 h-6 rounded-full bg-linear-to-br from-[#C2185B] to-[#a01549] shadow-lg shadow-[#C2185B]/20 animate-float pointer-events-none" />
      <div
        className="absolute top-[55%] left-[8%] w-4 h-4 rounded-full bg-[#C2185B]/70 shadow-md shadow-[#C2185B]/20 animate-float-slow pointer-events-none"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="absolute top-[70%] right-[44%] w-3 h-3 rounded-full bg-[#FCE4EC] ring-2 ring-[#C2185B]/40 animate-float pointer-events-none"
        style={{ animationDelay: "2.4s" }}
      />
      <div
        className="absolute bottom-32 left-[30%] w-8 h-8 rounded-full bg-linear-to-br from-[#FCE4EC] to-[#C2185B]/30 shadow-md animate-float-slow pointer-events-none"
        style={{ animationDelay: "0.8s" }}
      />
      <div
        className="absolute top-24 right-1/3 w-2 h-2 rounded-full bg-[#C2185B] animate-float pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* Subtle pink wash behind headline area, very faint */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FCE4EC]/30 rounded-full blur-3xl pointer-events-none" />

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
              A people-first savings platform built for collective growth. Set
              targets, save consistently, and watch your financial future take
              shape &mdash; together.
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
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
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
                {HERO_AVATARS.map(({ src, alt }) => (
                  <span
                    key={src}
                    className="relative w-10 h-10 rounded-full border-2 border-[#FCE4EC] overflow-hidden bg-[#FCE4EC] shadow-sm"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                ))}
                <span className="w-10 h-10 rounded-full border-2 border-[#FCE4EC] bg-white flex items-center justify-center text-[10px] font-extrabold text-[#C2185B] shadow-sm">
                  +5k
                </span>
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={13}
                      className="text-[#C2185B] fill-[#C2185B]"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  Trusted by <span className="text-[#C2185B]">500+</span>{" "}
                  Nigerian savers
                </p>
              </div>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div
            className="reveal relative flex justify-center lg:justify-end"
            data-reveal-delay="200"
          >
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PiggyBankIllustration() {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-10 right-[6%] w-72 h-72 lg:w-96 lg:h-96 opacity-[0.12] pointer-events-none rotate-[-8deg]"
      viewBox="0 0 200 160"
      fill="none"
    >
      <defs>
        <linearGradient id="piggy-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C2185B" />
          <stop offset="100%" stopColor="#4A0820" />
        </linearGradient>
      </defs>

      {/* Body */}
      <ellipse cx="100" cy="92" rx="68" ry="48" fill="url(#piggy-grad)" />

      {/* Snout */}
      <ellipse cx="160" cy="92" rx="22" ry="20" fill="url(#piggy-grad)" />
      <circle cx="160" cy="88" r="3" fill="#1A1A2E" opacity="0.4" />
      <circle cx="160" cy="98" r="3" fill="#1A1A2E" opacity="0.4" />

      {/* Coin slot */}
      <rect
        x="86"
        y="48"
        width="28"
        height="6"
        rx="3"
        fill="#1A1A2E"
        opacity="0.55"
      />

      {/* Eye */}
      <circle cx="138" cy="78" r="3.5" fill="#1A1A2E" opacity="0.6" />
      <circle cx="139" cy="77" r="1" fill="#fff" />

      {/* Ear */}
      <path d="M122 56 L132 38 L140 60 Z" fill="url(#piggy-grad)" />

      {/* Tail (curly) */}
      <path
        d="M34 84 q-10 -2 -8 -10 q2 -7 9 -5"
        stroke="url(#piggy-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Legs */}
      <rect
        x="62"
        y="132"
        width="10"
        height="18"
        rx="3"
        fill="url(#piggy-grad)"
      />
      <rect
        x="92"
        y="134"
        width="10"
        height="18"
        rx="3"
        fill="url(#piggy-grad)"
      />
      <rect
        x="122"
        y="134"
        width="10"
        height="18"
        rx="3"
        fill="url(#piggy-grad)"
      />
      <rect
        x="148"
        y="132"
        width="10"
        height="18"
        rx="3"
        fill="url(#piggy-grad)"
      />

      {/* Coin dropping in */}
      <circle cx="100" cy="22" r="9" fill="#C2185B" opacity="0.7" />
      <text
        x="100"
        y="26"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#fff"
      >
        ₦
      </text>
    </svg>
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
                <p className="text-[9px] text-gray-400 uppercase tracking-wide">
                  Welcome back
                </p>
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
              <p className="text-[10px] text-white/70 font-medium relative">
                Total Balance
              </p>
              <p className="text-2xl font-extrabold mb-2 relative tabular-nums">
                &#8358;20,400,000<span className="text-sm text-white/60">.00</span>
              </p>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                <div className="h-full w-3/4 bg-white rounded-full" />
              </div>
              <p className="text-[9px] text-white/70 mt-1 relative">
                75% of &#8358;26,500 goal
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#FCE4EC]/60 rounded-xl p-2.5">
                <p className="text-[8px] text-gray-500 uppercase font-medium">
                  This Month
                </p>
                <p className="text-xs font-bold text-[#1A1A2E] tabular-nums">
                  &#8358;5,200,000
                </p>
              </div>
              <div className="bg-[#FCE4EC]/60 rounded-xl p-2.5">
                <p className="text-[8px] text-gray-500 uppercase font-medium">
                  Streak
                </p>
                <p className="text-xs font-bold text-[#1A1A2E]">28 days</p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="space-y-1.5">
              <p className="text-[8px] text-gray-400 uppercase tracking-wide font-semibold">
                Recent
              </p>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#27AE60]/15 flex items-center justify-center text-[9px] text-[#27AE60] font-bold">
                    +
                  </div>
                  <span className="text-[9px] font-semibold text-[#1A1A2E]">
                    Deposit
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#27AE60] tabular-nums">
                  +&#8358;5,000
                </span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#C2185B]/15 flex items-center justify-center text-[9px] text-[#C2185B] font-bold">
                    &#9733;
                  </div>
                  <span className="text-[9px] font-semibold text-[#1A1A2E]">
                    Goal hit
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#1A1A2E]">
                  Phone
                </span>
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
            <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">
              Growth
            </p>
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
            <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">
              Notification
            </p>
            <p className="text-xs font-extrabold text-[#1A1A2E]">
              Goal reached!
            </p>
          </div>
        </div>
      </div>

      {/* Floating chip: Streak */}
      <div
        className="absolute -left-8 bottom-12 bg-[#1A1A2E] rounded-2xl shadow-2xl px-3 py-2 animate-float z-20"
        style={{ animationDelay: "0.8s", animationDuration: "5s" }}
      >
        <p className="text-[8px] text-white/60 uppercase tracking-wide font-medium">
          Streak
        </p>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-[#F39C12]">&#9889;</span>
          <p className="text-xs font-extrabold text-white">28 days</p>
        </div>
      </div>
    </div>
  );
}
