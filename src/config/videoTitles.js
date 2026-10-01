/**
 * Wistia media id -> the label the page actually shows.
 *
 * Wistia's own `video.name()` returns whatever the media was called on upload,
 * which is rarely what a closer would recognise. Mapping the ids here means
 * engagement logs read "Juani M. — 11 Listings" instead of a slug.
 */
export const VIDEO_TITLES = {
  // Testimonials
  qgus1atule: "Juani M. — 11 listings, 1 closed deal",
  "98bvd7qirv": "Nielen B. — 4 mandates in 35 days",
  "5u31s8now8": "Sakhile K. — 3 sole mandates in 3 weeks",
  ahm5osiwq8: "Lebogang M. — 12 appointments in 6 days",

  // Sales videos
  z6oqli7c8o: "Pitch VSL",
  d5t4u6pqqp: "Booking details (thank-you)",

  // Thank-you page objection breakouts
  j6su0ot613: "Objection — aren't you just another agency",
  "2o1u6hnr93": "Objection — will this work in my area",
  "7sajw5e6lw": "Objection — what does this cost",
  "6ptgqaxm2w": "Objection — what if it doesn't work",
  ol57vm4r9a: "Objection — what do you actually do",
};

export function videoTitle(mediaId, fallback) {
  return VIDEO_TITLES[mediaId] || fallback || mediaId;
}
