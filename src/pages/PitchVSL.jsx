import { useCallback, useEffect, useRef, useState } from "react";
import CopyBridge from "../components/CopyBridge";
import SocialProof from "../components/SocialProof";
import TestimonialsSection from "../components/TestimonialsSection";
import TestimonialProof from "../components/TestimonialProof";
import TeamStrip from "../components/TeamStrip";
import QualifyingForm from "../components/QualifyingForm";
import WistiaPlayer from "../components/WistiaPlayer";
import Cal from "@calcom/embed-react";
import { useCalBooking } from "../hooks/useCalBooking";
import { usePageMeta } from "../hooks/usePageMeta";
import { useVideoTracking } from "../hooks/useVideoTracking";
import { logToDiscord, postDiscordEmbed } from "../lib/discord";
import { postToSheet } from "../lib/sheets";
import { formatDuration } from "../lib/analytics";
import heroBg from "../../assets/training-hero-bg.webp";
import logo from "../../assets/primary.svg";

const PitchVSL = () => {
  const isVSLPage = location.pathname.includes("pitch-vsl");
  const calNamespace = isVSLPage ? "10listingappts-vsl" : "10listingappts";
  const calLink = isVSLPage
    ? "estatekit/10listingappts-vsl"
    : "estatekit/10listingappts";

  const [qualification, setQualification] = useState(null);
  const [highlight, setHighlight] = useState(0);
  const { getFields: getVideoFields } = useVideoTracking();
  const arrivedAtRef = useRef(0);
  const inlineRef = useRef(null);
  const pulseTimerRef = useRef(null);

  useEffect(() => {
    arrivedAtRef.current = Date.now();
    postToSheet("pageview", {});
  }, []);

  const getEngagement = useCallback(
    () => ({
      "⏱️ Time on Page": formatDuration(
        Math.round((Date.now() - arrivedAtRef.current) / 1000),
      ),
      ...getVideoFields(),
    }),
    [getVideoFields],
  );

  const handleComplete = useCallback((result) => setQualification(result), []);

  // Every CTA points at the one form. Rather than opening a second copy of it
  // in a modal, we bring them to it and flash it so it's obvious what they
  // were sent to — the pulse is keyed off a counter so repeat clicks re-fire.
  const handleCtaClick = useCallback(() => {
    inlineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    postDiscordEmbed({
      title: "👆 CTA clicked",
      color: 0x0086ff,
      description: [
        `Sent to the application form · ${formatDuration(
          Math.round((Date.now() - arrivedAtRef.current) / 1000),
        )} after landing`,
        getVideoFields()["🎬 Videos Played"]
          ? `🎬 ${getVideoFields()["🎬 Videos Played"]} watched first`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
      timestamp: new Date().toISOString(),
    });

    if (qualification) return;

    // Long enough for the smooth scroll to settle first — a pulse that plays
    // while the page is still moving reads as nothing.
    window.clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(
      () => setHighlight((n) => n + 1),
      700,
    );
  }, [qualification, getVideoFields]);

  useEffect(() => () => window.clearTimeout(pulseTimerRef.current), []);

  // Land them on the outcome once the quiz resolves.
  useEffect(() => {
    if (qualification) {
      inlineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [qualification]);

  usePageMeta({
    title: "Guaranteed Closed Deals or Your Money Back | EstateKit",
    description:
      "A proven system that delivers real listing appointments and closed deals for real estate agents — guaranteed, or your money back.",
    path: isVSLPage ? "/pitch-vsl" : "/pitch",
  });

  const { preload: preloadCalendar } = useCalBooking({
    namespace: calNamespace,
    calLink,
    onBookingSuccessful: (e) => {
      const { name, email, startTime } = e.detail.data;
      const whatsapp = `https://wa.me/264852878236?text=Hi%20${encodeURIComponent(
        name.split(" ")[0],
      )}%20(re:%20${encodeURIComponent(e.detail.data.eventType.title)})`;

      postDiscordEmbed({
        title: `🎉 Booked · ${name}`,
        color: 0x22c55e,
        description: [
          `🗓 ${startTime}`,
          `\`${email}\` · ${e.detail.data.eventType.title}`,
          `[Open WhatsApp](${whatsapp})`,
        ].join("\n"),
        timestamp: new Date().toISOString(),
      });

      postToSheet("booking", { email, startTime });
    },
    onBookingFailed: (e) => {
      logToDiscord("❌ Booking Failed", {
        error: e.detail.data.message.substring(0, 30) + "...",
      });
    },
  });

  // Warm the calendar's availability as soon as the one disqualifying answer
  // is ruled out. Three steps plus the contact form is ample time to fetch it,
  // and the answer that rules the calendar out is the one that skips this.
  const handleAnswer = useCallback(
    (questionId, value) => {
      if (questionId === "ppra_status" && value !== "not_registered") {
        preloadCalendar();
      }
    },
    [preloadCalendar],
  );

  const showCalendar = Boolean(qualification?.qualified);

  return (
    <div className="bg-white text-slate-900 antialiased">
      <div className="bg-red-600 text-white p-2 flex items-center justify-center gap-1 w-full text-center font-bold text-xl leading-none">
        FULL-STATUS PROPERTY PRACTITIONERS
      </div>
      {/* 1. Hero — headline + VSL + primary CTA */}
      <section
        className="relative mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-22 text-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center",
        }}
      >
        {/*OVERLAY COLOR*/}
        <div className="absolute inset-0 bg-white backdrop-blur-[3px] pointer-events-none" />
        <div className="relative">
          {/* Logo */}
          <div className="mb-5 hidden">
            <img src={logo} alt="EstateKit Logo" className="h-8 mx-auto" />
          </div>

          {/* Pre-head */}
          <div className="bg-white hidden transform mx-auto w-fit  text-sm px-3 sm:px-4 py-2 drop-shadow rounded-full text-slate-900 mb-5 font-black tracking-wide flex items-center justify-center gap-1 flex-wrap max-w-full sm:w-fit">
            <span className="text-red-500 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <div className="bg-red-500 rounded-full min-w-2 min-h-2 sm:min-w-3 sm:min-h-3"></div>

              <span>FULL-STATUS PROPERTY PRACTITIONERS!</span>
            </span>
          </div>

          <div>
            {/* Headline */}
            <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight mb-10 mt-5 max-w-5xl mx-auto text-black">
              We{" "}
              <span className="text-brand font-black">
                GUARANTEE{" "}
                <span className="underline decoration-brand font-black underline-offset-2">
                  Closed Deals
                </span>
              </span>{" "}
              Or Your Money Back — A Proven System That Delivers{" "}
              <span className="text-brand font-black">
                Real Results, Without the Risk.
              </span>
            </h1>
            <p className="text-white/80 hidden text-lg sm:text-xl md:text-2xl font-normal max-w-3xl mx-auto drop-shadow my-5">
              Stop wasting time with flaky leads and unpredictable marketing. A
              proven system that delivers real results, without the risk.
            </p>
          </div>

          {/* VSL */}
          {isVSLPage && (
            <div className="my-4 md:my-5 max-w-2xl lg:max-w-3xl mx-auto">
              <WistiaPlayer mediaId="z6oqli7c8o" />
            </div>
          )}

        </div>

        {/* Primary CTA — positioned at bottom edge */}
        <button
          type="button"
          onClick={handleCtaClick}
          className="absolute left-1/2 -translate-x-1/2 inline-block w-11/12 sm:w-auto bg-brand text-white font-bold px-3 sm:px-5 md:px-6 py-4 md:py-5 rounded uppercase tracking-wide hover:shadow-lg transition-shadow z-10"
        >
          <p className="leading-none font-black tracking-normal text-2xl">
            SEE HOW IT WORKS
          </p>
        </button>
      </section>

      <SocialProof />

      {/* Qualifying quiz — the page's single ask, under the logo cloud.
          Once answered, the outcome replaces it in place. */}
      <section
        ref={inlineRef}
        id="qualify"
        className="scroll-mt-6 px-4 sm:px-6 pt-6 pb-10 md:pb-12"
      >
        {!qualification && (
          <>
            <p className="mx-auto font-bold mb-5 max-w-[480px] text-center text-lg leading-relaxed">
Book a strategy call below to learn exactly how our Fully Guaranteed Listing Acquisition system works 👇
            </p>

            <QualifyingForm
              onComplete={handleComplete}
              highlightKey={highlight}
              onAnswer={handleAnswer}
              getEngagement={getEngagement}
            />

            <div className="max-w-2xl lg:max-w-3xl mx-auto mt-5 text-center">
            
              <p className="text-brand text-base md:text-lg font-bold mb-6">
                Backed By Our 100% Money Back Guarantee
              </p>
            </div>
          </>
        )}

        {showCalendar && (
          <p className="mx-auto font-bold mb-5 max-w-[480px] text-center text-lg leading-relaxed">
            Pick a day and time 👇
          </p>
        )}

        {/* Mounts only once they qualify, so their details can be prefilled —
            Cal passes prefill through the iframe URL, so it has to be known at
            mount. `preloadCalendar` has already warmed the page by this point,
            which is what keeps the wait short. */}
        {showCalendar && (
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white p-2 sm:p-4 shadow-xl ring-1 ring-slate-200">
            {/* Sits behind the embed and is covered the moment it paints. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white"
            >
              <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand" />
              <p className="text-sm font-semibold text-slate-500">
                Pulling up available times…
              </p>
            </div>
            <Cal
              namespace={calNamespace}
              calLink={calLink}
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                overflow: "scroll",
                borderRadius: "10px",
              }}
              config={{
                layout: "month_view",
                theme: "light",
                name: qualification.contact.name,
                email: qualification.contact.email,
                attendeePhoneNumber: qualification.contact.phone,
              }}
            />
          </div>
        )}

        {qualification && !qualification.qualified && (
          <div className="mx-auto max-w-2xl rounded-2xl border-2 border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 mb-4">
              This isn't the right fit yet
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Thanks for being straight with us,{" "}
              {qualification.contact.name.split(" ")[0]}. Based on your answers,
              our guaranteed listing system wouldn't pay for itself at this
              stage of your business — and we'd rather tell you that now than
              take your money.
            </p>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              When your volume or timing changes, come back and run this again.
              We'll be here.
            </p>
          </div>
        )}
      </section>

      {/* 2. Proof — runs before the ask, so the gap is open when it lands */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 pb-6 md:pb-8 text-center">
        {/* Pill badge */}
        <div className="md:bg-slate-100 mx-auto w-fit px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm text-slate-900 mb-6 font-black tracking-wide flex items-center justify-center gap-2 flex-wrap max-w-full">
          <span className="text-amber-400 tracking-wider leading-none text-2xl">
            ★★★★★
          </span>
          <span className="uppercase text-lg">
            Loved by top-producing SA agents
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-black uppercase max-w-2xl mx-auto xl text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">
          What{" "}
          <span className="text-brand underline decoration-4 underline-offset-4">
            Agents
          </span>{" "}
          Say About This System
        </h2>

        {/* Subline */}
        <p className="text-slate-900 font-medium text-lg mt-4">
          Hear from them below
        </p>
      </section>

      {/* 6. Testimonial videos / audio */}
      <TestimonialsSection />

      {/* 7. Proof screenshots */}
      <TestimonialProof />

      {/* 8. Copy bridge — hands off into the ask */}
      <CopyBridge />

      {/* Faces behind the offer, just above the footer */}
      <TeamStrip />

      {/* 9. Custom Footer */}
      <footer className="bg-blue-950 text-white py-5 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <h2 className="text-2xl  font-black mb-5 tracking-wide">
            Book Your Free Discovery Call
          </h2>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-block w-11/12 mx-auto sm:w-auto bg-brand text-white font-bold px-3 sm:px-5 md:px-6 py-4 md:py-5 rounded uppercase tracking-wide hover:shadow-lg transition-shadow z-10"
          >
            <p className="leading-none font-black tracking-normal text-2xl">
              SEE HOW WE DID IT
            </p>
          </button>

          {/* Disclaimer Section */}
          <div className="pt-8 text-xs sm:text-sm leading-relaxed text-slate-300 space-y-4">
            <p>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Terms & Conditions
              </a>
            </p>
            <p className="text-slate-500">
              © 2026 EstateKit. All rights reserved.
            </p>
            <p>
              Facebook disclaimer: This site is not a part of the Facebook
              website or Facebook Inc. Additionally, this site is NOT endorsed
              by Facebook in any way. Facebook is a trademark of Facebook, Inc.
            </p>

            {/* Logo */}
            <div className="pt-4">
              <img
                src={logo}
                alt="EstateKit Logo"
                className="h-8 sm:h-10 mx-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PitchVSL;
