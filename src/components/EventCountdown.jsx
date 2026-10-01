import { useEffect, useState } from "react";
import { AiFillWarning } from "react-icons/ai";

const EventCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // September 10th, 2026 at 7PM SAST (UTC+2)
      const eventDate = new Date("2026-09-10T19:00:00+02:00").getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto px-4 pb-2 text-center">
      {/* Countdown Container */}
      <div className="rounded-lg overflow-hidden mb-4 max-w-sm mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <AiFillWarning className="text-red-500" size={18} />
          <p className="text-lg font-black uppercase tracking-widest text-red-500">
            TRAINING STARTS IN:
          </p>
        </div>

        {/* Countdown grid */}
        <div className="">
          <div className="grid grid-cols-4 max-w-[200px] mx-auto">
            {/* Days */}
            <div className="">
              <span className="text-base font-black text-slate-900 leading-none">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <p className="text-xs font-medium text-slate-600 uppercase">
                Days
              </p>
            </div>

            {/* Hours */}
            <div className="">
              <span className="text-base font-black text-slate-900 leading-none">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <p className="text-xs font-medium text-slate-600 uppercase">
                Hrs
              </p>
            </div>

            {/* Minutes */}
            <div className="">
              <span className="text-base font-black text-slate-900 leading-none">
                {String(timeLeft.minutes).padStart(2, "0")}
                
              </span>
              <p className="text-xs font-medium text-slate-600 uppercase">
                Mins
              </p>
            </div>
            {/* Seconds */}
            <div className="">
              <span className="text-base font-black text-slate-900 leading-none">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <p className="text-xs font-medium text-slate-600 uppercase">
                Secs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCountdown;
