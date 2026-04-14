
import { motion } from "framer-motion";

const steps = [
  { title: "Enter Location", desc: "Set your pickup and drop location easily", icon: "📍" },
  { title: "Choose Ride", desc: "Select from bike, auto or cab", icon: "🚗" },
  { title: "Track Driver", desc: "Track your ride in real-time", icon: "🛰️" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          How it <span className="text-[#D6FF2F]">works</span>
        </motion.h2>

        <div className="relative grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
              className="
                relative p-6 rounded-2xl text-center
                bg-white/10 backdrop-blur-xl border border-white/20
                bg-gradient-to-br from-white/15 to-white/5
                hover:-translate-y-1 hover:border-[#D6FF2F]/40
                hover:shadow-lg transition-all duration-300
              "
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D6FF2F] text-black text-xs font-bold px-3 py-1 rounded-full">
                {i + 1}
              </div>
              <div className="text-4xl mb-4 mt-4">{step.icon}</div>
              <h3 className="text-lg font-semibold text-[#D6FF2F]">{step.title}</h3>
              <p className="text-white/70 text-sm mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;