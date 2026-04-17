import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">

      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#D6FF2F] animate-pulse" />
          Now available in your city
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white max-w-4xl"
  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}      >
        
        Your ride,{" "}
        <span className="text-[#D6FF2F]">your way.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
className="text-white/90 mt-5 text-lg md:text-xl max-w-xl leading-relaxed"
  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}      >
        Book a ride in under 60 seconds. Safe drivers, live tracking, 
        and zero surge pricing — ever.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-10 flex gap-4 flex-wrap items-center justify-center"
      >
<button 
  className="bg-[#D6FF2F] w-50 text-black px-7 hover:-translate-y-1
 py-3 rounded-xl font-bold text-sm transition-all duration-200"
  style={{ textShadow: "none" }}
  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0px)"}
  onMouseDown={e => e.currentTarget.style.transform = "translateY(1px)"}
  onMouseUp={e => e.currentTarget.style.transform = "translateY(-3px)"}
>
  Get Started
</button>
      </motion.div>


    </section>
  );
};

export default Hero;