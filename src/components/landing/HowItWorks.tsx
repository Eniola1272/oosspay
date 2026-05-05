import { UserPlus, Target, Wallet } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Free Account",
    desc: "Sign up in under 2 minutes with your name, email, and phone number. Your personal savings dashboard is ready instantly &mdash; no paperwork, no waiting.",
  },
  {
    number: "02",
    icon: Target,
    title: "Set Your Savings Target",
    desc: "Whether you&apos;re saving for rent, a business, school fees, or just a safety net &mdash; set a goal, choose a timeline, and watch your progress in real time.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Save, Track, and Withdraw With Ease",
    desc: "Make deposits to your OOSSPAY account, track every naira on your dashboard, and request withdrawals anytime &mdash; your money is always accessible.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#C2185B]/30 to-transparent" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="reveal text-center mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B]">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] tracking-tight">
            Start Saving in <span className="text-[#C2185B]">3 Simple Steps</span>
          </h2>
          <p className="text-[#1A1A2E]/60 max-w-lg mx-auto">
            No long forms. No confusing processes. Just a clear path to your financial goals.
          </p>
        </div>

        <div className="relative">
          {/* SVG connector path */}
          <svg
            className="hidden md:block absolute top-12 left-0 right-0 mx-auto pointer-events-none z-0"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            style={{ width: "calc(100% - 8rem)", height: "80px", margin: "0 auto" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="howGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C2185B" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#C2185B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#C2185B" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M 0 40 Q 250 0, 500 40 T 1000 40"
              fill="none"
              stroke="url(#howGrad)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          </svg>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map(({ number, icon: Icon, title, desc }, i) => (
              <div
                key={number}
                className="reveal flex flex-col items-center text-center gap-4"
                data-reveal-delay={`${i * 120}`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#C2185B]/30 blur-2xl rounded-full" />
                  <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center shadow-2xl shadow-[#C2185B]/30">
                    <Icon size={36} className="text-white" strokeWidth={1.8} />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-white border-2 border-[#C2185B] text-[#C2185B] text-[10px] font-extrabold rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                    {number}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight">{title}</h3>
                <p
                  className="text-sm text-[#1A1A2E]/60 leading-relaxed max-w-xs"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
