import SocialProof from "../components/SocialProof";
import TestimonialsSection from "../components/TestimonialsSection";
import ProofScreenshots from "../components/ProofScreenshots";
import FaqVideos from "../components/FaqVideos";
import Footer from "../components/Footer";
import WistiaPlayer from "../components/WistiaPlayer";
import EventCountdown from "../components/EventCountdown";
import { FiPlay } from "react-icons/fi";
import { usePageMeta } from "../hooks/usePageMeta";
import heroBg from "../../assets/training-hero-bg.webp";
import logo from "../../assets/primary.svg";
import {
  TRAINING_BOOKING_EMBED_URL,
  TRAINING_VSL_MEDIA_ID,
  CASE_STUDIES,
} from "../config/trainingConfig";

function CaseStudyCard({ initials, name, location, stat, detail }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded p-6 text-left hover:border-brand hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white font-black text-base flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-extrabold text-slate-900 leading-tight">
            {name}
            {location ? (
              <span className="text-slate-400 font-medium"> · {location}</span>
            ) : null}
          </p>
        </div>
      </div>
      <p className="text-brand font-black text-base md:text-lg mb-2">{stat}</p>
      <p className="text-slate-500 text-sm leading-relaxed">{detail}</p>
    </div>
  );
}

const Training = () => {
  const isVSLPage = location.pathname.includes("training-vsl");

  usePageMeta({
    title:
      "Free Training: The System That Got Juani 11 Listings in 6 Weeks | EstateKit",
    description:
      "Free training for agents already doing 9+ deals a year — the exact seller-attraction system real South African agents are using to book listing appointments without cold calling.",
    path: isVSLPage ? "/training-vsl" : "/training",
  });

  return (
    <div className="bg-white text-slate-900 antialiased">
      {/* 2. Hero — headline + VSL + primary CTA */}
      <section
        className="relative mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-22 text-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 to-slate-950 backdrop-blur-[3px] pointer-events-none" />
        <div className="relative">
          {/* Logo */}
          <div className="mb-5">
            <img src={logo} alt="EstateKit Logo" className="h-8 mx-auto" />
          </div>

          {/* Pre-head */}
          <div className="bg-white transform scale-110 mx-auto w-fit px-3 sm:px-4 py-2 drop-shadow rounded-full text-xs sm:text-sm md:text-base text-slate-900 my-5 font-black tracking-wide flex items-center justify-center gap-1 flex-wrap max-w-full sm:w-fit">
            <span className="text-red-500 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <div className="bg-red-500 rounded-full min-w-2 min-h-2 sm:min-w-3 sm:min-h-3"></div>
              <span>LIVE TRAINING</span>
            </span>
            <span className="hidden sm:inline text-slate-400"> </span>
            <span className="hidden sm:inline text-slate-900">FREE EVENT</span>
            <span className="inline text-slate-900"> | </span>
            <span className="whitespace-nowrap text-slate-900">
              SEP. 10TH, 2026
            </span>
          </div>

          <div>
            {/* Headline */}
            <h1 className="font-black mb-5 mt-7 md:mt-14 uppercase text-4xl text-white drop-shadow sm:text-5xl md:text-6xl leading-tighter max-w-5xl mx-auto">
              11 Mandates In 6 Weeks From One Boksburg Agent
            </h1>
            <p className="text-white/80 text-lg sm:text-xl md:text-2xl font-normal max-w-3xl mx-auto drop-shadow mt-5">
              No cold calling. No canvassing. No referrals. Just a seller attraction system
              running in the background.
            </p>
          </div>

          {/* VSL */}
          {isVSLPage && (
            <div className="my-4 md:my-5 max-w-2xl lg:max-w-3xl mx-auto">
              {TRAINING_VSL_MEDIA_ID ? (
                <WistiaPlayer mediaId={TRAINING_VSL_MEDIA_ID} />
              ) : (
                <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm text-center px-6">
                  <span className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <FiPlay size={22} />
                  </span>
                  Training preview video loads here
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA — positioned at bottom edge */}
        <a
          href="#register"
          className="absolute left-1/2 -translate-x-1/2 -bottom-10 sm:-bottom-12 md:-bottom-16 inline-block w-11/12 sm:w-auto bg-brand text-white font-bold px-3 sm:px-5 md:px-6 py-4 md:py-5 rounded uppercase tracking-wide hover:shadow-lg transition-shadow z-10"
        >
          <p className="leading-none font-black tracking-normal mb-1.5 text-2xl">
            CLAIM YOUR FREE PASS TO THE TRAINING
          </p>
          <p className="text-xs sm:text-sm md:text-base font-medium leading-none">
            SEPTEMBER 10TH, 2026 AT 7PM SAST
          </p>
        </a>
      </section>

      {/* 3. Countdown timer — leads into the calendar */}
      <div className="pt-14 sm:pt-16 md:pt-20">
        <EventCountdown />
      </div>

      {/* 4. EstateKit registration/calendar embed */}
      <div className="hidden">
        <iframe
          src={TRAINING_BOOKING_EMBED_URL}
          title="EstateKit Free Training — Register"
          style={{
            width: "100%",
            minHeight: "820px",
            border: 0,
            borderRadius: "16px",
          }}
          loading="lazy"
        />
      </div>

      {/* 5. Social proof — agent avatars + count */}
      <SocialProof />

      {/* 6. Testimonials section header */}
<section className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 pb-6 md:pb-8 text-center">
  {/* Pill badge */}
  <div className="md:bg-slate-100 mx-auto w-fit px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm text-slate-900 mb-6 font-black tracking-wide flex items-center justify-center gap-2 flex-wrap max-w-full">
    <span className="text-amber-400 tracking-wider leading-none text-2xl">
      ★★★★★
    </span>
    <span className="uppercase text-lg">Loved by top-producing SA agents</span>
  </div>

  {/* Headline */}
  <h2 className="font-black uppercase max-w-2xl mx-auto xl text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">
    What <span className="text-brand underline decoration-4 underline-offset-4">Agents</span> Say About This System
  </h2>

  {/* Subline */}
  <p className="text-slate-900 font-medium text-lg mt-4">
    Hear from them below
  </p>
</section>

      {/* 7. Testimonial videos / audio */}
      <TestimonialsSection />

      {/* 11. Custom Footer */}
      <footer className="bg-blue-950 text-white py-5 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <h2 className="text-2xl  font-black mb-5 tracking-wide">
            Attend Free Seller-Attraction Training
          </h2>

          {/* CTA Button */}
          <a
            href="#register"
            className="inline-block w-11/12 mx-auto sm:w-auto bg-brand text-white font-bold px-3 sm:px-5 md:px-6 py-4 md:py-5 rounded uppercase tracking-wide hover:shadow-lg transition-shadow z-10"
          >
            <p className="leading-none font-black tracking-normal mb-1.5 text-2xl">
              CLAIM YOUR FREE PASS TO THE TRAINING
            </p>
            <p className="text-xs sm:text-sm md:text-base font-medium leading-none">
              SEPTEMBER 10TH, 2026 AT 7PM SAST
            </p>
          </a>

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
              Juani's results are not typical and are not a guarantee of your
              success. We cannot guarantee that you will make money or that you
              will be successful if you employ their business strategies
              specifically or generally. Consequently, your results may
              significantly vary from theirs. The information contained within
              this website is the property of EstateKit. Any use of the
              information, content, or ideas expressed herein without the
              express written consent of EstateKit is prohibited.
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

export default Training;
