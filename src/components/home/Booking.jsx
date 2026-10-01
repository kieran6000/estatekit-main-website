import { FiPhone } from "react-icons/fi";
import Cal from "@calcom/embed-react";
import SectionTag from "./SectionTag";

export default function Booking() {
  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center">
          <SectionTag icon={FiPhone}>Book a Call</SectionTag>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
          Discover how we{" "}
          <span className="text-brand">GUARANTEE CLOSED DEALS</span> or you{" "}
          <span className="text-brand">DON'T PAY!</span>
        </h2>
        <p className="text-slate-500 text-base max-w-md mx-auto mb-12">
          Book a 45-minute discovery call with our team and start transforming
          your real estate business today.
        </p>

        <div className="">
          <Cal
            namespace="10listingappts"
            calLink="estatekit/10listingappts"
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
      </div>
    </section>
  );
}
