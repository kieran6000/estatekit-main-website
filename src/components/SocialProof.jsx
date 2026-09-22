import nielen from "../../assets/nielen.jpeg";
import natie from "../../assets/natie.jpeg";
import teboho from "../../assets/teboho.jpeg";
import david from "../../assets/david.jpeg";
import mpho from "../../assets/mpho.png";
import fit600 from "../../assets/partners/Fit600x300.png";
import fit600_1 from "../../assets/partners/Fit600x300 (1).png";
import fit600_2 from "../../assets/partners/Fit600x300 (2).png";
import fit600_3 from "../../assets/partners/Fit600x300 (3).png";
import fit600_4 from "../../assets/partners/Fit600x300 (4).png";
import fit600_5 from "../../assets/partners/Fit600x300 (5).png";
import fit600_6 from "../../assets/partners/Fit600x300 (6).png";
import fit600_7 from "../../assets/partners/Fit600x300 (7).png";
import fit600_8 from "../../assets/partners/Fit600x300 (8).png";
import fit600_9 from "../../assets/partners/Fit600x300 (9).png";
import fit600_10 from "../../assets/partners/Fit600x300 (10).png";
import fit600_11 from "../../assets/partners/Fit600x300 (11).png";
import fit600_12 from "../../assets/partners/Fit600x300 (12).png";
import fit600_13 from "../../assets/partners/Fit600x300 (13).png";
import fit600_14 from "../../assets/partners/Fit600x300 (14).png";
import fit600_15 from "../../assets/partners/Fit600x300 (15).png";
import fit600_16 from "../../assets/partners/Fit600x300 (16).png";
import fit600_17 from "../../assets/partners/Fit600x300 (17).png";

const avatars = [
  { src: nielen, alt: "Nielen" },
  { src: natie, alt: "Natie" },
  { src: teboho, alt: "Teboho" },
  { src: david, alt: "David" },
  { src: mpho, alt: "Mpho" },
];

const companyLogos = [
  { src: fit600, alt: "Partner Logo 1" },
  { src: fit600_1, alt: "Partner Logo 2" },
  { src: fit600_2, alt: "Partner Logo 3" },
  { src: fit600_3, alt: "Partner Logo 4" },
  { src: fit600_4, alt: "Partner Logo 5" },
  { src: fit600_5, alt: "Partner Logo 6" },
  { src: fit600_6, alt: "Partner Logo 7" },
  { src: fit600_7, alt: "Partner Logo 8" },
  { src: fit600_8, alt: "Partner Logo 9" },
  { src: fit600_9, alt: "Partner Logo 10" },
  { src: fit600_10, alt: "Partner Logo 11" },
  { src: fit600_11, alt: "Partner Logo 12" },
  { src: fit600_12, alt: "Partner Logo 13" },
  { src: fit600_13, alt: "Partner Logo 14" },
  { src: fit600_14, alt: "Partner Logo 15" },
  { src: fit600_15, alt: "Partner Logo 16" },
  { src: fit600_16, alt: "Partner Logo 17" },
  { src: fit600_17, alt: "Partner Logo 18" },
  { src: fit600, alt: "Partner Logo 1" },
  { src: fit600_1, alt: "Partner Logo 2" },
  { src: fit600_2, alt: "Partner Logo 3" },
  { src: fit600_3, alt: "Partner Logo 4" },
  { src: fit600_4, alt: "Partner Logo 5" },
  { src: fit600_5, alt: "Partner Logo 6" },
  { src: fit600_6, alt: "Partner Logo 7" },
  { src: fit600_7, alt: "Partner Logo 8" },
  { src: fit600_8, alt: "Partner Logo 9" },
  { src: fit600_9, alt: "Partner Logo 10" },
  { src: fit600_10, alt: "Partner Logo 11" },
  { src: fit600_11, alt: "Partner Logo 12" },
  { src: fit600_12, alt: "Partner Logo 13" },
  { src: fit600_13, alt: "Partner Logo 14" },
  { src: fit600_14, alt: "Partner Logo 15" },
  { src: fit600_15, alt: "Partner Logo 16" },
  { src: fit600_16, alt: "Partner Logo 17" },
  { src: fit600_17, alt: "Partner Logo 18" },
];

export default function SocialProof() {
  return (
    <section className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-8 md:pb-10 text-center">
     
      {/* Avatar stack */}
     
      <div className="flex justify-center -space-x-2 mb-3 hidden">
        {avatars.map((avatar) => (
          <img
            key={avatar.alt}
            src={avatar.src}
            alt={avatar.alt}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white object-cover"
          />
        ))}
        {/* +25 bubble */}
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white bg-brand flex items-center justify-center text-white text-base md:text-lg font-bold">
          +25
        </div>
      </div>
      <div className="relative bg-gray-50 mt-4 overflow-hidden border-x-2 py-1.5 border-gray-300">
        <style>{`
          @keyframes logo-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <div className="flex w-max animate-[logo-marquee_100s_linear_infinite] items-center gap-10">
          {[...companyLogos, ...companyLogos].map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className="flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 md:h-12 w-auto max-w-[140px]"
              />
            </div>
          ))}
        </div>
      </div>      
    </section>
  );
}
