import { FiStar } from "react-icons/fi";

export default function Stars({ size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} size={size} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
      ))}
    </div>
  );
}
