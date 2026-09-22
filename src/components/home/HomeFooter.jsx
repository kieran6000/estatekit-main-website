import { FiYoutube, FiInstagram, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";
import logo2 from "../../../assets/primary.svg";
import { NAV_LINKS } from "./navLinks";

export default function HomeFooter() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 hidden">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logo2} width={120} className="mb-5" alt="" />
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Real Estate Specialised Marketing for South African agents. All
              services done in-house.
            </p>
            <div className="flex gap-3">
              {[FiYoutube, FiInstagram, FiLinkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:border-brand hover:text-brand cursor-pointer transition-colors"
                >
                  <Icon size={15} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-extrabold text-[11px] uppercase tracking-[.1em] text-slate-500 mb-5">
              Quick Links
            </p>
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="block text-slate-300 text-sm font-medium mb-3 hover:text-brand transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <div>
            <p className="font-extrabold text-[11px] uppercase tracking-[.1em] text-slate-500 mb-5">
              Contact
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
              <FiMail size={13} className="text-slate-500" /> hello@estatekit.com
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <FiMapPin size={13} className="text-slate-500" /> South Africa
            </div>
          </div>
        </div>

        <hr className="border-slate-800 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-slate-600 text-xs">© 2026 EstateKit — All rights reserved.</p>
          <div className="flex flex-wrap gap-2">
            {["Google Ads Certified", "Meta Business Partner"].map((b) => (
              <span
                key={b}
                className="bg-slate-800 text-slate-500 border border-slate-700 rounded-md px-3 py-1 text-xs"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
