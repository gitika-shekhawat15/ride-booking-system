import { motion } from "framer-motion";
import bikeImg from "../../assets/images/bikeImg.png";
import autoImg from "../../assets/images/autoImg.png";
import carImg from "../../assets/images/blackcarImg.png";

const vehicleImages = {
  Bike: bikeImg,
  Auto: autoImg,
  Cab: carImg,
};

export default function NoDrivers({ onRetry, selectedRide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 md:gap-8 px-4 md:py-12 py-5 text-white"
    >
      {/* Vehicle image —  */}
      <motion.img
        src={vehicleImages[selectedRide] || carImg}
        alt={selectedRide}
        animate={{ x: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-50 h-22 md:w-70 md:h-30 grayscale opacity-60 drop-shadow-xl"
      />

      <div className="text-center">
        <h2 className="text-base  md:text-lg font-bold  text-white">No drivers available</h2>
        <p className="text-xs  text-white/60 mt-1">No nearby drivers right now — try again!</p>
      </div>

      <button
        onClick={onRetry}
        className="
          w-full py-3 md:py-4 rounded-2xl
          bg-[#D6FF2F] text-black font-bold text-sm md:text-base
          hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F50]
          active:translate-y-0 active:scale-95
          transition-all duration-200
        "
      >
        Try another ride
      </button>

    </motion.div>
  );
}