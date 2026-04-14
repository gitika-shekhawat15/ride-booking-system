import { useEffect, useRef, useState } from "react";
import Hero from "../../components/landingPage/Hero.jsx";
import Stats from "../../components/landingPage/Stats.jsx";
import Features from "../../components/landingPage/Features.jsx";
import HowItWorks from "../../components/landingPage/HowItWorks.jsx";
import CTA from "../../components/landingPage/CTA.jsx";
import Footer from "../../components/landingPage/Footer.jsx";
import heroBg from "../../assets/images/heroBg.mp4";
import Navbar from "../../components/landingPage/Navbar.jsx";


const Home = () => {
  const [blurAmount, setBlurAmount] = useState(0);
  const [darkAmount, setDarkAmount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
   const startBlur = window.innerHeight * 0.5;  // 50% scroll ke baad START
      const maxScroll = window.innerHeight * 1.2;  // full blur yahan complete ho

      const progress = Math.min(
        Math.max((scrollY - startBlur) / (maxScroll - startBlur), 0), // 0 se pehle 0 hi rahe
        1
      );
      
      setBlurAmount(progress * 14);        // 0 → 14px blur
      setDarkAmount(progress * 0.6);       // 0 → 0.6 darkness
    };
     if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="text-white">

      <div className="fixed inset-0 -z-10">
        <video
          autoPlay loop muted playsInline
          style={{ 
            filter: `blur(${blurAmount}px)`,
            transform: "scale(1.08)",
          }}
          className="w-full h-full object-cover"
        >
          <source src={heroBg} type="video/mp4" />
        </video>

        {/* ✅ Static dark overlay — hamesha thodi darkness */}
        <div className="absolute inset-0 bg-black/40" />

        {/* ✅ Scroll ke saath aur dark hota hai */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: darkAmount }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>

    </div>
  );
};

export default Home;