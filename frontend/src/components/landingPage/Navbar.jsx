import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }
  setMenuOpen(false);
};

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D6FF2F] rounded-lg flex items-center justify-center">
            <span className="text-black font-extrabold text-sm">R</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            Ride<span className="text-[#D6FF2F]">X</span>
          </span>
        </div>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-white/70 text-sm font-medium">
            Features
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-white/70 text-sm font-medium">
            How it works
          </button>
          <button onClick={() => scrollToSection("stats")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-white/70 text-sm font-medium">
            About
          </button>
         
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
             className="
            text-white/80 text-sm font-medium px-5 py-2 rounded-xl
            bg-white/10 backdrop-blur-md border border-white/20
            hover:bg-white/20 hover:text-white hover:-translate-y-0.5
            active:translate-y-0 transition-all duration-200
          ">
            Sign In
          </button>
          <button
          onClick={ ()=> navigate("/signup")}
          className="
            text-white/80 text-sm font-bold px-5 py-2 rounded-xl
            bg-white/10 backdrop-blur-md border border-white/20
            hover:bg-white/20 hover:text-white hover:-translate-y-0.5
            active:translate-y-0 active:scale-95 transition-all duration-200
          ">
            Sign Up
          </button>
        </div>
        

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col gap-4"
        >
          <button onClick={() => scrollToSection("features")} className="text-white/70 hover:text-white text-sm text-left bg-transparent border-none cursor-pointer">Features</button>
          <button onClick={() => scrollToSection("how-it-works")} className="text-white/70 hover:text-white text-sm text-left bg-transparent border-none cursor-pointer">How it works</button>
          <button onClick={() => scrollToSection("stats")} className="text-white/70 hover:text-white text-sm text-left bg-transparent border-none cursor-pointer">About</button>
          <div className="flex gap-3 pt-2 border-t border-white/10">
            <button
            onClick={() => navigate("/login")}
             className="flex-1 text-white border border-white/20 bg-white/10 backdrop-blur-md py-2 rounded-xl text-sm hover:bg-white/20 transition-all">
            Sign In
            </button>
            <button 
            onClick={() => navigate("/signup")}

            className="flex-1 text-white border border-white/20 bg-white/10 backdrop-blur-md py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
            Sign Up
            </button>
          </div>
        </motion.div>
      )}

    </motion.nav>
  );
};

export default Navbar;