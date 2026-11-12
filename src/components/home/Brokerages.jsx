import c21 from "../../../assets/partners/c21.webp";
import cb from "../../../assets/partners/cb.webp";
import exp from "../../../assets/partners/exp.webp";
import fit600Jfif1 from "../../../assets/partners/Fit600x300 (1)-jfif.webp";
import fit600_1 from "../../../assets/partners/Fit600x300 (1).webp";
import fit600_10 from "../../../assets/partners/Fit600x300 (10).webp";
import fit600_11 from "../../../assets/partners/Fit600x300 (11).webp";
import fit600_12 from "../../../assets/partners/Fit600x300 (12).webp";
import fit600_13 from "../../../assets/partners/Fit600x300 (13).webp";
import fit600_14 from "../../../assets/partners/Fit600x300 (14).webp";
import fit600_15 from "../../../assets/partners/Fit600x300 (15).webp";
import fit600_16 from "../../../assets/partners/Fit600x300 (16).webp";
import fit600_17 from "../../../assets/partners/Fit600x300 (17).webp";
import fit600Jfif2 from "../../../assets/partners/Fit600x300 (2)-jfif.webp";
import fit600_2 from "../../../assets/partners/Fit600x300 (2).webp";
import fit600_3 from "../../../assets/partners/Fit600x300 (3).webp";
import fit600_4 from "../../../assets/partners/Fit600x300 (4).webp";
import fit600_5 from "../../../assets/partners/Fit600x300 (5).webp";
import fit600_6 from "../../../assets/partners/Fit600x300 (6).webp";
import fit600_7 from "../../../assets/partners/Fit600x300 (7).webp";
import fit600_8 from "../../../assets/partners/Fit600x300 (8).webp";
import fit600_9 from "../../../assets/partners/Fit600x300 (9).webp";
import fit600Jfif from "../../../assets/partners/Fit600x300-jfif.webp";
import fit600 from "../../../assets/partners/Fit600x300.webp";
import kw from "../../../assets/partners/kw.webp";
import redfin from "../../../assets/partners/redfin.webp";
import remax from "../../../assets/partners/remax.webp";
import stb from "../../../assets/partners/stb.webp";


const BROKERAGES = [
  { src: c21, alt: "Partner Logo 1" },
  { src: cb, alt: "Partner Logo 2" },
  { src: exp, alt: "Partner Logo 3" },
  { src: fit600Jfif1, alt: "Partner Logo 4" },
  { src: fit600_1, alt: "Partner Logo 5" },
  { src: fit600_10, alt: "Partner Logo 6" },
  { src: fit600_11, alt: "Partner Logo 7" },
  { src: fit600_12, alt: "Partner Logo 8" },
  { src: fit600_13, alt: "Partner Logo 9" },
  { src: fit600_14, alt: "Partner Logo 10" },
  { src: fit600_15, alt: "Partner Logo 11" },
  { src: fit600_16, alt: "Partner Logo 12" },
  { src: fit600_17, alt: "Partner Logo 13" },
  { src: fit600Jfif2, alt: "Partner Logo 14" },
  { src: fit600_2, alt: "Partner Logo 15" },
  { src: fit600_3, alt: "Partner Logo 16" },
  { src: fit600_4, alt: "Partner Logo 17" },
  { src: fit600_5, alt: "Partner Logo 18" },
  { src: fit600_6, alt: "Partner Logo 19" },
  { src: fit600_7, alt: "Partner Logo 20" },
  { src: fit600_8, alt: "Partner Logo 21" },
  { src: fit600_9, alt: "Partner Logo 22" },
  { src: fit600Jfif, alt: "Partner Logo 23" },
  { src: fit600, alt: "Partner Logo 24" },
  { src: kw, alt: "Partner Logo 25" },
  { src: redfin, alt: "Partner Logo 26" },
  { src: remax, alt: "Partner Logo 27" },
  { src: stb, alt: "Partner Logo 28" },
];

export default function Brokerages() {
  return (
    <section className="bg-slate-950 py-8 sm:py-10">
      <div className="mx-auto max-w-full px-0">
        <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[.14em] text-white">
          Trusted by Agents from Leading Brokerages
        </p>

        <div className="relative overflow-hidden border-y">
          <style>{`
            @keyframes brokerages-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>

          <div className="flex w-max animate-[brokerages-marquee_38s_linear_infinite] items-center gap-4 px-2 sm:gap-6 sm:px-4">
            {[...BROKERAGES, ...BROKERAGES].map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex h-16 min-w-[170px] items-center justify-center rounded-lg bg-white/5 px-4 sm:h-20 sm:min-w-[220px]"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 w-auto max-w-[140px] drop-shadow sm:h-10"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
