import { useMemo } from "react";
import { Link } from "react-router-dom";
import ResourceLayout, { BookCallCta } from "../components/resources/ResourceLayout";
import { usePageMeta, SITE_URL } from "../hooks/usePageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { ARTICLES, formatDate } from "../lib/resources";
import { AUTHOR, AUTHOR_ID } from "../config/schema";

/**
 * The author page every guide's byline links to. Its job is to show that
 * the guides come from a real, named person at a real business. Bio and
 * profile links live in src/config/schema.js.
 */
export default function Author() {
  const url = `${SITE_URL}${AUTHOR.path}`;

  usePageMeta({
    title: `${AUTHOR.name}, ${AUTHOR.role}`,
    description: AUTHOR.bio[0],
    path: AUTHOR.path,
    image: AUTHOR.photo ? `${SITE_URL}${AUTHOR.photo}` : undefined,
    type: "profile",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${url}#webpage`,
      url,
      name: `${AUTHOR.name}, ${AUTHOR.role}`,
      mainEntity: {
        "@type": "Person",
        "@id": AUTHOR_ID,
        name: AUTHOR.name,
        jobTitle: AUTHOR.role,
        description: AUTHOR.bio.join(" "),
        url,
        ...(AUTHOR.photo ? { image: `${SITE_URL}${AUTHOR.photo}` } : {}),
        ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    }),
    [url],
  );
  useJsonLd(schema, "ek-page-jsonld");

  return (
    <ResourceLayout>
      <section className="mx-auto max-w-2xl px-4 pt-14 pb-10 sm:px-6">
        <div className="flex items-center gap-5">
          {AUTHOR.photo ? (
            <img
              src={AUTHOR.photo}
              alt={AUTHOR.name}
              width="96"
              height="96"
              className="h-24 w-24 flex-shrink-0 rounded-full bg-slate-100 object-cover"
            />
          ) : null}
          <div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{AUTHOR.name}</h1>
            <p className="mt-1 text-base font-semibold text-slate-500">{AUTHOR.role}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-slate-700">
          {AUTHOR.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {AUTHOR.sameAs.length ? (
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            {AUTHOR.sameAs.map((href) => (
              <li key={href}>
                <a href={href} rel="me noopener" target="_blank" className="font-semibold text-brand underline underline-offset-2">
                  {new URL(href).hostname.replace(/^www\./, "")}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section aria-labelledby="guides" className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <h2 id="guides" className="text-xl font-bold">Guides by {AUTHOR.name.split(" ")[0]}</h2>
        <ul className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="py-5">
              <Link to={`/resources/${a.slug}`} className="text-lg font-bold leading-snug hover:text-brand">
                {a.title}
              </Link>
              <p className="mt-1 text-sm text-slate-400">Updated {formatDate(a.updatedDate)}</p>
            </li>
          ))}
        </ul>
      </section>

      <BookCallCta />
    </ResourceLayout>
  );
}
