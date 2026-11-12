import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

/**
 * One guide as a card: cover image, title, description. Used on /resources
 * and in the homepage's guides section, styled like the homepage's service
 * cards so the two pages feel like one site.
 */
export default function GuideCard({ article, as: Heading = "h3" }) {
  return (
    <Link
      to={`/resources/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded border-2 border-slate-200 bg-white text-left transition-all duration-200 hover:border-brand hover:shadow-lg hover:shadow-blue-50"
    >
      {article.image ? (
        <div className="aspect-[16/9] overflow-hidden border-b border-slate-100 bg-slate-50">
          <img
            src={article.image}
            alt=""
            width={article.imageWidth}
            height={article.imageHeight}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-brand">
          {article.title}
        </Heading>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{article.description}</p>
        <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
          Read the guide <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
