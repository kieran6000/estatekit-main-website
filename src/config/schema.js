import { SITE_URL } from "../hooks/usePageMeta";
// A 400px copy of the team photo in assets/kieran.png, which is 1.9 MB.
import avatar from "../../assets/kieran-avatar.webp";

/**
 * The person behind the resource guides. The bio shows on the author page
 * (/authors/kieran-ouseb). Add profile links to `sameAs` (LinkedIn,
 * Instagram, YouTube): they go into the page's schema and help search
 * engines tie the guides to a real person.
 */
export const AUTHOR = {
  name: "Kieran Ouseb",
  role: "Founder of EstateKit",
  path: "/authors/kieran-ouseb",
  photo: avatar,
  bio: [
    "Kieran Ouseb is the founder of EstateKit. Since 2022, EstateKit has run done-for-you Meta ads, seller lead funnels and CRM follow-up for South African residential estate agents.",
  ],
  sameAs: [],
};

export const AUTHOR_ID = `${SITE_URL}${AUTHOR.path}#person`;

/** How articles and the organisation point at the author. */
export const AUTHOR_REF = {
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: AUTHOR.name,
  url: `${SITE_URL}${AUTHOR.path}`,
};

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
  founder: AUTHOR_REF,
};
