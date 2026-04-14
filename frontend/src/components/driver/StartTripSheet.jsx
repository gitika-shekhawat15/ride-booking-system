import { motion } from "framer-motion";

export default function StartTripSheet({ ride, onStartTrip }) {
  return (
    <div className="flex flex-col items-center justify-center  md:px-4 md:py-8 px-2 py-5 text-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-[360px]
          px-4 flex flex-col gap-4
        "
      >

        {/* Title */}
        <h2 className="text-lg  font-bold text-center text-white/90">
          Ready to start ride
        </h2>

        {/* Rider Info */}
         <div className="flex  items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">

          <img
            src={ride.riderPhoto}
            alt="Rider"
            className="w-10 h-10 md:w-18 md:h-18 rounded-full object-cover border border-orange-600/40"
          />

          <div className="flex-1">
            <p className="font-semibold text-sm md:text-lg">{ride.riderName}</p>
            <p className="text-xs md:text-md text-white/50">⭐ {ride.rating}</p>
          </div>

        </div>

           {/* Location (combined card same as before) */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-3">

          <div className="flex items-stretch gap-3">

            {/* indicator */}
            <div className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <div className="flex-1 w-[2px] bg-white/20 my-1" />
              <span className="w-2 h-2 rounded-full bg-orange-700" />
            </div>

            {/* text */}
            <div className="flex flex-col gap-2 flex-1">
              <div>
                <p className="text-[11px] text-white/40">Pickup</p>
                <p className="text-sm text-white/60 leading-tight line-clamp-2">
                  {ride.pickup}
                </p>
              </div>

              <div className="h-[1px] bg-white/10" />

              <div>
                <p className="text-[11px] text-white/40">Destination</p>
                <p className="text-sm text-white/80 leading-tight line-clamp-2">
                  {ride.drop}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Verified */}
        <div className="flex items-center gap-2 bg-orange-700/10 border border-orange-600/20 text-orange-300 text-xs px-3 py-2 rounded-lg">
          ✔ Customer location verified
        </div>

        {/* CTA */}
        <button
          onClick={onStartTrip}
          className="
            w-full py-2.5 rounded-xl font-medium
            bg-orange-700 hover:bg-orange-600
            text-white transition shadow-lg shadow-orange-700/30
          "
        >
          START RIDE
        </button>

      </motion.div>
    </div>
  );
}