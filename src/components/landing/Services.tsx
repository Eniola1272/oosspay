import { Crosshair, CalendarCheck, Wallet, BarChart2, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Crosshair,
    title: "Target Savings",
    desc: "Set a goal. Name it. Fund it at your own pace. Whether it's ₦50,000 for a new phone or ₦500,000 for rent — your dashboard tracks every step and shows exactly how close you are. Saving has never felt this personal.",
  },
  {
    icon: CalendarCheck,
    title: "Consistent Savings",
    desc: "Build the habit that changes everything. Save daily, weekly, or monthly — whatever fits your life. OOSSPAY keeps you accountable with gentle reminders and a savings streak tracker that celebrates your consistency.",
  },
  {
    icon: Wallet,
    title: "Stress-Free Withdrawals",
    desc: "Your money should never feel trapped. Request a withdrawal through your dashboard, and our team processes it promptly. No hidden fees, no unnecessary delays, no hoops to jump through. It's your money — we just help you grow it.",
  },
  {
    icon: BarChart2,
    title: "Real-Time Dashboard",
    desc: "See your savings balance, transaction history, and target progress at a glance — 24/7 from any device. Beautiful progress rings and clear numbers mean you always know exactly where you stand financially.",
  },
  {
    icon: BookOpen,
    title: "Financial Education",
    desc: "Saving is just the beginning. OOSSPAY provides resources, tips, and community-driven financial education to help you make smarter money decisions — whether you're earning ₦50K or ₦500K a month.",
  },
  {
    icon: Users,
    title: "Community Networking",
    desc: "You're not saving alone. OOSSPAY connects you with a community of like-minded people who share tips, encourage each other, and grow together. Because wealth is better when it's shared.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">
            Everything You Need to Build Financial Discipline
          </h2>
          <p className="text-[#666666] max-w-lg mx-auto">
            Simple, powerful tools designed for real Nigerians with real financial goals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="border-[#E0E0E0] hover:border-[#C2185B]/40 hover:shadow-md transition-all group cursor-default"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] flex items-center justify-center group-hover:bg-[#C2185B] transition-colors">
                  <Icon size={22} className="text-[#C2185B] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A2E]">{title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
