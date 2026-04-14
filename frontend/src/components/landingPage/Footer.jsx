const Footer = () => {
  return (
    <footer className="bg-black text-white/70 py-14 px-6 border-t border-white/10">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        {/* Left - Brand */}
        <div>
          <h2 className="text-white text-xl font-bold">
            Ride<span className="text-[#D6FF2F]">X</span>
          </h2>
          <p className="text-sm mt-3 text-white/60">
            Your ride, your way.
          </p>
        </div>

        {/* Middle - Links */}
        <div className="flex gap-12 text-sm">

          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                About
              </li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                Careers
              </li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                Safety
              </li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                Terms
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-white/40 mt-12">
        © {new Date().getFullYear()} RideX. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;