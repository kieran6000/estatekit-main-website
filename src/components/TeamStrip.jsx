import { TEAM } from "../config/team";

/**
 * Compact version of the home page's team section, for the foot of a funnel
 * page — puts faces to the promise without pulling focus from the CTA above.
 */
export default function TeamStrip() {
  return (
    <section className="border-t border-slate-100 px-4 py-12 sm:px-6">
      <p className="text-center text-sm font-black uppercase tracking-widest text-slate-400">
        The team behind your campaigns
      </p>

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
        {TEAM.map((m) => (
          <div key={m.name} className="text-center">
            <img
              src={m.photo}
              alt={`${m.name}, ${m.role} at EstateKit`}
              width="72"
              height="72"
              loading="lazy"
              decoding="async"
              className="mx-auto mb-2.5 h-18 w-18 rounded-full border-2 border-slate-200 bg-slate-50 object-cover"
              style={{ width: 72, height: 72 }}
            />
            <p className="text-sm font-bold leading-tight text-slate-800">
              {m.name}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-400">
              {m.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
