import { useEffect } from "react";

const SITE_URL = "https://estatekit.co";

function upsertMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function upsertMetaByProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function upsertCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

/**
 * Sets document.title plus meta description/canonical/Open Graph/Twitter
 * card tags for the current route. Zero-dependency stand-in for
 * react-helmet — fine for a single-page-at-a-time SPA with no SSR.
 *
 * @param {object} config
 * @param {string} config.title
 * @param {string} config.description
 * @param {string} config.path - route path, e.g. "/juani-results"
 * @param {string} [config.image] - absolute OG image URL; omitted entirely if not set (no site-wide
 *   OG image exists yet — pass one explicitly per page once you have branded social-preview art)
 * @param {string} [config.type] - og:type, defaults to "website"
 * @param {boolean} [config.noindex] - set to keep this route out of search results (404s, thank-you pages)
 */
export function usePageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;

    const tags = [
      upsertMetaByName("description", description),
      upsertMetaByName("robots", noindex ? "noindex, nofollow" : "index, follow"),
      upsertMetaByProperty("og:title", title),
      upsertMetaByProperty("og:description", description),
      upsertMetaByProperty("og:url", url),
      upsertMetaByProperty("og:type", type),
      upsertMetaByName("twitter:card", image ? "summary_large_image" : "summary"),
      upsertMetaByName("twitter:title", title),
      upsertMetaByName("twitter:description", description),
    ];
    if (image) {
      tags.push(upsertMetaByProperty("og:image", image), upsertMetaByName("twitter:image", image));
    }
    const canonical = upsertCanonical(url);

    return () => {
      tags.forEach((el) => el.remove());
      canonical.remove();
    };
  }, [title, description, path, image, type, noindex]);
}
