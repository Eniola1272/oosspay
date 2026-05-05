import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "I used to struggle saving ₦5,000 a month. With OOSSPAY, I've saved over ₦150,000 in 6 months. The target tracker kept me going even when I wanted to give up.",
    name: "Adaeze O.",
    location: "Lagos",
  },
  {
    quote: "What I love most is the transparency. I can see everything — every deposit, every update. No surprises. It's the first platform where I actually trust where my money is.",
    name: "Emeka R.",
    location: "Abuja",
  },
  {
    quote: "The community aspect makes all the difference. It's not just an app — you feel like you're part of something bigger. People Over Profit isn't just a slogan here.",
    name: "Chidinma B.",
    location: "Port Harcourt",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">What Our Members Say</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">
            Real People. Real Savings. Real Results.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, location }) => (
            <Card key={name} className="border-[#E0E0E0] bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <Quote size={28} className="text-[#C2185B]/30" />
                <p className="text-[#333333] leading-relaxed italic text-sm">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#E0E0E0]">
                  <div className="w-9 h-9 rounded-full bg-[#C2185B] flex items-center justify-center text-white text-sm font-bold">
                    {name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1A1A2E]">{name}</p>
                    <p className="text-xs text-[#666666]">{location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
