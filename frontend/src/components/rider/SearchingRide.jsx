import { useEffect } from "react";
import { motion } from "framer-motion";
import driverImg from "../../assets/images/driverImg.png";


export default function SearchingRide({ selectedRide }) {

  useEffect(() => {
    console.log("Searching drivers for", selectedRide);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 text-white md:my-10">

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-bold text-center mb-1"
      >
        Looking for nearby
        <span className="text-[#D6FF2F]"> {selectedRide} </span>
        drivers
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/50 md:text-sm text-xs text-center mb-6" 
   >
        This may take a few seconds...
      </motion.p>

      {/* Pulsing circle + vehicle */}
      <div className="relative flex items-center justify-center w-70 h-50 mt-5 ">
        {/* Outer pulse */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-50 h-50 rounded-full bg-[#D6FF2F]/20"
        />
        {/* Middle pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute w-40 h-40 rounded-full bg-[#D6FF2F]/30"
        />
        {/* Vehicle icon center */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="
            w-30 h-30 rounded-full z-10
            bg-white/10 backdrop-blur-xl border border-white/20
            flex items-center justify-center text-5xl
          "
        >
          <img src={driverImg} className="w-30 h-30 object-contain ml-6" />"
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 md:gap-4 mt-9 md:mt-15">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-3 h-3 md:w-4 md:h-4 bg-[#D6FF2F] rounded-full"
          />
        ))}
      </div>

    </div>
  );
}