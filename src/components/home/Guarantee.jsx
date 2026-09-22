import { FiShield, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import SectionTag from "./SectionTag";

const GUARANTEE = [
  {
    Icon: FiShield,
    title: "Zero Risk",
    desc: "No monthly retainers. Partnership agreements with money-back guarantees if we don't deliver results within your contract term.",
  },
  {
    Icon: FiTrendingUp,
    title: "Performance-Guaranteed",
    desc: "We're committed to delivering closed deals within your agreement timeline. Your success drives our partnership.",
  },
  {
    Icon: FiDollarSign,
    title: "Guaranteed ROI",
    desc: "Our track record speaks for itself. We guarantee results within your contract term, or we refund your service investment.",
  },
];

function GuaranteeCard({ Icon, title, desc }) {
  return (
    <div className="bg-white border border-slate-200 rounded p-8 text-center hover:border-brand hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-brand mx-auto mb-4">
        <Icon size={22} />
      </div>
      <h3 className="font-extrabold text-base text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Guarantee() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center">
          <SectionTag icon={FiShield}>Our Guarantee</SectionTag>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
          We <span className="text-brand">GUARANTEE</span> Results
          <br className="hidden sm:block" />
          Within Your Partnership Agreement
        </h2>
        <p className="text-slate-500 text-base max-w-lg mx-auto mb-14">
          The only real estate marketing agency that refunds your investment
          if we don't deliver.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
          {GUARANTEE.map((g) => (
            <GuaranteeCard key={g.title} {...g} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto border-2 border-brand rounded bg-brand px-3 sm:px-12 py-3 text-white text-lg font-semibold leading-relaxed">
          We're so confident in our ability to generate results that we've
          eliminated monthly retainers entirely. Our partnership agreements
          are performance-guaranteed: if we don't deliver closed deals within
          your contract term, we refund your service investment. No hidden
          fees — just transparent partnerships with guaranteed results.
        </div>
      </div>
    </section>
  );
}
