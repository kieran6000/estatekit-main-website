import { FiStar } from "react-icons/fi";
import SectionTag from "./SectionTag";
import Stars from "./Stars";

const TESTIMONIALS = [
  {
    text: "The fact that I can talk to you - a person. The telephonic help",
    name: "Bennie Bell",
    role: "Real Estate Professional",
  },
  {
    text: "Would definitely recommend EstateKit to any other Realtors looking to up their marketing game. Incredible results from day one.",
    name: "Avery Marcoux",
    role: "REALTOR",
  },
  {
    text: "A hard working team that will communicate better than any company I've ever worked with. Absolutely fantastic experience.",
    name: "Ben Robitaille",
    role: "Real Estate Professional",
  },
];

function TestimonialCard({ text, name, role }) {
  return (
    <div className="bg-white border border-slate-200 rounded p-2 hover:border-brand hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 h-fit">
      <Stars />
      <p className="text-slate-500 text-sm leading-relaxed mt-4 mb-5 italic">"{text}"</p>
      <hr className="border-slate-200 mb-4" />
      <p className="font-extrabold text-slate-900 text-sm">{name}</p>
      <p className="text-slate-400 text-xs mt-0.5">{role}</p>
    </div>
  );
}

export default function TestimonialsGrid() {
  return (
    <section className="py-24 bg-slate-50 hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <SectionTag icon={FiStar}>Client Stories</SectionTag>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
            What Our Clients <span className="text-brand">Say</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            Real results from real estate professionals across South Africa
            and beyond.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
