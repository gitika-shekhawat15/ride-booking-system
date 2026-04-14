import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ImageBackground from "../../components/ImageBackground";
import carImg from "../../assets/images/car.png";
import driverImg from "../../assets/images/driver.png";
import Header from "../../components/Header.jsx";


function RiderHome() {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] overflow-hidden text-white flex flex-col items-center justify-center pt-8 md:pt-0 px-4 md:px-8 gap-3 md:gap-6">
      <ImageBackground />
      <Header  />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg md:text-4xl font-bold text-center md:mt-6"
      > 
        What would you like to do?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-white/50 text-xs md:text-base text-center -mt-2"
      >
        Choose your role to get started
      </motion.p>

      {/* Cards */}
      <div className="w-full p-3 max-w-sm md:max-w-6xl grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-8 ">

        {/* Card 1 — Request Ride */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -12, transition: { duration: 0.2 } }}
          className="bg-[#D6FF2F] text-black rounded-2xl md:rounded-3xl p-4 md:p-10 flex flex-col cursor-pointer shadow-xl active:scale-[0.98] overflow-hidden"
        >
          <span className=" hidden md:block text-xs font-semibold uppercase tracking-widest text-black/50 md:mb-6">
            Rider
          </span>
          <img src={carImg} className="h-16 md:h-40 w-auto object-contain object-left mb-2 md:mb-4 drop-shadow-xl" />
          <h2 className="text-base md:text-3xl font-bold mb-0.5 md:mb-3">Request a Ride</h2>
          <p className="text-xs md:text-base text-black/60 leading-relaxed mb-4 md:mb-4">
            Fast, safe and reliable travel anywhere in your city. Book in under 60 seconds.
          </p>
          <button
            onClick={() => navigate("/book-ride")}
            className="mt-auto w-full bg-black text-white px-4 md:px-6 py-2 md:py-3.5 rounded-xl md:rounded-2xl text-sm font-bold  transition-all duration-200 hover:-translate-y-1"
          >
            Book Ride →
          </button>
        </motion.div>

        {/* Card 2 — Become Driver */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -12, transition: { duration: 0.2 } }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl md:rounded-3xl p-4 md:p-10 flex flex-col cursor-pointer shadow-xl overflow-hidden"
        >
          <span className="hidden md:block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1 md:mb-6">
            Driver
          </span>
          <img src={driverImg} className="h-16 md:h-40 w-auto object-contain object-left mb-2 md:mb-4 drop-shadow-xl" />
          <h2 className="text-base md:text-3xl font-semibold mb-0.5 md:mb-3">Become a Driver</h2>
          <p className="text-xs md:text-base text-white/70 leading-relaxed mb-4 md:mb-4">
            Earn money with RideX. Flexible hours, instant payouts and full freedom.
          </p>
          <button
            onClick={() => navigate("/become-driver")}
            className="mt-auto w-full border border-[#D6FF2F] text-[#D6FF2F] px-4 md:px-6 py-2 md:py-3.5 rounded-xl md:rounded-2xl text-sm font-bold  transition-all duration-200 hover:-translate-y-1"
          >
            Apply Now →
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default RiderHome;