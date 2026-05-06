import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Target, Heart } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

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
