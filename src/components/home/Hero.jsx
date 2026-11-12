import { FiArrowRight } from "react-icons/fi";
import badge from "../../../assets/badge2.webp";
// Was hot-linked from Unsplash at full size; this is the same photo, compressed and served from our own domain.
import heroBg from "../../../assets/hero-bg.webp";
import Stars from "./Stars";

export default function Hero() {
  return (
    <section
      className="relative pt-10 pb-10"
      style={{
        backgroundImage: `url('${heroBg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* A background image is only found once the CSS has loaded. This
          lets the browser start on it straight away; it's the largest thing
          on screen when the page opens. */}
      <link rel="preload" as="image" href={heroBg} fetchpriority="high" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-16">
            <div className="w-full flex items-center justify-center flex-col text-center drop-shadow-md">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-5 text-white">
                Real Estate
                <br />
                <span className="text-brand">Specialised</span>
                <br />
                Marketing
              </h1>

              <p className="text-white text-base font-normal sm:text-lg leading-relaxed max-w-2xl">
                South African based agency, working with agents across the
                nation. All services done in house. We get you deals. It's
                that simple!
              </p>
              <img src={badge} className="h-20 my-5" alt="" />
              <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto items-center justify-center">
                <a
                  href="#contact"
                  className="hero-cta bg-brand hover:bg-blue-700 text-white font-bold text-sm w-full md:w-fit px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Book Discovery Call <FiArrowRight size={20} />
                </a>
                <a
                  href="#services"
                  className="hero-cta-secondary border-2 border-slate-200 hover:border-brand hover:text-white text-white hover:bg-brand/50 font-semibold text-sm w-full md:w-fit px-6 py-3 rounded-lg transition-colors"
                >
                  Learn More
                </a>
              </div>

              <div className="flex items-center mx-auto text-center gap-3 flex-wrap justify-center">
                <Stars size={15} />
                <span className="font-bold text-sm text-white">4.7 Rating</span>
                <span className="text-slate-300 text-sm">
                  · Trusted by <strong className="text-white">30+</strong> Real
                  Estate Agents
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
