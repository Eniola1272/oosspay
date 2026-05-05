import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Heart } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">About OOSSPAY</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">
              We Exist to Make Many Wealthy
            </h2>
            <p className="text-[#666666] leading-relaxed">
              OOSSPAY isn&apos;t just another savings platform. We&apos;re a people-first economic community — built on the belief that wealth shouldn&apos;t be a privilege, it should be a shared journey.
            </p>
            <p className="text-[#666666] leading-relaxed">
              Our mantra is simple: <strong className="text-[#C2185B]">People Over Profit.</strong> Everything we build, every decision we make, starts with one question — does this serve the people we exist for?
            </p>
            <p className="text-[#666666] leading-relaxed">
              We&apos;re here to help everyday Nigerians save consistently, build financial discipline, and access the tools they need to grow — all within a supportive community that genuinely cares about your progress.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Eye,
                title: "Our Vision",
                desc: "Making Many Wealthy (Operation MMW) — We envision a community where consistent saving becomes the foundation for generational wealth.",
              },
              {
                icon: Target,
                title: "Our Mission",
                desc: "To create a people-first economic community designed to bring many into wealth through financial education, community networking, and accessible savings tools.",
              },
              {
                icon: Heart,
                title: "Our Core Value",
                desc: "People Over Profit — This isn't a tagline. It's the lens through which every decision is made. Your financial wellbeing will always come before our bottom line.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-[#E0E0E0] hover:border-[#C2185B]/30 transition-colors">
                <CardContent className="flex gap-4 p-5">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE4EC] flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[#C2185B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A2E] mb-1">{title}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
