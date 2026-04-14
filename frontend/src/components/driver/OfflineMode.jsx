import { motion } from "framer-motion";

export default function OfflineMode({ onGoOnline }) {
  return (
    <div className="flex flex-col  items-center  w-full md:mt-1 overflow-hidden gap-3 md:gap-7 px-4 py-8 md:px-6 md:py-9 rounded-3xl ">
      
      {/* Icon + Text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-orange-700/15 border border-orange-600/30 flex items-center justify-center">
          <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none"
            stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-white/30 text-[10px] md:text-[11px] uppercase tracking-widest">Driver mode</p>
        <h2 className="text-lg md:text-2xl font-bold text-white">You are offline</h2>
        <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-[300px]">
          You're currently offline. Go online to start receiving ride requests and earning instantly.
        </p>
      </motion.div>

      {/* Info Cards */}
      <div className="w-full flex flex-col gap-2 md:gap-2.5">
        {[
          {
            icon: (
              <svg className="w-4 h-4 md:w-[18px] md:h-[16px]" viewBox="0 0 24 24" fill="none"
                stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            ),
            title: "Rides near you",
            desc: "Go online to see ride requests in your area",
          },
          {
            icon: (
              <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none"
                stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            ),
            title: "Earn every trip",
            desc: "Every trip gets you closer to your daily goal",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 + i * 0.08 }}
            className="bg-white/10 border border-white/20 rounded-xl px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 md:w-[38px] md:h-[38px] rounded-xl bg-orange-700/10 border border-orange-600/30 flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-white/80 text-xs md:text-[13px] font-medium leading-none mb-1">{card.title}</p>
              <p className="text-white/40 text-[11px] md:text-xs leading-relaxed">{card.desc}</p>
            </div>

            
          </motion.div>
        ))}
      </div>
<button
  onClick={onGoOnline}
  className="w-full bg-orange-700 text-white font-bold py-3 rounded-xl text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
>
  Go Online
</button>

    </div>
  );
}