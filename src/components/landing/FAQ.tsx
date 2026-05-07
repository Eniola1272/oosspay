import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { WHATSAPP_LINK } from "@/lib/constants";

const faqs = [
  {
    q: "What is OOSSPAY?",
    a: "OOSSPAY is a people-first savings platform that helps you save consistently, set financial targets, and track your progress through a secure personal dashboard — all backed by a supportive community.",
  },
  {
    q: "Is my money safe with OOSSPAY?",
    a: "Absolutely. Your savings are tracked transparently on your dashboard. Every deposit and withdrawal is recorded and visible to you in real time. We operate with full transparency — your trust is our foundation.",
  },
  {
    q: "How do I save money on OOSSPAY?",
    a: "After creating your account, you'll see OOSSPAY's official account details on your dashboard. Simply transfer your savings to that account, and your balance updates once the deposit is confirmed by our team.",
  },
  {
    q: "Can I withdraw my money anytime?",
    a: "Yes. Simply fill out the withdrawal request form on your dashboard. Our team processes withdrawal requests promptly, and you'll receive a notification when the funds hit your bank account.",
  },
  {
    q: "Is there a minimum amount I need to save?",
    a: "No minimum. Whether you're starting with 1,000 naira or 100,000 naira, OOSSPAY is built for savers at every level. The most important thing is consistency, not the amount.",
  },
  {
    q: "What is Target Savings?",
    a: "Target Savings lets you set a specific financial goal, choose a deadline, and track your progress with a visual tracker on your dashboard. It turns saving from a chore into a challenge you can win.",
  },
  {
    q: "Does OOSSPAY charge any fees?",
    a: "OOSSPAY is committed to the People Over Profit principle. We keep our fees transparent and minimal. Any applicable fees are clearly communicated upfront — never hidden.",
  },
  {
    q: "How do I contact OOSSPAY?",
    a: "You can reach us through WhatsApp, Instagram (@oosspayofficial), TikTok (@oosspay), or via your dashboard's support section. We're always here to help.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-32 bg-white overflow-hidden">
      <div className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-[#FCE4EC]/40 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="reveal text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FCE4EC] border border-[#C2185B]/15 rounded-full px-4 py-1.5">
            <HelpCircle size={13} className="text-[#C2185B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C2185B]">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] tracking-tight leading-[1.05]">
            Got Questions?<br />
            <span className="text-[#C2185B]">We&apos;ve Got Answers.</span>
          </h2>
        </div>

        <Accordion className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="reveal border border-[#E0E0E0] rounded-2xl px-5 bg-white data-open:border-[#C2185B]/40 data-open:shadow-lg data-open:bg-[#FCE4EC]/20 transition-all"
              data-reveal-delay={`${i * 50}`}
            >
              <AccordionTrigger className="text-left font-bold text-[#1A1A2E] hover:text-[#C2185B] hover:no-underline py-5 text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#1A1A2E]/65 leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="reveal mt-12 text-center">
          <p className="text-sm text-[#1A1A2E]/60 mb-3">Still have questions?</p>
          <Link
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1A1A2E] hover:bg-[#C2185B] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all"
          >
            <MessageCircle size={15} />
            Chat with us on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
