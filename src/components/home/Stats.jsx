const STATS = [
  { value: "300+", label: "Agents Served" },
  { value: "1,200+", label: "Deals Closed" },
  { value: "$50M+", label: "Sales Generated" },
  { value: "5,000+", label: "Appointments Booked" },
];

export default function Stats() {
  return (
    <section className="bg-brand py-16 hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-white font-black text-5xl sm:text-6xl leading-none">
                {s.value}
              </p>
              <p className="text-blue-100 font-semibold text-sm mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
