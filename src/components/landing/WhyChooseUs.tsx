import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "People Over Profit",
    desc: "We don't exist to make money off your savings. We exist to help you make money from saving. Every feature, every policy, every decision is designed with your wellbeing first.",
  },
  {
    title: "Complete Transparency",
    desc: "No hidden charges. No surprise deductions. Your dashboard shows every naira in and every naira out. What you see is exactly what you have.",
  },
  {
    title: "Built for Real Nigerians",
    desc: "We understand the hustle. We know salaries come late, emergencies happen, and every thousand naira matters. That's why we made OOSSPAY flexible, accessible, and honest.",
  },
  {
    title: "Your Money, Your Control",
    desc: "You decide when to save, how much to save, and when to withdraw. We're here to help you stay disciplined — not to lock you out of your own money.",
  },
  {
    title: "A Community That Cares",
    desc: "Behind OOSSPAY is a team and a community of people who genuinely want to see you win. This isn't corporate banking — it's people helping people.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 bg-[#FCE4EC]/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B] mb-3">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] leading-tight">
              Why Thousands Are Choosing{" "}
              <span className="text-[#C2185B]">OOSSPAY</span>
            </h2>
            <p className="mt-4 text-[#666666]">
              We&apos;re not just a savings platform. We&apos;re a movement — built for everyday Nigerians, by people who understand the journey.
            </p>
          </div>

          <div className="space-y-5">
            {reasons.map(({ title, desc }) => (
              <div key={title} className="flex gap-4">
                <CheckCircle2 size={22} className="text-[#27AE60] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#1A1A2E]">{title}</h3>
                  <p className="text-sm text-[#666666] mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
