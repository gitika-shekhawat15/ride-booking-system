import { motion } from "framer-motion";
import bikeImg from "../../assets/images/bikeImg.png";
import autoImg from "../../assets/images/autoImg.png";
import carImg from "../../assets/images/blackCarImg.png";

const vehicleImages = {
  Bike: bikeImg,
  Auto: autoImg,
  Cab: carImg,
};

export default function DriverArriving({ selectedRide, driverInfo }) {
  return (
    <div className="flex flex-col items-center justify-center md:px-4 md:py-8 px-2 py-5 text-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] px-4 flex flex-col gap-4"
      >

        {/* Heading */}
        <div className="text-center">
          <motion.img
            src={vehicleImages[selectedRide] || carImg}
            alt={selectedRide}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-28 h-12 md:w-64 md:h-30 mx-auto mb-2 drop-shadow-xl"
          />

          <h2 className="text-lg font-bold text-white md:text-xl">
            Driver has arrived!
          </h2>

          <p className="text-xs md:text-sm text-white/60 mt-1">
            Your <span className="text-[#D6FF2F]">{selectedRide}</span> is waiting for you
          </p>
        </div>

        {/* OTP */}
        <div className="bg-[#D6FF2F] rounded-2xl p-3 text-center">
          <p className="text-xs text-black/60 mb-1">Show this OTP to driver</p>
          <p className="text-2xl font-bold tracking-widest text-black">
            {driverInfo?.otp || "4531"}
          </p>
        </div>

        {/* Driver card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex items-center gap-3">

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
            <p className="text-xs md:text-sm text-white/60">
              ⭐ {driverInfo?.rating || "4.5"}
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

      </motion.div>
    </div>
  );
}