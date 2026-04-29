import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TripCompleted({ selectedRide, driverInfo, fare }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 text-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] flex flex-col gap-4"
      >

        {/* Heading */}
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-4xl mb-2"
          >
            🎉
          </motion.div>

          <h2 className="text-lg font-bold text-white">
            Trip Completed!
          </h2>

          <p className="text-xs md:text-sm text-white/50 mt-1">
            Hope you enjoyed your{" "}
            <span className="text-[#D6FF2F]">{selectedRide}</span> ride
          </p>
        </div>

        {/* Fare card */}
        <div className="
          bg-white/10 backdrop-blur-xl border border-white/20
          rounded-2xl p-4 text-center
        ">
          <p className="text-xs text-white/50 mb-1">Total Fare</p>
          <p className="text-3xl font-bold text-[#D6FF2F]">
            ₹{fare || driverInfo?.fare || "—"}
          </p>
        </div>

    {/* Driver Card */}
        <div className="
          bg-white/10 backdrop-blur-xl border border-white/20
          rounded-2xl p-3 flex items-center gap-3
        ">

          {/* Left */}
          <img
            src={driverInfo?.photo || "https://i.pravatar.cc/100"}
            alt="driver"
            className="w-10 h-10 md:w-18 md:h-18 rounded-full object-cover border-2 border-[#D6FF2F]"
          />

          {/* Center */}
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">
              {driverInfo?.name || "Driver"}
            </p>
            <p className="text-xs text-white/60">
              ⭐ {driverInfo?.rating || "4.5"} rating
            </p>
          </div>

          {/* Right */}
          <div className="text-right">
            <p className="text-[#D6FF2F] font-bold text-sm">
              {driverInfo?.vehicleNumber || "XX-00-XX"}
            </p>
            <p className="text-xs text-white/70">
              {selectedRide}
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate("/home")}
          className="
            w-full py-3 rounded-2xl
            bg-[#D6FF2F] text-black font-bold text-sm
            hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F50]
            active:scale-95 transition-all duration-200
          "
        >
          Back to Home
        </button>

      </motion.div>
    </div>
  );
}