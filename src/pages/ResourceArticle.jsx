import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResourceLayout, { BookCallCta } from "../components/resources/ResourceLayout";
import NotFound from "./NotFound";
import { usePageMeta, SITE_URL } from "../hooks/usePageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { ARTICLES, findArticle, formatDate } from "../lib/resources";
import { AUTHOR } from "../config/schema";

/**
 * Typography for the Markdown body, kept here rather than in a plugin so
 * the guides look like the rest of the site and nothing else.
 */
const PROSE = [
  "text-[17px] leading-relaxed text-slate-700",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-slate-900",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900",
  "[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
  "[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2",
  "[&_strong]:text-slate-900",
].join(" ");

export default function ResourceArticle() {
  const { slug } = useParams();
  const article = findArticle(slug);
  return article ? <Article article={article} /> : <NotFound />;
}

function Article({ article }) {
  const navigate = useNavigate();
  const path = `/resources/${article.slug}`;
  const url = `${SITE_URL}${path}`;

  usePageMeta({
    title: `${article.title} | EstateKit`,
    description: article.description,
    path,
    type: "article",
  });

  const schema = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.publishedDate,
        dateModified: article.updatedDate,
        mainEntityOfPage: url,
        author: {
          "@type": "Person",
          name: AUTHOR.name,
          jobTitle: AUTHOR.role,
          worksFor: { "@id": `${SITE_URL}/#organization` },
        },
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
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
    [article, url],
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

  const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <ResourceLayout>
      <article className="mx-auto max-w-2xl px-4 pt-10 pb-14 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link to="/resources" className="hover:text-brand">Resources</Link>
        </nav>

        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{article.title}</h1>

        <p className="mt-4 text-sm text-slate-500">
          By <span className="font-semibold text-slate-700">{AUTHOR.name}</span>, founder of EstateKit
          <span aria-hidden="true"> · </span>
          Last updated <time dateTime={article.updatedDate}>{formatDate(article.updatedDate)}</time>
        </p>

        <aside aria-label="Short answer" className="mt-8 border-l-4 border-brand bg-slate-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-widest text-brand">Short answer</p>
          <p className="mt-2 text-[17px] leading-relaxed text-slate-800">{article.shortAnswer}</p>
        </aside>

        <div className={`mt-8 ${PROSE}`} onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: article.html }} />

        <section aria-labelledby="faq" className="mt-12 border-t border-slate-100 pt-8">
          <h2 id="faq" className="text-2xl font-bold">Frequently asked questions</h2>
          {article.faq.map((f) => (
            <div key={f.question} className="mt-6">
              <h3 className="text-lg font-bold text-slate-900">{f.question}</h3>
              <div
                className={PROSE}
                onClick={onBodyClick}
                dangerouslySetInnerHTML={{ __html: f.answerHtml }}
              />
            </div>
          ))}
        </section>

        <nav aria-label="Related" className="mt-12 border-t border-slate-100 pt-8 text-[17px]">
          <h2 className="text-lg font-bold">Keep reading</h2>
          <ul className="mt-3 space-y-2">
            {more.map((a) => (
              <li key={a.slug}>
                <Link to={`/resources/${a.slug}`} className="font-semibold text-brand underline underline-offset-2">
                  {a.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/results" className="font-semibold text-brand underline underline-offset-2">
                Results from agents we work with
              </Link>
            </li>
            <li>
              <Link to="/resources" className="font-semibold text-brand underline underline-offset-2">
                All guides
              </Link>
            </li>
          </ul>
        </nav>
      </article>

      <BookCallCta />
    </ResourceLayout>
  );
}
