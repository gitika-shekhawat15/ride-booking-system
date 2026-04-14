import { motion } from "framer-motion";

export default function CompleteTrip({ ride, onEndTrip }) {
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
        <h2 className="text-lg font-bold text-white/90 text-center">
          Trip in progress
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

        {/* Destination (MAIN) */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-3">
          <p className="text-[11px] text-white/40 mb-1">Destination</p>
          <p className="text-sm text-white/80 leading-tight line-clamp-2">
            {ride.drop}
          </p>
        </div>

        {/* Navigate */}
        <button
          className="
            w-full py-2.5 rounded-xl font-medium
            bg-white/10 border border-white/20 text-white/80
            hover:bg-white/20 transition
          "
        >
          Navigate to Drop
        </button>

        {/* Complete Ride */}
        <button
          onClick={onEndTrip}
          className="
            w-full py-2.5 rounded-xl font-medium
            bg-orange-700 hover:bg-orange-600
            text-white transition shadow-lg shadow-orange-700/30
          "
        >
          COMPLETE RIDE
        </button>

      </motion.div>
    </div>
  );
}