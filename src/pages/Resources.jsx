import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import ResourceLayout, { BookCallCta } from "../components/resources/ResourceLayout";
import GuideCard from "../components/resources/GuideCard";
import { usePageMeta, SITE_URL } from "../hooks/usePageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { ARTICLES, findArticle, formatDate } from "../lib/resources";
import { AUTHOR } from "../config/schema";

const TITLE = "Seller Lead Guides for South African Estate Agents | EstateKit";
const DESCRIPTION =
  "Straight answers on Facebook ads, seller leads and follow-up for South African estate agents, built on real numbers from EstateKit's own campaigns.";

/**
 * Headline numbers from the guides, each linking to the guide that explains
 * it. Update these when the guides' numbers are refreshed; a stat whose
 * guide doesn't exist yet is simply left out.
 */
const STATS = [
  {
    value: "R11.68",
    label: "average cost per seller lead across 7 areas",
    slug: "facebook-seller-lead-cost-south-africa",
  },
  {
    value: "67%",
    label: "of seller leads arrive outside office hours",
    slug: "how-to-get-seller-leads-from-facebook-ads",
  },
  {
    value: "32%",
    label: "of homeowners plan to sell within 3 months",
    slug: "free-home-evaluation-ads",
  },
];

export default function Resources() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: "/resources" });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/resources#webpage`,
      url: `${SITE_URL}/resources`,
      name: "EstateKit Resources",
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: ARTICLES.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/resources/${a.slug}`,
          name: a.title,
        })),
      },
    }),
    [],
  );
  useJsonLd(schema, "ek-page-jsonld");

  const featured = ARTICLES.find((a) => a.featured === "true") || ARTICLES[0];
  const rest = ARTICLES.filter((a) => a !== featured);
  const stats = STATS.filter((s) => findArticle(s.slug));

  return (
    <ResourceLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 pt-14 pb-12 sm:px-6 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand shadow-sm">
            <FiBookOpen size={14} /> Free guides
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.1] text-slate-900 sm:text-5xl">
            Seller lead guides for <span className="text-brand">South African</span> estate agents
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Straight answers on Facebook ads, seller leads and follow-up, built on
            real numbers from the campaigns we run for agents across the country.
          </p>

          {stats.length ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/resources/${s.slug}`}
                    className="group block h-full rounded border-2 border-slate-200 bg-white p-5 transition-all duration-200 hover:border-brand hover:shadow-lg hover:shadow-blue-50"
                  >
                    <p className="text-3xl font-black text-brand">{s.value}</p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-slate-700">{s.label}</p>
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-400 transition-colors group-hover:text-brand">
                      Where this comes from <FiArrowRight size={12} />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Start here */}
      {featured ? (
        <section aria-labelledby="start-here" className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 id="start-here" className="text-xs font-black uppercase tracking-widest text-slate-400">
              Start here
            </h2>
            <Link
              to={`/resources/${featured.slug}`}
              className="group mt-4 grid overflow-hidden rounded border-2 border-slate-200 bg-white transition-all duration-200 hover:border-brand hover:shadow-lg hover:shadow-blue-50 md:grid-cols-2"
            >
              {featured.image ? (
                <div className="overflow-hidden border-b border-slate-100 bg-slate-50 md:border-b-0 md:border-r">
                  <img
                    src={featured.image}
                    alt=""
                    width={featured.imageWidth}
                    height={featured.imageHeight}
                    className="h-full w-full object-cover object-left-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              ) : null}
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-2xl font-black leading-tight text-slate-900 transition-colors group-hover:text-brand sm:text-3xl">
                  {featured.title}
                </p>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{featured.shortAnswer}</p>
                <p className="mt-4 text-sm text-slate-400">Updated {formatDate(featured.updatedDate)}</p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                  Read the guide <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      {/* Everything else */}
      {rest.length ? (
        <section aria-labelledby="all-guides" className="px-4 pt-10 pb-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 id="all-guides" className="text-xs font-black uppercase tracking-widest text-slate-400">
              More guides
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {rest.map((a) => (
                <GuideCard key={a.slug} article={a} as="h3" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Who writes these */}
      <section className="border-t border-slate-100 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 sm:flex-row sm:items-center">
          {AUTHOR.photo ? (
            <img
              src={AUTHOR.photo}
              alt={AUTHOR.name}
              width="64"
              height="64"
              loading="lazy"
              className="h-16 w-16 flex-shrink-0 rounded-full bg-slate-100 object-cover"
            />
          ) : null}
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">
            Written by{" "}
            <Link to={AUTHOR.path} rel="author" className="font-bold text-slate-900 hover:text-brand">
              {AUTHOR.name}
            </Link>
            , founder of EstateKit. Every number in these guides comes from our own
            campaigns, and each guide says where its numbers came from.
          </p>
        </div>
      </section>

      <BookCallCta />
    </ResourceLayout>
  );
}
