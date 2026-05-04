import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Services } from "@/components/landing/Services";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTABanner } from "@/components/landing/CTABanner";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
      <FAQ />
      <Footer />
    </>
  );
}
