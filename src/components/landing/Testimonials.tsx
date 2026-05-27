import Image from "next/image";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used to struggle saving 5,000 naira a month. With OOSSPAY, I've saved over 150,000 naira in 6 months. The target tracker kept me going even when I wanted to give up",
    name: "Chiamaka O.",
    location: "Lagos",
    role: "Small Business Owner",
    image: "/images/testimonial-1.png",
    highlight: false,
  },
  {
    quote:
      "What I love most is the transparency. I can see everything; every deposit, every update. No surprises. It's the first platform where I actually trust where my money is.",
    name: "Abiodun R.",
    location: "Abuja",
    role: "Software Engineer",
    image: "/images/testimonial-3.png",
    highlight: true,
  },
  {
    quote:
      "The community aspect makes all the difference. It's not just an app; you feel like you're part of something bigger. People Over Profit isn't just a slogan here.",
    name: "Nuru B.",
    location: "Port Harcourt",
    role: "Marketing Lead",
    image: "/images/testimonial-2.png",
    highlight: false,
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-32 bg-white overflow-hidden"
    >
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FCE4EC]/40 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="reveal text-center mb-20 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B]">
            What Our Members Say
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] tracking-tight leading-[1.05]">
            Real People. Real Savings.
            <br />
            <span className="text-[#C2185B]">Real Results.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map(
            ({ quote, name, location, role, image, highlight }, i) => (
              <div
                key={name}
                className={`reveal relative overflow-hidden rounded-3xl p-7 flex flex-col gap-5 transition-all hover:-translate-y-1 ${highlight
                  ? "bg-linear-to-br from-[#C2185B] via-[#a01549] to-[#4A0820] text-white shadow-2xl shadow-[#C2185B]/40 md:scale-105"
                  : "bg-white border border-[#E0E0E0] hover:shadow-xl"
                  }`}
                data-reveal-delay={`${i * 120}`}
              >
                {highlight && (
                  <>
                    <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#FCE4EC]/15 blur-3xl pointer-events-none" />
                  </>
                )}

                <div className="relative flex items-center justify-between">
                  <Quote
                    size={32}
                    className={
                      highlight ? "text-white/30" : "text-[#C2185B]/30"
                    }
                  />
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          highlight
                            ? "text-white fill-white"
                            : "text-[#C2185B] fill-[#C2185B]"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className={`relative text-sm leading-relaxed ${highlight ? "text-white" : "text-[#1A1A2E]/80"}`}>
                  &ldquo;{quote}&rdquo;
                </p>

                <div
                  className={`relative mt-auto flex items-center gap-3 pt-5 border-t ${highlight ? "border-white/20" : "border-[#E0E0E0]"}`}
                >
                  <div
                    className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ${highlight ? "ring-white/30" : "ring-[#FCE4EC]"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p
                      className={`font-extrabold text-sm ${highlight ? "text-white" : "text-[#1A1A2E]"}`}
                    >
                      {name}
                    </p>
                    <p
                      className={`text-[11px] ${highlight ? "text-white/70" : "text-[#1A1A2E]/55"}`}
                    >
                      {role} &middot; {location}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
