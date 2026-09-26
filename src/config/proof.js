/**
 * Every piece of proof on /results, in one place.
 *
 * The page and its Review structured data both read from here, so a
 * testimonial can never appear on screen without also being described to
 * search engines — and the schema's review count can never drift away from
 * what a visitor can actually count on the page.
 */

/** Filmed testimonials. `quote` is what makes them indexable — video isn't. */
export const VIDEO_TESTIMONIALS = [
  {
    mediaId: "qgus1atule",
    name: "Juani M.",
    location: "Boksburg, Gauteng",
    headline: "11 listings and a closed deal in 6 weeks",
    quote:
      "30 booked appointments, 11 listings and 1 closed deal in six weeks. One of those listings sold just 8 days after it went on the market.",
  },
  {
    mediaId: "98bvd7qirv",
    name: "Nielen B.",
    location: "South Africa",
    headline: "4 mandates in 35 days",
    quote:
      "Four signed mandates inside 35 days, without a single cold call to get them.",
  },
  {
    mediaId: "5u31s8now8",
    name: "Sakhile K.",
    location: "South Africa",
    headline: "3 sole mandates in 3 weeks",
    quote:
      "Three sole mandates secured in a three-week span, all from sellers who came to me first.",
  },
  {
    mediaId: "ahm5osiwq8",
    name: "Lebogang M.",
    location: "South Africa",
    headline: "12 appointments in 6 days",
    quote:
      "65 leads at R9 each in three days, and 12 booked appointments out of them within the week.",
  },
];

/** Written reviews. Short, but they are real text a crawler can read. */
export const WRITTEN_REVIEWS = [
  {
    name: "Avery Marcoux",
    role: "Realtor",
    quote:
      "Would definitely recommend EstateKit to any other realtors looking to up their marketing game. Incredible results from day one.",
  },
  {
    name: "Ben Robitaille",
    role: "Real estate professional",
    quote:
      "A hard working team that will communicate better than any company I've ever worked with. Absolutely fantastic experience.",
  },
  {
    name: "Bennie Bell",
    role: "Real estate professional, Centurion",
    quote:
      "The fact that I can talk to you — a person. The telephonic help makes all the difference. 20 appointments in a single week.",
  },
  {
    name: "Maritha",
    role: "Real estate professional",
    quote:
      "Six listings and not one of them came from cold calling. Every seller reached out to me first.",
  },
];

/** Headline numbers. Each one is backed by a testimonial further down. */
export const PROOF_STATS = [
  { figure: "R9–R10", label: "Typical cost per seller lead" },
  { figure: "11", label: "Listings for one agent in 6 weeks" },
  { figure: "65+", label: "Leads in 3 days for another" },
  { figure: "0", label: "Cold calls required" },
];

export const ALL_REVIEWS = [
  ...VIDEO_TESTIMONIALS.map((t) => ({
    name: t.name,
    quote: t.quote,
    role: t.location,
  })),
  ...WRITTEN_REVIEWS,
];
