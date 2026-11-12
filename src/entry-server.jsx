/**
 * Build-time entry: renders one route to an HTML string.
 *
 * Only scripts/prerender.mjs uses this. Nothing here runs in the browser.
 * renderToString never runs effects, and every tracker on the site (Pixel,
 * Discord cards, dashboard writes, the booking calendar fetch) lives in an
 * effect or a click handler, so rendering a page cannot send anything.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { HeadContext, createHeadCollector } from "./lib/head";
import { setRenderTime } from "./lib/renderClock";
import { PRERENDER_ROUTES } from "./routes";
import { ARTICLES, articleSource, preloadForPath } from "./lib/resources";
import { AUTHOR } from "./config/schema";

export const routes = [
  ...PRERENDER_ROUTES,
  "/resources",
  ...ARTICLES.map((a) => `/resources/${a.slug}`),
  AUTHOR.path,
];

/** For the sitemap: resource pages that aren't in public/sitemap.xml. */
export const sitemapExtras = [
  { path: "/resources" },
  ...ARTICLES.map((a) => ({ path: `/resources/${a.slug}`, updatedDate: a.updatedDate })),
  { path: AUTHOR.path },
];

/** For preloading: each article page and the source file its text lives in. */
export const articleFiles = Object.fromEntries(
  ARTICLES.map((a) => [`/resources/${a.slug}`, articleSource(a.slug)]),
);

export async function render(url, builtAt) {
  await preloadForPath(url);
  setRenderTime(builtAt);
  const head = createHeadCollector();
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={head.report}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  );
  return { html, head };
}
