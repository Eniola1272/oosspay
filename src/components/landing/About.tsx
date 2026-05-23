import Image from "next/image";
import { Eye, Target, Heart, Coins, Sparkles } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative py-32 bg-white overflow-hidden">
      <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-[#FCE4EC]/40 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Copy + Pillars */}
          <div className="space-y-6">
            <div className="reveal">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B] mb-4">About OOSSPAY</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] leading-[1.05] tracking-tight">
                We Exist to <span className="text-[#C2185B]">Make Many Wealthy</span>
              </h2>
            </div>

            <p className="reveal text-[#1A1A2E]/65 leading-relaxed text-base" data-reveal-delay="100">
              OOSSPAY isn&apos;t just another savings platform. We&apos;re a people-first economic community built on the belief that wealth shouldn&apos;t be a privilege, it should be a shared journey.
            </p>
            <p className="reveal text-[#1A1A2E]/65 leading-relaxed text-base" data-reveal-delay="180">
              Our mantra is simple: <strong className="text-[#C2185B]">People Over Profit.</strong> Everything we build, every decision we make, starts with one question: does this serve the people we exist for?
            </p>

            <div className="reveal grid sm:grid-cols-3 gap-3 pt-4" data-reveal-delay="260">
              {[
                { icon: Eye, title: "Vision", desc: "Generational wealth, shared." },
                { icon: Target, title: "Mission", desc: "Tools to help you save consistently." },
                { icon: Heart, title: "Value", desc: "People over profit, every time." },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#E0E0E0] hover:border-[#C2185B]/40 hover:shadow-lg transition-all p-4 bg-white group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] flex items-center justify-center mb-3 group-hover:bg-[#C2185B] transition-colors">
                    <Icon size={16} className="text-[#C2185B] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-[#1A1A2E] mb-1">{title}</p>
                  <p className="text-xs text-[#1A1A2E]/55 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo with floating cards */}
          <div className="reveal relative" data-reveal-delay="200">
            <div className="relative max-w-md mx-auto">
              <div className="absolute -inset-6 bg-linear-to-br from-[#FCE4EC] via-white to-[#FCE4EC]/30 rounded-[3rem] -z-10" />

              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image
                  src="/images/girl-holding-tablet.png"
                  alt="A young African saver tracking her goals on her tablet"
                  fill
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1A1A2E]/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2 animate-float">
                <Coins size={14} className="text-[#F39C12]" />
                <span className="text-xs font-bold text-[#1A1A2E] tabular-nums">+&#8358;5,200</span>
              </div>

              <div
                className="absolute bottom-8 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl animate-float-slow"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Total Saved</p>
                <p className="text-base font-extrabold text-[#1A1A2E] tabular-nums">&#8358;150,000</p>
              </div>

              <div
                className="absolute top-1/3 -right-6 bg-[#1A1A2E] rounded-2xl px-3 py-2 shadow-xl animate-float"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#FCE4EC]" />
                  <span className="text-[10px] font-bold text-white">Goal Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
