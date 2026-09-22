import TestimonialImage from "./TestimonialImage";

import angie from "../../assets/angie.png";
import lebo from "../../assets/lebo.webp";
import mpho from "../../assets/mpho.jpg";
import thabo from "../../assets/thabo.webp";

import test1 from "../../assets/Layer 1.png";
import test3 from "../../assets/Layer 3.png";
import test4 from "../../assets/Layer 4.png";
import test6 from "../../assets/Layer 6.png";
import test7 from "../../assets/Layer 7.png";
import test8 from "../../assets/Layer 8.png";
import test9 from "../../assets/Layer 9.png";
import test11 from "../../assets/layer 11.png";
import test12 from "../../assets/layer 12.png";
import test13 from "../../assets/layer 13.png";
import test14 from "../../assets/layer 14.png";
import test15 from "../../assets/layer 15.png";
import test16 from "../../assets/layer 16.png";
import test17 from "../../assets/layer 17.png";
import test18 from "../../assets/layer 18.png";
import test19 from "../../assets/layer 19.png";
import test20 from "../../assets/Layer 20.png";

const TESTIMONIAL_IMAGES = [
  {
    src: test6,
    credit: { img: angie, name: "Angie", caption: "20 leads so far at R10 each" },
  },
  {
    src: test9,
    credit: {
      img: lebo,
      name: "Lebo",
      caption: "So far collected 65+ leads at R9 each",
    },
  },
  { src: test20 },
  { src: test19 },
  { src: test18 },
  { src: test17 },
  { src: test16 },
  { src: test15 },
  { src: test14 },
  { src: test13 },
  { src: test12 },
  { src: test11 },
  { src: test1 },
  { src: test3 },
  {
    src: test8,
    credit: { img: thabo, name: "Thabo", caption: "30+ leads at R10 each" },
  },
  {
    src: test7,
    credit: { img: mpho, name: "Mpho", caption: "48 leads at R9 each" },
  },
  { src: test4 },
];

export default function TestimonialProof({
  heading = "Agents in your area using this system are getting results like these RIGHT NOW...",
}) {
  return (
    <section className="max-w-4xl px-4 sm:px-6 mx-auto mb-12 mt-12">
      <p className="font-bold text-lg sm:text-xl md:text-2xl text-center mb-8">
        {heading}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {TESTIMONIAL_IMAGES.map((t, i) => (
          <TestimonialImage key={i} {...t} />
        ))}
      </div>
    </section>
  );
}
