export default function StepHeader({ children }) {
  return (
    <p className="mt-5 font-extrabold font-sans text-2xl md:text-3xl bg-brand w-full text-white text-center py-1 rounded">
      {children}
    </p>
  );
}
