import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function RideRequestPopup({ ride, onAccept, onReject }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const onRejectRef = useRef(onReject);

  useEffect(() => {
    onRejectRef.current = onReject;
  }, [onReject]);

  useEffect(() => {
    setTimeLeft(10);

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onRejectRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ride?.rideId]); 

  return (
    <div className="flex flex-col items-center justify-center md:px-4 md:py-8 px-2 py-2 text-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-[360px] px-4 py-3 flex flex-col gap-4
        "
      >

        {/* Header */}
        <div className="flex  items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">

          <img
            src={ride.riderPhoto}
            alt="Rider"
            className="w-12 h-12 md:w-18 md:h-18 rounded-full object-cover border border-orange-600/40"
          />

          <div className="flex-1">
            <p className="font-semibold text-sm md:text-lg">{ride.riderName}</p>
            <p className="text-xs md:text-md text-white/50">⭐ {ride.rating}</p>
          </div>

          {/* Timer */}
          <div className="text-orange-400 font-semibold text-sm md:text-lg animate-pulse">
            {timeLeft}s
          </div>

        </div>

        {/* Locations */}
  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-3">

  <div className="flex items-stretch gap-3">

    {/* Left indicator */}
    <div className="flex flex-col items-center">
      
      <span className="w-2 h-2 rounded-full bg-orange-400" />

      {/*dynamic line */}
      <div className="flex-1 w-[2px] bg-white/20 my-1" />

      <span className="w-2 h-2 rounded-full bg-orange-700" />
    </div>

    {/* Content */}
    <div className="flex flex-col gap-3 flex-1">

      {/* Pickup */}
      <div>
        <p className="text-[11px] text-white/40">Pickup</p>
        <p className="text-sm text-white/80 leading-tight">
          {ride.pickup?.split(",").slice(0, 2).join(", ")}
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Drop */}
      <div>
        <p className="text-[11px] text-white/40">Destination</p>
        <p className="text-sm text-white/60 leading-tight">
          {ride.drop?.split(",").slice(0, 2).join(", ")}
        </p>
      </div>

    </div>

  </div>

</div>

        {/* Fare */}
        <div className="bg-orange-700/20 border border-orange-600/30 text-orange-300 font-semibold text-center py-2 rounded-xl">
          ₹ {ride.fare}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">

          <button
            onClick={onReject}
            className="
              flex-1 py-2.5 rounded-xl font-medium
              border border-white/20 text-white/70
              hover:text-white hover:border-white/40 transition
            "
          >
            Reject
          </button>

          <button
            onClick={onAccept}
            className="
              flex-1 py-2.5 rounded-xl font-medium
              bg-orange-700 hover:bg-orange-600
              text-white transition shadow-lg shadow-orange-700/30
            "
          >
            Accept
          </button>

        </div>

      </motion.div>
    </div>
  );
}