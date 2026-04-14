import { motion } from "framer-motion";
import driverImg from "../../assets/images/driver2.png";


export default function SearchingRide() {
  return (
        <div className="flex flex-col items-center justify-center py-4 px-4 text-white md:my-4">

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 px-4 text-white"
    >
      {/* Text */}
      <h2 className="text-xl font-bold text-center">
        Looking for <span className="text-orange-400">rides...</span>
      </h2>
      <p className="text-white/50 text-sm text-center mb-2">
        Stay online to receive ride requests
      </p>

            {/* Pulsing circle + vehicle */}
            <div className="relative flex items-center justify-center w-70 h-50 mt-5 ">
              {/* Outer pulse */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-50 h-50 rounded-full bg-orange-400/20"
              />
              {/* Middle pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute w-40 h-40 rounded-full bg-orange-400/30"
              />
              {/* Vehicle icon center */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="
                  w-30 h-30 rounded-full z-10
                  bg-white/10 backdrop-blur-xl border border-orange-700/20
                  flex items-center justify-center text-5xl
                "
              >
                <img src={driverImg} className="w-18 object-contain ml-6" />"
              </motion.div>
            </div>
      
            {/* Dots */}
            <div className="flex justify-center gap-3 md:gap-4 mt-9 md:mt-15">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-4 h-4 md:w-4 md:h-4 bg-orange-500 rounded-full"
                />
              ))}
            </div>

    </motion.div>
  </div>
  );
}