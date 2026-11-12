import { FiMapPin } from "react-icons/fi";
import SectionTag from "./SectionTag";
import areasMap from "../../../assets/areas-map.webp";

const AREAS =
  "Polokwane, Mahikeng, Rustenburg, Mbombela, Pretoria, Johannesburg, the West Rand, the East Rand, Kimberley, Bloemfontein, Pietermaritzburg, Durban, Ballito and the North Coast, East London, Gqeberha, the Garden Route, Stellenbosch and the Winelands, and Cape Town";

/** "Have you worked in my area?" answered before anyone has to ask it on a call. */
export default function Areas() {
  return (
    <section id="areas" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center">
          <SectionTag icon={FiMapPin}>Where We Work</SectionTag>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
          Seller Campaigns <span className="text-brand">Across SA</span>
        </h2>
        <p className="text-slate-500 text-base max-w-lg mx-auto mb-10">
          From Polokwane to the Garden Route, these are the areas where we&apos;ve
          run seller campaigns for agents.
        </p>

        <img
          src={areasMap}
          alt={`Map of South Africa marking the areas where EstateKit has run seller campaigns: ${AREAS}.`}
          width="1400"
          height="788"
          loading="lazy"
          decoding="async"
          className="mx-auto h-auto w-full max-w-5xl"
        />

        <p className="mt-8 text-sm text-slate-500">
          Not on the map?{" "}
          <a href="#contact" className="font-bold text-brand hover:underline">
            Ask us about your area
          </a>
        </p>
      </div>
    </section>
  );
}
