/**
 * Every article in content/resources, parsed at build time by
 * scripts/markdownResources.js.
 *
 * Two imports of the same files:
 *   - `?meta`, eager: frontmatter only. Small enough to ship with the app,
 *     and enough for the index, related links and each page's title.
 *   - plain, lazy: the full article as its own file, fetched when someone
 *     opens it. Vite gives each one its own chunk.
 */
const META = import.meta.glob(["../../content/resources/*.md", "!**/README.md"], {
  eager: true,
  import: "default",
  query: "?meta",
});
const LOADERS = import.meta.glob(["../../content/resources/*.md", "!**/README.md"], {
  import: "default",
});

const entries = Object.entries(META).filter(([, meta]) => meta);

/** Frontmatter of every article, newest first. */
export const ARTICLES = entries
  .map(([, meta]) => meta)
  .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

const SOURCE = new Map(entries.map(([path, meta]) => [meta.slug, path]));

export const findArticle = (slug) => ARTICLES.find((a) => a.slug === slug) || null;

/** The article's file, relative to the project root, e.g. for the build manifest. */
export const articleSource = (slug) => SOURCE.get(slug)?.replace(/^(\.\.\/)+/, "");

const loaded = new Map();
const pending = new Map();

/** The full article if it has already been fetched, else null. */
export const getLoadedArticle = (slug) => loaded.get(slug) || null;

/** Fetches the full article once. Resolves to null for an unknown slug. */
export function loadArticle(slug) {
  if (loaded.has(slug)) return Promise.resolve(loaded.get(slug));
  const path = SOURCE.get(slug);
  if (!path) return Promise.resolve(null);
  if (!pending.has(slug)) {
    pending.set(
      slug,
      LOADERS[path]()
        .then((article) => {
          loaded.set(slug, article);
          return article;
        })
        .finally(() => pending.delete(slug)),
    );
  }
  return pending.get(slug);
}

/**
 * Loads whatever a URL needs before its first render. Used before hydrating
 * a prerendered article, and before rendering one at build time, so the
 * first render has the full text and matches the HTML.
 */
export function preloadForPath(pathname) {
  const match = pathname.match(/^\/resources\/([^/]+)\/?$/);
  return match ? loadArticle(match[1]) : Promise.resolve(null);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "2026-11-12" -> "12 November 2026". Done by hand rather than with
 * toLocaleDateString, which formats differently per browser and would make
 * the prerendered HTML disagree with the first render.
 */
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
