import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResourceLayout, { ArticleCta } from "../components/resources/ResourceLayout";
import WistiaPlayer from "../components/WistiaPlayer";
import NotFound from "./NotFound";
import { usePageMeta, SITE_URL } from "../hooks/usePageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { ARTICLES, findArticle, formatDate, getLoadedArticle, loadArticle } from "../lib/resources";
import { AUTHOR, AUTHOR_REF } from "../config/schema";

/**
 * Typography for the Markdown body, kept here rather than in a plugin so
 * the guides look like the rest of the site and nothing else. The boxes
 * (:::mistakes, :::proof) and tables are styled in index.css.
 */
const PROSE = [
  "text-[17px] leading-relaxed text-slate-700",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-slate-900",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900",
  "[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
  "[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2",
  "[&_strong]:text-slate-900",
].join(" ");

const LINK = "font-semibold text-brand underline underline-offset-2";

export default function ResourceArticle() {
  const { slug } = useParams();
  const meta = findArticle(slug);
  // Keyed so moving between guides starts each one fresh.
  return meta ? <Article key={meta.slug} meta={meta} /> : <NotFound />;
}

/**
 * The full text is its own file (see lib/resources.js). A prerendered visit
 * has it before React starts, so this renders complete the first time. A
 * click from another page shows the title and short answer straight away,
 * and the rest a moment later.
 */
function useFullArticle(slug) {
  const [article, setArticle] = useState(() => getLoadedArticle(slug));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (article) return;
    let live = true;
    loadArticle(slug).then(
      (a) => live && setArticle(a),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [article, slug]);

  return { article, failed };
}

function Article({ meta }) {
  const navigate = useNavigate();
  const { article, failed } = useFullArticle(meta.slug);
  const path = `/resources/${meta.slug}`;
  const url = `${SITE_URL}${path}`;

  usePageMeta({
    title: `${meta.title} | EstateKit`,
    description: meta.description,
    path,
    type: "article",
    // Social cards need a real raster image; an inlined SVG chart won't do.
    image: meta.image?.startsWith("/") && !meta.image.endsWith(".svg") ? `${SITE_URL}${meta.image}` : undefined,
  });

  const schema = useMemo(
    () =>
      article && [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          headline: meta.title,
          description: meta.description,
          ...(meta.image?.startsWith("/") ? { image: `${SITE_URL}${meta.image}` } : {}),
          datePublished: meta.publishedDate,
          dateModified: meta.updatedDate,
          mainEntityOfPage: url,
          author: { ...AUTHOR_REF, jobTitle: AUTHOR.role },
          publisher: { "@id": `${SITE_URL}/#organization` },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: article.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answerText },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` },
            { "@type": "ListItem", position: 3, name: meta.title, item: url },
          ],
        },
      ],
    [article, meta, url],
  );
  useJsonLd(schema, "ek-page-jsonld");

  // Links written in the Markdown are plain <a> tags. Same-site ones go
  // through the router so they don't reload the page.
  const onBodyClick = useCallback(
    (e) => {
      const a = e.target.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  const more = ARTICLES.filter((a) => a.slug !== meta.slug).slice(0, 3);

  return (
    <ResourceLayout>
      <article className="mx-auto max-w-2xl px-4 pt-10 pb-14 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link to="/resources" className="hover:text-brand">Resources</Link>
        </nav>

        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{meta.title}</h1>

        <p className="mt-4 text-sm text-slate-500">
          By{" "}
          <Link to={AUTHOR.path} rel="author" className="font-semibold text-slate-700 hover:text-brand">
            {AUTHOR.name}
          </Link>
          , founder of EstateKit
          <span aria-hidden="true"> · </span>
          Last updated <time dateTime={meta.updatedDate}>{formatDate(meta.updatedDate)}</time>
        </p>

        {meta.image ? (
          <img
            src={meta.image}
            alt={meta.imageAlt}
            width={meta.imageWidth}
            height={meta.imageHeight}
            fetchpriority="high"
            className="mt-8 h-auto w-full rounded-xl border border-slate-200 bg-slate-50"
          />
        ) : null}

        <aside aria-label="Short answer" className="mt-8 border-l-4 border-brand bg-slate-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-widest text-brand">Short answer</p>
          <p className="mt-2 text-[17px] leading-relaxed text-slate-800">{meta.shortAnswer}</p>
        </aside>

        {article ? (
          <>
            <div className="mt-8">
              {article.body.map((part, i) =>
                part.video ? (
                  <figure key={i} className="my-8">
                    <WistiaPlayer mediaId={part.video} />
                    {part.caption ? (
                      <figcaption className="mt-2 text-sm text-slate-500">{part.caption}</figcaption>
                    ) : null}
                  </figure>
                ) : (
                  <div
                    key={i}
                    className={`ek-article ${PROSE}`}
                    onClick={onBodyClick}
                    dangerouslySetInnerHTML={{ __html: part.html }}
                  />
                ),
              )}
            </div>

            <section aria-labelledby="faq" className="mt-12 border-t border-slate-100 pt-8">
              <h2 id="faq" className="text-2xl font-bold">Frequently asked questions</h2>
              {article.faq.map((f) => (
                <div key={f.question} className="mt-6">
                  <h3 className="text-lg font-bold text-slate-900">{f.question}</h3>
                  <div
                    className={`ek-article ${PROSE}`}
                    onClick={onBodyClick}
                    dangerouslySetInnerHTML={{ __html: f.answerHtml }}
                  />
                </div>
              ))}
            </section>
          </>
        ) : failed ? (
          <p className="mt-8 text-[17px] text-slate-700">
            This guide didn't load.{" "}
            <a href={path} className={LINK}>Try again</a>
          </p>
        ) : (
          <div aria-busy="true" className="mt-8 min-h-[50vh]" />
        )}

        <nav aria-label="Related" className="mt-12 border-t border-slate-100 pt-8 text-[17px]">
          <h2 className="text-lg font-bold">Keep reading</h2>
          <ul className="mt-3 space-y-2">
            {more.map((a) => (
              <li key={a.slug}>
                <Link to={`/resources/${a.slug}`} className={LINK}>
                  {a.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/results" className={LINK}>
                Results from agents we work with
              </Link>
            </li>
            <li>
              <Link to="/resources" className={LINK}>
                All guides
              </Link>
            </li>
          </ul>
        </nav>
      </article>

      <ArticleCta article={meta} />
    </ResourceLayout>
  );
}
