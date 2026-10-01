// ─────────────────────────────────────────────────────────────────────────
// Free Training funnel config — /training, /training-vsl, /training/thank-you
//
// Everything below marked TODO needs a real value before you send ad
// traffic here. Nothing will crash if you launch with placeholders — the
// video slots just show a "coming soon" placeholder and the WhatsApp
// button will point at a dead link until you fill them in.
// ─────────────────────────────────────────────────────────────────────────

// EstateKit-hosted registration/calendar embed for "reserve your seat"
// (replaces the old Cal.com embed on /training, /training-vsl,
// /juani-results, /sakhile-results). NOTE: since this is a plain iframe to
// a page we don't control, we have no in-page signal when a booking
// succeeds — confirm this page still redirects to /training/thank-you with
// attendeeName/attendeeEmail/attendeeStartTime/phone query params (same as
// the old Cal.com "Redirect URL on booking" setting did), otherwise the
// thank-you page's tracking and the WhatsApp confirm flow have no data to
// work with.
export const TRAINING_BOOKING_EMBED_URL = "https://media.estatekit.co/free-training";

// TODO: Wistia media ID for the training VSL/teaser shown on /training-vsl.
export const TRAINING_VSL_MEDIA_ID = "";

// YouTube video testimonials — shown on /training (and /training-vsl) and on
// each agent's dedicated results landing page (/juani-results, /sakhile-results).
export const JUANI_YOUTUBE_ID = "vjQp-IXkHpA";
export const SAKHILE_YOUTUBE_ID = "7YA7e63M9EM";

// TODO: your free WhatsApp group invite link (chat.whatsapp.com/...).
export const TRAINING_WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/REPLACE_ME";

// TODO: WhatsApp number (intl format, no +) the "Confirm My Seat" button
// on the thank-you page falls back to when no phone param is present.
export const TRAINING_WHATSAPP_FALLBACK_NUMBER = "264858149056";

// FAQ breakout videos — same 8 objections/questions, shown on both the
// training landing pages and the thank-you page. Drop each Wistia media
// ID in as you record it; until then the section shows a placeholder.
export const FAQ_VIDEOS = [
  {
    q: "I tried digital marketing before and the leads were rubbish — why would this be different?",
    a: "If you've tried digital marketing before and got useless leads or zero calls back, you're not alone. Most agencies just post standard social media content or run basic ads with no filtering behind them. We don't. We build an end-to-end seller qualification funnel that filters out buyers, renters, and window-shoppers before they ever hit your calendar and on this free training you'll see how we've built this system.",
    mediaId: "",
  },
  {
    q: "What happens immediately after I register below?",
    a: "The moment you enter your details below, you get access to our free WhatsApp group where we'll send you exclusive resources that will give you actionable steps towards your success. Go ahead, fill in your details below, and I'll see you inside the training in less than 30 seconds.",
    mediaId: "",
  },
  {
    q: "Does this system actually work in South Africa?",
    a: "This was built specifically for the South African property market. It's actively generating sole mandates right now in Sandton, Centurion, Pretoria, Cape Town, and Durban. In the training, you'll see exact results from local agents working in the same farming area you are.",
    mediaId: "",
  },
  {
    q: "Is cold calling really dead under POPI, or can I just keep prospecting the old way?",
    a: "The POPI Act and CPA amendments legally destroyed the traditional cold-calling playbook overnight. If you're spending hours calling portal listings just to hit a 10% response rate, you're on a monthly hamster wheel. Register for the free training to see how top agents are replacing manual cold outreach with automated seller attraction systems that conform 100% to local laws.",
    mediaId: "",
  },
  {
    q: "If I register, am I going to get bombarded with sales calls?",
    a: "Nobody likes spam, and we respect your privacy. Registering for this training simply gives you access to our free WhatsApp group where we'll send free resources and guides. We won't sell your info, and you won't get bombarded with aggressive sales calls. You can watch the training and decide if it's right for you.",
    mediaId: "",
  },
  {
    q: "Is this actually legit, or some kind of scheme?",
    a: "Healthy skepticism is a good thing — there are plenty of bad offers out there. That's why on this free training, we don't pitch secret tricks. We show real backend campaign data, actual numbers, and verified case studies from real South African estate agents currently using the system. Watch the training, check the proof, and judge it for yourself.",
    mediaId: "",
  },
  {
    q: "I already work with a marketing person/agency — why do I need this too?",
    a: "Most marketing people or agencies just post generic social media content or run simple ad campaigns with zero qualification behind them. We don't do social media management. We build dedicated seller qualification funnels designed specifically to deliver exclusive seller mandates. This isn't meant to replace your agency — it fills the exact gap they're missing.",
    mediaId: "",
  },
  {
    q: "Does this work for my specific market — luxury, commercial, or a smaller town?",
    a: "Yes — because the psychology of a property owner wanting to sell doesn't change whether you're handling luxury estates, commercial properties, or working in a smaller town. On the training, you'll see how we tailor targeting and qualification down to specific suburbs and property tiers so you attract the exact listings you specialize in.",
    mediaId: "",
  },
];

// Case study stats pulled from the ad scripts — shown on the landing pages.
export const CASE_STUDIES = [
  {
    initials: "J",
    name: "Juani",
    location: "Boksburg",
    stat: "11 listings in 6 weeks",
    detail:
      "30 booked appointments, 11 listings, and 1 closed deal — one of those listings sold just 8 days after she put it on the market.",
  },
  {
    initials: "M",
    name: "Maritha",
    stat: "6 listings, zero cold calls",
    detail:
      "Six listings and not one of them came from cold calling — every seller reached out to her first.",
  },
  {
    initials: "S",
    name: "Sakhile",
    stat: "4 sole mandates in 2 weeks",
    detail:
      "Secured 4 sole mandates, all inside a two-week span, using the same system.",
  },
];
