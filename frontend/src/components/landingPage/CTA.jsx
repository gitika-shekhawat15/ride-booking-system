
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section id="contact" className="py-20 px-6 text-white">
      
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          max-w-4xl mx-auto text-center
          bg-white/10 backdrop-blur-xl border border-white/20
          bg-gradient-to-br from-white/15 to-white/5
          hover:-translate-y-1 hover:border-[#D6FF2F]/40
          hover:shadow-lg transition-all duration-300
          rounded-3xl p-10
        "
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Get <span className="text-[#D6FF2F]">₹50 off</span> on your first ride
        </h2>

        <p className="mt-3 text-white/70 text-sm md:text-base">
          Join thousands of riders using RideX daily
        </p>

        <button className="
          mt-8
          bg-[#D6FF2F] text-black
          px-6 py-3 rounded-xl font-semibold
          hover:-translate-y-1 hover:shadow-[0_6px_20px_#D6FF2F50]
          active:translate-y-0 active:scale-95
          transition-all duration-200
        ">
          Book your ride
        </button>
      </motion.div>

    </section>
  );
};

export default CTA;