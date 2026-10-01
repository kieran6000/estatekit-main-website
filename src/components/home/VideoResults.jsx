import { FiUsers } from "react-icons/fi";
import TestimonialsSection from "../TestimonialsSection";
import SectionTag from "./SectionTag";

export default function VideoResults() {
  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center">
          <SectionTag icon={FiUsers}>Who We Work With</SectionTag>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
          Real Leads, <span className="text-brand">Real Results</span>
        </h2>
        <p className="text-slate-500 text-base max-w-md mx-auto mb-12">
          Get inspired by these realtors' success stories.
        </p>

        <TestimonialsSection />
      </div>
    </section>
  );
}
