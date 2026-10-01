import { FiUsers, FiPhone, FiZap } from "react-icons/fi";
import SectionTag from "./SectionTag";
import { TEAM } from "../../config/team";

const PILLARS = [
  {
    Icon: FiUsers,
    title: "Expert Account Managers",
    desc: "Your dedicated success partner for strategy and growth",
  },
  {
    Icon: FiPhone,
    title: "Full-Time ISA's",
    desc: "Professional lead follow-up that converts prospects to clients",
  },
  {
    Icon: FiZap,
    title: "Inhouse Editors",
    desc: "Creative team producing scroll-stopping content",
  },
];

export default function Team() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <SectionTag icon={FiUsers}>Our Team</SectionTag>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3">
            Meet Your <span className="text-brand">Success Partners</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            A dedicated team of marketing experts, ISAs, account managers, and
            creative professionals working together to fuel your success.
          </p>
        </div>

        {/* Avatar row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto gap-6 mb-12">
          {TEAM.map((m) => (
            <div key={m.name} className="text-center">
              <img
                src={m.photo}
                alt={`${m.name}, ${m.role} at EstateKit`}
                width="80"
                height="80"
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-full mx-auto mb-2.5 object-cover border-2 border-slate-200 bg-slate-50"
              />
              <p className="font-bold text-slate-800 leading-tight">{m.name}</p>
              <p className="text-slate-400 font-medium text-sm mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PILLARS.map((item) => (
            <div
              key={item.title}
              className="bg-brand/5 border-2 border-brand/20 rounded p-7 text-center"
            >
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-brand flex items-center justify-center text-white mx-auto mb-4">
                <item.Icon size={22} />
              </div>
              <p className="font-extrabold text-sm text-slate-900 mb-2">{item.title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
