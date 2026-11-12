/**
 * Every article in content/resources, already parsed at build time by
 * scripts/markdownResources.js. Newest first.
 */
const modules = import.meta.glob("../../content/resources/*.md", {
  eager: true,
  import: "default",
});

export const ARTICLES = Object.values(modules)
  .filter(Boolean)
  .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

export const findArticle = (slug) => ARTICLES.find((a) => a.slug === slug) || null;

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
