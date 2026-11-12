import { Link } from "react-router-dom";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import SectionTag from "./SectionTag";
import GuideCard from "../resources/GuideCard";
import { ARTICLES } from "../../lib/resources";

/**
 * The newest guides, for visitors who aren't ready to book yet. Sits after
 * the booking section so it never pulls anyone away before they reach it.
 */
export default function Guides() {
  const featured = ARTICLES.find((a) => a.featured === "true");
  const guides = [featured, ...ARTICLES.filter((a) => a !== featured)].filter(Boolean).slice(0, 3);
  if (!guides.length) return null;

  return (
    <section id="guides" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <SectionTag icon={FiBookOpen}>Free Guides</SectionTag>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
            Not Ready To Talk Yet? <span className="text-brand">Start Here</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            Plain guides on getting seller leads from Facebook ads, built on real
            numbers from our own campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {guides.map((a) => (
            <GuideCard key={a.slug} article={a} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 rounded border-2 border-slate-200 px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-brand hover:text-brand"
          >
            See all guides <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
