import { motion } from "framer-motion";
import tripImg from "../../assets/images/tripImg.png";

export default function TripStarted({ selectedRide, driverInfo }) {
  return (
    <div className="flex flex-col items-center justify-center md:px-4 md:py-8 px-2 py-5 text-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] px-3 flex flex-col gap-4"
      >

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-lg font-bold md:text-lg text-white">
            Trip in progress
          </h2>
          <p className="text-xs md:text-sm text-white/50">
            Sit back and relax!
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 md:gap-4 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-3 h-3 md:w-4 md:h-4 bg-[#D6FF2F] rounded-full"
            />
          ))}
        </div>

        {/* Vehicle */}
        <img
          src={tripImg}
          alt="On the way"
          className="w-70 h-38 md:w-80 md:h-52 object-contain mx-auto"
        />

        {/* Driver card */}
        <div className="
          mt-2 bg-white/10 backdrop-blur-xl border border-white/20
          rounded-2xl p-3 flex items-center gap-3
        ">

          {/* Left */}
          <img
            src={driverInfo?.photo || "https://i.pravatar.cc/100"}
            alt="driver"
            className="w-10 h-10 md:w-18 md:h-18 rounded-full border-2 border-[#D6FF2F]"
          />

          {/* Center */}
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">
              {driverInfo?.name || "Driver"}
            </p>
            <p className="text-xs text-white/50">
              ⭐ {driverInfo?.rating || "4.5"}
            </p>
          </div>

          {/* Right */}
          <div className="text-right">
            <p className="text-[#D6FF2F] font-bold text-sm">
              {driverInfo?.vehicleNumber || "XX-00-XX"}
            </p>
            <p className="text-xs text-white/50">
              {selectedRide}
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
}