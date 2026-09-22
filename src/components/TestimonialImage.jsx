export default function TestimonialImage({ src, credit }) {
  return (
    <div className="mx-auto">
      <img
        src={src}
        className="max-w-sm w-full mx-auto h-fit drop-shadow"
        alt={credit ? `${credit.name} — ${credit.caption}` : "Client results screenshot"}
      />
      {credit && (
        <div className="flex mx-auto w-fit items-center gap-2 mt-2">
          <img
            src={credit.img}
            alt={credit.name}
            className="h-10 w-10 object-cover rounded-full"
          />
          <p className="font-semibold text-gray-700">
            {credit.name} — {credit.caption}
          </p>
        </div>
      )}
    </div>
  );
}
