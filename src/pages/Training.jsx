import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import SocialProof from "../components/SocialProof";
import TestimonialsSection from "../components/TestimonialsSection";
import ProofScreenshots from "../components/ProofScreenshots";
import FaqVideos from "../components/FaqVideos";
import Footer from "../components/Footer";
import WistiaPlayer from "../components/WistiaPlayer";
import { FiPlay } from "react-icons/fi";
import {
  TRAINING_CAL_LINK,
  TRAINING_CAL_NAMESPACE,
  TRAINING_VSL_MEDIA_ID,
  CASE_STUDIES,
} from "../config/trainingConfig";

const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1403151508287127582/ReH3dRhqmN2pGoslGMFgIE30aj4xQymtHCMmn3Di4XmdjNpxPL5SlmROkWpM9nwAch64";

const logToDiscord = async (event, data) => {
  try {
    const fields = Object.entries(data).map(([name, value]) => ({
      name,
      value: String(value ?? "—"),
      inline: true,
    }));
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "training funnel",
        embeds: [{ title: event, color: 0x0086ff, fields, timestamp: new Date().toISOString() }],
      }),
    });
  } catch (_) {}
};

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
            {location ? <span className="text-slate-400 font-medium"> · {location}</span> : null}
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

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: TRAINING_CAL_NAMESPACE });

      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#0086ff" },
          dark: { "cal-brand": "#0086ff" },
        },
        hideEventTypeDetails: true,
        layout: "month_view",
      });

      cal("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          const { name, email, startTime } = e.detail.data;
          logToDiscord("🎓 New Training Registration", {
            name: name?.substring(0, 20),
            email: email ? email.substring(0, 3) + "...@" + email.split("@")[1] : "—",
            time: startTime,
          });
        },
      });

      cal("on", {
        action: "bookingFailed",
        callback: (e) => {
          logToDiscord("❌ Training Registration Failed", {
            error: e.detail.data.message?.substring(0, 30) + "...",
          });
        },
      });
    })();
  }, []);

  return (
    <div className="bg-white text-slate-900 antialiased">
      {/* 1. Announcement bar */}
      <div className="bg-brand text-white text-center text-lg md:text-xl font-black py-2 px-4 tracking-wide leading-tight">
        FREE TRAINING — For Agents Already Doing 9+ Deals a Year
      </div>

      {/* 2. Hero — headline + VSL + primary CTA */}
      <section className="hero-section mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-4 md:pb-6 text-center">
        {/* Pre-head */}
        <p className="text-slate-600 text-base md:text-lg font-medium mb-3 tracking-wide">
          Stop Cold Calling, Canvassing & Waiting On Referrals...
        </p>

        {/* Headline */}
        <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 max-w-5xl mx-auto">
          The Exact System That Got Juani{" "}
          <span className="text-brand font-black">11 Listings</span> &{" "}
          <span className="text-brand font-black">1 Closed Deal</span> in Just
          6 Weeks —{" "}
          <span className="text-brand underline decoration-brand font-black underline-offset-2">
            Without a Single Cold Call
          </span>
        </h1>

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

        {/* Primary CTA */}
        <a
          href="#register"
          className="btn-pulse inline-block w-full sm:w-auto bg-brand text-white font-bold text-base md:text-lg px-8 md:px-12 py-3 md:py-4 rounded mb-2 uppercase tracking-wide"
        >
          Register For The Free Training
        </a>
      </section>

      {/* 3. Copy bridge — leads into the calendar */}
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

      {/* 4. Cal.com registration embed */}
      <div>
        <Cal
          namespace={TRAINING_CAL_NAMESPACE}
          calLink={TRAINING_CAL_LINK}
          style={{
            width: "100%",
            overflow: "scroll",
            borderRadius: "10px",
          }}
          config={{
            layout: "month_view",
            theme: "light",
          }}
        />
      </div>

      {/* 5. Social proof — agent avatars + count */}
      <SocialProof />

      {/* 6. Case studies from the ad */}
      <section className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-10 md:pb-14">
        <p className="text-center text-slate-900 font-bold text-xl md:text-3xl mb-2">
          Real Agents. <span className="text-brand">Real Results.</span>
        </p>
        <p className="text-center text-slate-500 text-sm md:text-base mb-8 max-w-lg mx-auto">
          Different cities. Different suburbs. Different price ranges. Same
          system.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CASE_STUDIES.map((c) => (
            <CaseStudyCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      {/* 7. Testimonial videos / audio */}
      <TestimonialsSection />

      {/* 8. Proof screenshots */}
      <ProofScreenshots />

      {/* 9. FAQ breakout videos */}
      <FaqVideos />

      {/* 10. Final CTA */}
      <section className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14 text-center">
        <a
          href="#register"
          className="btn-pulse inline-block w-full sm:w-auto bg-brand text-white font-bold text-base md:text-lg px-10 md:px-14 py-3 md:py-4 rounded uppercase tracking-wide mb-2"
        >
          Reserve Your Seat Now
        </a>
      </section>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
};

export default Training;
