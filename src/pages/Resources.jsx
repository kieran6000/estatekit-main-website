import { useMemo } from "react";
import { Link } from "react-router-dom";
import ResourceLayout, { BookCallCta } from "../components/resources/ResourceLayout";
import { usePageMeta, SITE_URL } from "../hooks/usePageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { ARTICLES, formatDate } from "../lib/resources";

const TITLE = "Resources for South African Estate Agents | EstateKit";
const DESCRIPTION =
  "Plain guides for South African estate agents on Meta ads, seller lead funnels and following up with leads, written by the team at EstateKit.";

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

  return (
    <ResourceLayout>
      <section className="mx-auto max-w-3xl px-4 pt-14 pb-6 sm:px-6">
        <h1 className="text-4xl font-black leading-tight sm:text-5xl">Resources</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Guides for South African estate agents on getting seller leads,
          running Meta ads and following up with the leads you get.
        </p>
      </section>

      <section aria-label="Guides" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <ul className="divide-y divide-slate-100 border-y border-slate-100">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="py-6">
              <h2 className="text-xl font-bold leading-snug">
                <Link to={`/resources/${a.slug}`} className="hover:text-brand">
                  {a.title}
                </Link>
              </h2>
              <p className="mt-2 text-base leading-relaxed text-slate-600">{a.description}</p>
              <p className="mt-2 text-sm text-slate-400">
                Updated {formatDate(a.updatedDate)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <BookCallCta />
    </ResourceLayout>
  );
}
