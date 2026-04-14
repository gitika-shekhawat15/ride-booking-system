import GlassCard from "../GlassCard";
import { motion } from "framer-motion";

const features = [
  { title: "Instant Booking", desc: "Get a ride in under 60 seconds", icon: "⚡" },
  { title: "Safe Rides", desc: "OTP verification + live tracking", icon: "🛡️" },
  { title: "Transparent Pricing", desc: "No hidden charges or surge", icon: "💰" },
  { title: "Multiple Options", desc: "Bike, Auto, Cab at your choice", icon: "🛵" },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Why choose <span className="text-[#D6FF2F]">RideX?</span>
        </motion.h2>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
              className="
                p-6 rounded-2xl
                bg-white/10 backdrop-blur-xl border border-white/20
                bg-gradient-to-br from-white/15 to-white/5
                hover:-translate-y-1 hover:border-[#D6FF2F]/40
                hover:shadow-lg transition-all duration-300
              "
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-[#D6FF2F]">{item.title}</h3>
              <p className="text-white/70 mt-2 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;