export default function SectionTag({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-brand text-xs font-bold uppercase tracking-widest rounded-full px-3.5 py-1.5 mb-5">
      {Icon && <Icon size={15} />}
      {children}
    </div>
  );
}
