import { useEffect, useState } from "react";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import logo from "../../../assets/secondary.svg";
import { NAV_LINKS } from "./navLinks";

function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      <div className="flex justify-between items-center h-16 px-6 border-b border-slate-200">
        <img src={logo} className="w-32" alt="" />
        <button onClick={onClose} className="text-slate-800">
          <FiX size={24} />
        </button>
      </div>
      <div className="flex-1 px-6 pt-2">
        {NAV_LINKS.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            onClick={onClose}
            className="block py-5 border-b border-slate-100 font-bold text-base text-slate-800"
          >
            {l}
          </a>
        ))}
        <div className="mt-7">
          <button className="w-full bg-brand text-white font-bold text-sm rounded-lg py-4 flex items-center justify-center gap-2">
            Book Discovery Call <FiArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <nav
        className={`sticky top-0 z-[100] bg-white/95 backdrop-blur-md transition-all duration-300 ${scrolled ? "border-b border-slate-200" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <img src={logo} className="w-32" alt="" />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-black hover:text-brand text-sm font-semibold transition-colors"
              >
                {l}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-brand hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded transition-colors"
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-slate-800" onClick={() => setMobileOpen(true)}>
            <FiMenu size={24} />
          </button>
        </div>
      </nav>
    </>
  );
}
