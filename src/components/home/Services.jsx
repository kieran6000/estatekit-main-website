import { FiTarget, FiUsers, FiDatabase, FiZap, FiCheck } from "react-icons/fi";
import SectionTag from "./SectionTag";

const SERVICES = [
  {
    Icon: FiTarget,
    title: "Lead Generation",
    desc: "Facebook, Instagram, YouTube and Google campaigns designed to generate high-quality leads for your real estate business.",
    bullets: ["Multi-platform advertising", "Targeted campaigns", "ROI-focused strategies"],
  },
  {
    Icon: FiUsers,
    title: "ISA Services",
    desc: "Book appointments on autopilot with our Inside Sales Agents who qualify and nurture your leads around the clock.",
    bullets: ["Experienced ISA's", "24/7 lead follow-up", "Appointment booking"],
  },
  {
    Icon: FiDatabase,
    title: "CRM & Nurturing",
    desc: "Custom CRM setup with 12+ month follow-up sequences to ensure no lead falls through the cracks.",
    bullets: ["Custom CRM setup", "Automated sequences", "Long-term nurturing"],
  },
  {
    Icon: FiZap,
    title: "Done-For-You Marketing",
    desc: "Complete marketing service including landing pages, email campaigns, and full-funnel management.",
    bullets: ["Landing pages", "Email campaigns", "Full-service management"],
  },
];

function ServiceCard({ Icon, title, desc, bullets }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded p-8 hover:border-brand hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-s, bg-brand flex items-center justify-center text-white mb-5">
          <Icon size={22} />
        </div>
        <h3 className="font-extrabold text-lg text-slate-900 mb-2.5">{title}</h3>
      </div>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{desc}</p>
      {bullets.map((b) => (
        <div key={b} className="flex items-center gap-2.5 text-slate-500 text-sm mb-2">
          <span className="flex items-center justify-center flex-shrink-0">
            <FiCheck size={18} className="text-brand" strokeWidth={3} />
          </span>
          {b}
        </div>
      ))}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex justify-center">
            <SectionTag icon={FiZap}>What We Do</SectionTag>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
            How We Help SA Agents <span className="text-brand">Succeed</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            All services done in-house by our expert team. No outsourcing, no
            excuses.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
