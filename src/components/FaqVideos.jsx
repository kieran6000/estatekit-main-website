import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiPlay } from "react-icons/fi";
import WistiaPlayer from "./WistiaPlayer";
import { FAQ_VIDEOS } from "../config/trainingConfig";

function VideoSlot({ mediaId }) {
  if (mediaId) {
    return (
      <div className="mt-4 rounded-xl overflow-hidden border-2 border-brand">
        <WistiaPlayer mediaId={mediaId} />
      </div>
    );
  }
  return (
    <div className="mt-4 aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs md:text-sm text-center px-4">
      <span className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
        <FiPlay size={16} />
      </span>
      Video answer coming soon
    </div>
  );
}

function FaqVideoItem({ q, a, mediaId }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`border rounded px-5 md:px-6 py-4 md:py-5 cursor-pointer mb-3 transition-all duration-200 ${
        open ? "border-brand bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <span className="font-bold text-sm md:text-base text-slate-900 flex-1">
          {q}
        </span>
        {open ? (
          <FiChevronUp size={18} className="text-brand flex-shrink-0" />
        ) : (
          <FiChevronDown size={18} className="text-slate-400 flex-shrink-0" />
        )}
      </div>
      {open && (
        <>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-3">
            {a}
          </p>
          <VideoSlot mediaId={mediaId} />
        </>
      )}
    </div>
  );
}

export default function FaqVideos() {
  return (
    <section className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <p className="text-center text-slate-900 font-bold text-xl md:text-3xl mb-2">
        Got Questions? <span className="text-brand">Watch The Answers</span>
      </p>
      <p className="text-center text-slate-500 text-sm md:text-base mb-8 max-w-lg mx-auto">
        Quick video answers to what every agent asks before registering.
      </p>

      {FAQ_VIDEOS.map((f, i) => (
        <FaqVideoItem key={i} {...f} />
      ))}
    </section>
  );
}
