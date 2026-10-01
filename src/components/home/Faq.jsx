import { useState } from "react";
import { FiZap, FiChevronDown, FiChevronUp } from "react-icons/fi";
import SectionTag from "./SectionTag";

const FAQS = [
  {
    q: "How much does your service cost?",
    a: "Our pricing is customised to your market, goals, and the services you need. Book a discovery call to receive a tailored proposal.",
  },
  {
    q: "What makes your guarantee different?",
    a: "We eliminate monthly retainers entirely. If we don't deliver closed deals within your contract term, we refund your full investment — no questions asked.",
  },
  {
    q: "Do you work with South African agents?",
    a: "Absolutely. We specialise in working with South African real estate professionals and understand the local market across Cape Town, Johannesburg, Durban, and beyond.",
  },
  {
    q: "What's included in your services?",
    a: "Lead generation, ISA services, CRM & nurturing, and done-for-you marketing — all handled in-house by our expert team. Zero outsourcing.",
  },
  {
    q: "How quickly can I expect results?",
    a: "Most clients see qualified appointments within the first 2–4 weeks. Our guarantee ensures you're protected either way.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "We work on partnership agreements, not month-to-month retainers. The length depends on your goals — we'll discuss this on the discovery call.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`border rounded-s, px-6 py-5 cursor-pointer mb-2.5 transition-all duration-200 ${
        open ? "border-brand bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <span className="font-bold text-sm text-slate-900 flex-1">{q}</span>
        {open ? (
          <FiChevronUp size={17} className="text-brand flex-shrink-0" />
        ) : (
          <FiChevronDown size={17} className="text-slate-400 flex-shrink-0" />
        )}
      </div>
      {open && <p className="text-slate-500 text-sm leading-relaxed mt-3">{a}</p>}
    </div>
  );
}

export default function Faq() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <SectionTag icon={FiZap}>FAQ</SectionTag>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
            Frequently Asked <span className="text-brand">Questions</span>
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            Everything you need to know about working with us.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          {FAQS.map((f) => (
            <FAQItem key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
