import Stars from "./Stars";

export default function FeaturedTestimonial() {
  return (
    <section className="bg-blue-50 hidden border-t border-b border-slate-200 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <Stars size={18} />
        </div>
        <blockquote className="italic text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed mb-10">
          "Within just six months of partnering with EstateKit, I generated
          over $5 million in new listing volume. The quality of leads and the
          consistency of appointments exceeded my expectations. It completely
          transformed my pipeline."
        </blockquote>
        <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-white font-black text-lg mx-auto mb-3">
          DC
        </div>
        <p className="font-extrabold text-slate-900">Daniel Cheatley</p>
        <p className="text-slate-400 text-sm mt-1">Tyler Mclay Realty Brokerage</p>
      </div>
    </section>
  );
}
