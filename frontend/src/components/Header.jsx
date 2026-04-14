// components/Header.jsx
import { useNavigate } from "react-router-dom";

// components/Header.jsx
function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const profilePath = role === "driver" ? "/driver/me" : "/rider/me";


  return (
    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 ">
      
      {/* Back Button — left */}
      <button
        onClick={() => navigate(-1)}
        className="md:w-10 md:h-10 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <svg className="md:w-5 md:h-5 w-3 h-3  stroke-white fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>

      {/* Profile Icon — right */}
      <button
        onClick={() => navigate(profilePath)}
        className="md:w-10 md:h-10 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <svg className="md:w-5 md:h-5 w-3 h-3  stroke-white fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>

    </div>
  );
}

export default Header;