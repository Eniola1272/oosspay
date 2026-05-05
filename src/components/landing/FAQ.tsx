import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    a: "No minimum. Whether you're starting with ₦1,000 or ₦100,000, OOSSPAY is built for savers at every level. The most important thing is consistency, not the amount.",
  },
  {
    q: "What is Target Savings?",
    a: "Target Savings lets you set a specific financial goal (like ₦200,000 for rent), choose a deadline, and track your progress with a visual tracker on your dashboard. It turns saving from a chore into a challenge you can actually win.",
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
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B]">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">Got Questions? We&apos;ve Got Answers.</h2>
        </div>
        <Accordion className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-[#E0E0E0] rounded-xl px-4 data-open:border-[#C2185B]/40">
              <AccordionTrigger className="text-left font-semibold text-[#1A1A2E] hover:text-[#C2185B] hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#666666] leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
