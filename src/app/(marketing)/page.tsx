import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { SeamlessSavings } from "@/components/landing/SeamlessSavings";
import { About } from "@/components/landing/About";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Services } from "@/components/landing/Services";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { RevealProvider } from "@/components/landing/RevealProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title:
    "OOSSPAY — Save Smarter, Grow Together | People-First Savings Platform",
  description:
    "OOSSPAY is Nigeria's people-first savings community. Set targets, save consistently, and track your wealth — all from your personal dashboard. Join 500+ members today.",
  keywords: [
    "OOSSPAY",
    "savings platform Nigeria",
    "target savings",
    "save money Nigeria",
    "people first savings",
  ],
  openGraph: {
    title: "OOSSPAY — Your Wealth Starts With Your Community",
    description:
      "Join a people-first savings community built on transparency, trust, and the belief that wealth should be shared. Start saving today.",
  },
};

export default function LandingPage() {
  return (
    <AuthProvider>
      <RevealProvider>
        <Navbar />
        <main>
          <Hero />
          <TrustBar />
          <SeamlessSavings />
          <About />
          <HowItWorks />
          <Services />
          <WhyChooseUs />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
      </RevealProvider>
    </AuthProvider>
  );
}
