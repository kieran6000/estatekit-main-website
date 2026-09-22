import { FiPlay } from "react-icons/fi";
import YouTubePlayer from "../components/YouTubePlayer";
import SocialProof from "../components/SocialProof";
import Footer from "../components/Footer";
import heroBg from "../../assets/training-hero-bg.webp";
import { TRAINING_BOOKING_EMBED_URL } from "../config/trainingConfig";

/**
 * TestimonialResultsPage
 *
 * Shared template for the per-agent results landing pages
 * (/juani-results, /sakhile-results). Leads with that agent's video
 * testimonial, then funnels into the same free-training registration
 * as /training.
 *
 * Props:
 *  - agentName, location: e.g. "Juani", "Boksburg"
 *  - stat: short result headline, e.g. "11 Listings in 6 Weeks"
 *  - detail: longer proof paragraph
 *  - youtubeId: YouTube video ID for the testimonial (may be empty — shows a placeholder)
 *  - headline: JSX for the hero headline
 */
const TestimonialResultsPage = ({
  agentName,
  location,
  stat,
  detail,
  youtubeId,
  headline,
}) => {
  return (
    <div className="bg-white text-slate-900 antialiased">
      {/* Announcement bar */}
      <div className="bg-brand text-white text-center text-lg md:text-xl font-black py-2 px-4 tracking-wide leading-tight">
        FREE TRAINING — For Agents Already Doing 9+ Deals a Year
      </div>

      {/* Hero — headline + video testimonial */}
      <section
        className="relative mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-4 md:pb-6 text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-white/85 pointer-events-none" />
        <div className="relative">
          <p className="text-slate-600 text-base md:text-lg font-medium mb-3 tracking-wide">
            Real Agent. Real Results.
          </p>

          <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 max-w-5xl mx-auto">
            {headline}
          </h1>

          <div className="my-4 md:my-5 max-w-2xl lg:max-w-3xl mx-auto">
            {youtubeId ? (
              <YouTubePlayer
                videoId={youtubeId}
                title={`${agentName}${location ? " · " + location : ""} — ${stat}`}
              />
            ) : (
              <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm text-center px-6">
                <span className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <FiPlay size={22} />
                </span>
                {agentName}'s testimonial video loads here
              </div>
            )}
          </div>

          <div className="max-w-2xl lg:max-w-3xl mx-auto text-center mb-4">
            <p className="font-extrabold text-slate-900">
              {agentName}
              {location ? <span className="text-slate-400 font-medium"> · {location}</span> : null}
            </p>
            <p className="text-brand font-black text-base md:text-lg mb-2">{stat}</p>
            <p className="text-slate-500 text-sm leading-relaxed">{detail}</p>
          </div>

          <a
            href="#register"
            className="btn-pulse inline-block w-full sm:w-auto bg-brand text-white font-bold text-base md:text-lg px-8 md:px-12 py-3 md:py-4 rounded mb-2 uppercase tracking-wide"
          >
            Register For The Free Training
          </a>
        </div>
      </section>

      {/* Copy bridge */}
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-2 text-center">
        <p className="text-slate-900 text-base md:text-lg italic mb-1">
          "No cold calls, no chasing leads, no wasted budget — just the
          system other agents in your market are already using..."
        </p>
        <p className="text-brand text-base md:text-lg font-bold my-6" id="register">
          100% Free — Reserve Your Seat Below
        </p>
        <p className="text-slate-900 text-base md:text-lg">
          Register below and I'll expose the entire system — start to
          finish, no value held back 👇
        </p>
      </div>

      {/* EstateKit registration/calendar embed */}
      <div>
        <iframe
          src={TRAINING_BOOKING_EMBED_URL}
          title="EstateKit Free Training — Register"
          style={{ width: "100%", minHeight: "820px", border: 0, borderRadius: "16px" }}
          loading="lazy"
        />
      </div>

      {/* Social proof */}
      <SocialProof />

      {/* Final CTA */}
      <section className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14 text-center">
        <a
          href="#register"
          className="btn-pulse inline-block w-full sm:w-auto bg-brand text-white font-bold text-base md:text-lg px-10 md:px-14 py-3 md:py-4 rounded uppercase tracking-wide mb-2"
        >
          Reserve Your Seat Now
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialResultsPage;
