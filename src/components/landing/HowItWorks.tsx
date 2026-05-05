import { UserPlus, Target, Wallet } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Free Account",
    desc: "Sign up in under 2 minutes with your name, email, and phone number. Your personal savings dashboard is ready instantly — no paperwork, no waiting.",
  },
  {
    number: "02",
    icon: Target,
    title: "Set Your Savings Target",
    desc: "Whether you're saving for rent, a business, school fees, or just building a safety net — set a goal, choose your timeline, and watch your progress in real time with visual trackers that keep you motivated.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Save, Track, and Withdraw With Ease",
    desc: "Make deposits to your OOSSPAY account, track every naira on your dashboard, and request withdrawals anytime — your money is always accessible when you need it.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">Start Saving in 3 Simple Steps</h2>
          <p className="text-[#666666] max-w-lg mx-auto">
            No long forms. No confusing processes. Just a clear path to your financial goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#C2185B]/20 via-[#C2185B]/60 to-[#C2185B]/20" />

          {steps.map(({ number, icon: Icon, title, desc }) => (
            <div key={number} className="flex flex-col items-center text-center gap-4 relative">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#C2185B] flex items-center justify-center shadow-lg shadow-[#C2185B]/30 z-10 relative">
                  <Icon size={32} className="text-white" />
                </div>
                <span className="absolute -top-2 -right-2 bg-white border-2 border-[#C2185B] text-[#C2185B] text-[10px] font-extrabold rounded-full w-6 h-6 flex items-center justify-center">
                  {number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E]">{title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
