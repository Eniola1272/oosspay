import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Target, Heart, CheckCircle2, Sparkles, Award } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const FOUNDER_AVATARS = [
  "/images/person-1.png",
  "/images/person-2.png",
  "/images/person-3.png",
];

const reasons = [
  {
    title: "People Over Profit",
    desc: "We don't exist to make money off your savings. We exist to help you make money from saving. Every feature is designed with your wellbeing first.",
  },
  {
    title: "Complete Transparency",
    desc: "No hidden charges. No surprise deductions. Your dashboard shows every naira in and every naira out.",
  },
  {
    title: "Built for Real Nigerians",
    desc: "We understand the hustle. Salaries come late, emergencies happen, every thousand naira matters — that's why we made OOSSPAY honest.",
  },
  {
    title: "Your Money, Your Control",
    desc: "You decide when to save, how much, and when to withdraw. We help you stay disciplined — not lock you out of your own money.",
  },
  {
    title: "A Community That Cares",
    desc: "Behind OOSSPAY is a team and a community of people who genuinely want to see you win. People helping people.",
  },
];

export const metadata: Metadata = {
  title: "About OOSSPAY — People Over Profit",
  description:
    "Learn the story, mission, and values behind OOSSPAY — Nigeria's people-first savings community.",
};

const team = [
  {
    name: "Pastor Israel Ooss",
    title: "CEO & Founder",
    bio: "I am Pastor Israel Ooss, the Founder and CEO of OOSSPAY. I started this platform to bring financial empowerment to everyday Nigerians through community-driven savings.",
  },
  {
    name: "Chiamaka F. Ogbodo",
    title: "Sales Assistant",
    bio: "I am Chiamaka, the Sales Assistant at OOSSPAY. I help onboard new members and ensure every saver gets the support they need to hit their financial goals.",
  },
  {
    name: "Eniola Aderounmu",
    title: "Lead Developer",
    bio: "I am Eniola, the Lead Developer at OOSSPAY. I build and maintain the platform to make sure your savings experience is seamless, secure, and beautiful.",
  },
];

export default function AboutPage() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-linear-to-br from-[#FCE4EC]/40 via-white to-white">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">
              About OOSSPAY
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] leading-tight">
              We&apos;re Building Wealth for the Many, Not the Few
            </h1>
            <p className="text-lg text-[#666666] leading-relaxed max-w-2xl mx-auto">
              OOSSPAY was born from a simple belief: that financial growth
              should never be a solo journey. We&apos;re a community-first
              platform that exists to help everyday Africans build savings
              habits, hit their financial targets, and grow together.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B] mb-3">
              Our Story
            </p>
            <h2 className="text-3xl font-extrabold text-[#1A1A2E] mb-6">
              From a WhatsApp Group to a Movement
            </h2>
            <div className="space-y-5 text-[#666666] leading-relaxed text-lg">
              <p>
                OOSSPAY started as a conversation on WhatsApp — a small group of
                people who wanted to save together, hold each other accountable,
                and build something bigger than themselves. What began as a
                group chat became a movement.
              </p>
              <p>
                Today, OOSSPAY is a growing digital platform powered by{" "}
                <strong className="text-[#1A1A2E]">OOSS</strong>{" "}
                <span className="text-[#1A1A2E]">
                  (<strong>O</strong>ne <strong>O</strong>rganization{" "}
                  <strong>S</strong>everal <strong>S</strong>olutions)
                </span>
                , built on the principle that when people come first, profit
                follows. We&apos;re not backed by venture capital or driven by
                investor returns. We&apos;re driven by the community we serve.
              </p>
            </div>
          </div>
        </section>

        {/* Vision, Mission, Values */}
        <section className="py-20 bg-[#FAFAFA]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-extrabold text-[#1A1A2E] text-center mb-12">
              Vision, Mission &amp; Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Eye,
                  title: "Our Vision",
                  body: "Making Many Wealthy — We envision a future where consistent saving is the foundation for generational wealth across Nigeria, Africa, and beyond.",
                },
                {
                  icon: Target,
                  title: "Our Mission",
                  body: "To create a people-first economic community designed to bring many into wealth through financial education, community networking, and accessible savings tools.",
                },
                {
                  icon: Heart,
                  title: "Our Core Value",
                  body: "People Over Profit — This isn't a tagline we put on a poster. It's the operating system behind every decision. If it doesn't serve the saver, we don't build it.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <Card key={title} className="border-[#E0E0E0] text-center">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#FCE4EC] flex items-center justify-center mx-auto">
                      <Icon size={26} className="text-[#C2185B]" />
                    </div>
                    <h3 className="font-bold text-lg text-[#1A1A2E]">
                      {title}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed">
                      {body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section id="why-us" className="relative py-24 overflow-hidden bg-mesh-pink">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#C2185B]/15 blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
              <div className="lg:sticky lg:top-32">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B] mb-4">
                    What Makes Us Different
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A2E] leading-[1.02] tracking-tight mb-6">
                    Why Thousands<br />
                    Are Choosing<br />
                    <span className="text-[#C2185B]">OOSSPAY</span>
                  </h2>
                  <p className="text-[#1A1A2E]/65 mb-8 max-w-md leading-relaxed">
                    We&apos;re not just a savings platform. We&apos;re a movement &mdash; built for everyday Nigerians, by people who understand the journey.
                  </p>
                </div>

                <div className="hidden lg:block relative bg-white rounded-3xl overflow-hidden shadow-xl border border-white max-w-sm mt-10">
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-linear-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center shadow-lg z-10">
                    <Award size={20} className="text-white" />
                  </div>

                  <div className="relative aspect-[5/3] bg-linear-to-br from-[#FCE4EC] to-white">
                    <Image
                      src="/images/savings-box.png"
                      alt="OOSSPAY savings box"
                      fill
                      sizes="380px"
                      className="object-contain p-6"
                    />
                  </div>

                  <div className="p-6 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} className="text-[#C2185B]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B]">
                        The OOSSPAY Promise
                      </span>
                    </div>
                    <p className="text-sm text-[#1A1A2E] font-semibold leading-relaxed mb-4">
                      &ldquo;Your savings will never fund our bonuses. Period.&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="flex -space-x-2">
                        {FOUNDER_AVATARS.map((src) => (
                          <span key={src} className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-[#FCE4EC]">
                            <Image src={src} alt="Founder" fill sizes="28px" className="object-cover" />
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#1A1A2E]/55 font-medium">&mdash; The OOSSPAY founding team</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {reasons.map(({ title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[#27AE60]/15 flex items-center justify-center group-hover:bg-[#27AE60] transition-colors">
                      <CheckCircle2 size={18} className="text-[#27AE60] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#1A1A2E] mb-1.5 text-base">{title}</h3>
                      <p className="text-sm text-[#1A1A2E]/60 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#FCE4EC]/30 text-center">
          <div className="container mx-auto px-4 max-w-xl space-y-6">
            <h2 className="text-3xl font-extrabold text-[#1A1A2E]">
              Ready to Start Your Savings Journey?
            </h2>
            <p className="text-[#666666]">
              Join the OOSSPAY community today and take the first step toward
              your financial goals.
            </p>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#C2185B] hover:bg-[#a31545] text-white px-10 rounded-full",
              )}
            >
              Create Your Free Account <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </AuthProvider>
  );
}
