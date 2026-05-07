import {
  Crosshair,
  CalendarCheck,
  Wallet,
  BarChart2,
  BookOpen,
  Users,
  ArrowUpRight,
} from "lucide-react";

type Accent = "wine" | "pink" | "white";

const services: Array<{
  icon: typeof Crosshair;
  title: string;
  desc: string;
  accent: Accent;
  span: string;
}> = [
  {
    icon: Crosshair,
    title: "Target Savings",
    desc: "Set a goal. Name it. Fund it at your own pace. Whether it&apos;s a new phone or rent, your dashboard tracks every step.",
    accent: "wine",
    span: "lg:col-span-2",
  },
  {
    icon: CalendarCheck,
    title: "Consistent Savings",
    desc: "Build the habit that changes everything. Daily, weekly, or monthly &mdash; OOSSPAY keeps you accountable.",
    accent: "white",
    span: "lg:col-span-1",
  },
  {
    icon: Wallet,
    title: "Stress-Free Withdrawals",
    desc: "Your money should never feel trapped. Request a withdrawal and our team processes it promptly. No hoops.",
    accent: "white",
    span: "lg:col-span-1",
  },
  {
    icon: BarChart2,
    title: "Real-Time Dashboard",
    desc: "See your savings balance, transactions, and target progress at a glance &mdash; 24/7, from any device.",
    accent: "pink",
    span: "lg:col-span-2",
  },
  {
    icon: BookOpen,
    title: "Financial Education",
    desc: "Resources, tips, and community-driven education to help you make smarter money decisions.",
    accent: "white",
    span: "lg:col-span-1",
  },
  {
    icon: Users,
    title: "Community Networking",
    desc: "You&apos;re not saving alone. OOSSPAY connects you with people who share tips and grow together.",
    accent: "white",
    span: "lg:col-span-2",
  },
];

const ACCENTS: Record<Accent, string> = {
  wine: "bg-mesh-wine text-white border-transparent",
  pink: "bg-linear-to-br from-[#C2185B] via-[#a01549] to-[#4A0820] text-white border-transparent",
  white: "bg-white border-[#E0E0E0] text-[#1A1A2E]",
};

export function Services() {
  return (
    <section id="services" className="relative py-32 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B] mb-4">
              Our Services
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] tracking-tight leading-[1.05]">
              Everything You Need to Build
              <br />
              <span className="text-[#C2185B]">Financial Discipline</span>
            </h2>
          </div>
          <p className="text-[#1A1A2E]/60 max-w-sm md:text-right">
            Simple, powerful tools designed for real Nigerians with real
            financial goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-7">
          {services.map(({ icon: Icon, title, desc, accent, span }, i) => {
            const isDark = accent !== "white";
            return (
              <div
                key={title}
                className={`reveal relative overflow-hidden rounded-3xl border p-7 min-h-[260px] flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-1 transition-all ${ACCENTS[accent]} ${span}`}
                data-reveal-delay={`${(i % 3) * 100}`}
              >
                <div
                  className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isDark ? "bg-white/10" : "bg-[#FCE4EC]/60"}`}
                />

                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors ${isDark ? "bg-white/15 backdrop-blur-sm" : "bg-[#FCE4EC] group-hover:bg-[#C2185B]"}`}
                  >
                    <Icon
                      size={22}
                      className={
                        isDark
                          ? "text-white"
                          : "text-[#C2185B] group-hover:text-white transition-colors"
                      }
                    />
                  </div>
                  <h3
                    className={`text-xl font-extrabold mb-2 tracking-tight ${isDark ? "text-white" : "text-[#1A1A2E]"}`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-white/75" : "text-[#1A1A2E]/60"}`}
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
