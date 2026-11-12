/**
 * Routes that are built to static HTML (see scripts/prerender.mjs).
 *
 * These are the indexable pages, the same list as public/sitemap.xml. The
 * resources index and every article are added on top by entry-server.jsx,
 * straight from content/resources, so a new guide never needs listing here.
 *
 * Deliberately missing: /thank-you, /training/thank-you, /rebook and
 * /rebook/link. They are noindex, read the visitor's own query string, and
 * have nothing a crawler should see, so they stay client-rendered from the
 * empty app shell.
 */
export const PRERENDER_ROUTES = [
  "/",
  "/training",
  "/training-vsl",
  "/juani-results",
  "/sakhile-results",
  "/pitch",
  "/pitch-vsl",
  "/pitch/res",
  "/webinar",
  "/results",
];

/** Client-only routes, served from the empty shell (app.html). */
export const SHELL_ROUTES = ["/thank-you", "/training/thank-you", "/rebook", "/rebook/link"];
