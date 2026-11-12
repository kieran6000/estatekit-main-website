import { SITE_URL } from "../hooks/usePageMeta";

/**
 * The business itself, as schema.org sees it. Shares its @id with the
 * Organization node on /results, so search engines merge the two rather
 * than reading them as different companies.
 */
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "EstateKit",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Done-for-you Meta ads, seller lead funnels and CRM nurture for South African residential estate agents.",
  areaServed: { "@type": "Country", name: "South Africa" },
  founder: { "@type": "Person", name: "Kieran Ouseb" },
};

/** The author line on every resource article. */
export const AUTHOR = {
  name: "Kieran Ouseb",
  role: "Founder of EstateKit",
};
