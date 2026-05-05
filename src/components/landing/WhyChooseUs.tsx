import { CheckCircle2, Sparkles, Award } from "lucide-react";

const reasons = [
  {
    title: "People Over Profit",
    desc: "We don&apos;t exist to make money off your savings. We exist to help you make money from saving. Every feature is designed with your wellbeing first.",
  },
  {
    title: "Complete Transparency",
    desc: "No hidden charges. No surprise deductions. Your dashboard shows every naira in and every naira out.",
  },
  {
    title: "Built for Real Nigerians",
    desc: "We understand the hustle. Salaries come late, emergencies happen, every thousand naira matters &mdash; that&apos;s why we made OOSSPAY honest.",
  },
  {
    title: "Your Money, Your Control",
    desc: "You decide when to save, how much, and when to withdraw. We help you stay disciplined &mdash; not lock you out of your own money.",
  },
  {
    title: "A Community That Cares",
    desc: "Behind OOSSPAY is a team and a community of people who genuinely want to see you win. People helping people.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative py-24 overflow-hidden bg-mesh-pink">
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#C2185B]/15 blur-[120px] pointer-events-none animate-blob" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="reveal">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B] mb-4">Why Us</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A2E] leading-[1.02] tracking-tight mb-6">
                Why Thousands<br />
                Are Choosing<br />
                <span className="text-[#C2185B]">OOSSPAY</span>
              </h2>
              <p className="text-[#1A1A2E]/65 mb-8 max-w-md leading-relaxed">
                We&apos;re not just a savings platform. We&apos;re a movement &mdash; built for everyday Nigerians, by people who understand the journey.
              </p>
            </div>

            <div className="reveal hidden lg:block relative bg-white rounded-3xl p-6 shadow-xl border border-white max-w-sm" data-reveal-delay="200">
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-linear-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center shadow-lg">
                <Award size={20} className="text-white" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-[#C2185B]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B]">The OOSSPAY Promise</span>
              </div>
              <p className="text-sm text-[#1A1A2E] font-semibold leading-relaxed mb-3">
                &ldquo;Your savings will never fund our bonuses. Period.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="flex -space-x-2">
                  {["EA", "NG", "CK"].map((initials, idx) => (
                    <div
                      key={initials}
                      className="w-7 h-7 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center"
                      style={{
                        background: idx % 2 === 0 ? "linear-gradient(135deg, #C2185B, #4A0820)" : "linear-gradient(135deg, #1A1A2E, #4A0820)",
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#1A1A2E]/55 font-medium">&mdash; The OOSSPAY founding team</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {reasons.map(({ title, desc }, i) => (
              <div
                key={title}
                className="reveal flex gap-4 bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all group"
                data-reveal-delay={`${i * 90}`}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#27AE60]/15 flex items-center justify-center group-hover:bg-[#27AE60] transition-colors">
                  <CheckCircle2 size={18} className="text-[#27AE60] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1A1A2E] mb-1.5 text-base">{title}</h3>
                  <p
                    className="text-sm text-[#1A1A2E]/60 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
