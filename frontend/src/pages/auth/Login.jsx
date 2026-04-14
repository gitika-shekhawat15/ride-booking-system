import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../../services/auth.service.js";
import { useState } from "react";
import VideoBackground from "../../components/VideoBackground.jsx";
import { validateLogin} from "../../utils/auth.validators.js";

function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
  const { name, value } = e.target;

  setLoginData((prev) => ({ ...prev, [name]: value }));

  setErrors((prev) => ({ ...prev, [name]: "" }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(loginData);
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      return;
    }
    try {
      const res = await loginUser({ email: loginData.email, password: loginData.password });
      console.log("User logged in successfully", res);
      localStorage.clear();
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      if (res.user.role === "driver") {
        navigate("/driver/home");
      } else {
        navigate("/home");
      }
    } catch (error) {
    const backendError = error.response?.data?.message;

    if (backendError) {
      setErrors({ general: backendError });
    }
    }
  };

 return (
    <div className="min-h-screen text-white flex items-center justify-center px-6">
      <VideoBackground />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          w-full max-w-[320px] md:max-w-md
          bg-white/10 backdrop-blur-xl border border-white/20
          bg-gradient-to-br from-white/15 to-white/5
          rounded-3xl p-5 md:p-8
        "
      >
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-4 md:mb-6 mx-auto">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-[#D6FF2F] rounded-lg flex items-center justify-center">
            <span className="text-black font-extrabold text-xs md:text-sm">R</span>
          </div>
          <span className="text-white font-extrabold text-lg md:text-xl tracking-tight">
            Ride<span className="text-[#D6FF2F]">X</span>
          </span>
        </button>

        <h2 className="text-lg md:text-2xl font-bold text-center mb-0.5">Welcome back</h2>
        <p className="text-white/50 text-xs md:text-sm text-center mb-4 md:mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate
         className="flex flex-col gap-3 md:gap-4">

  {/* Email */}
  <div className="flex flex-col">
    <input
      type="text"
      name="email"
      value={loginData.email}
      onChange={handleChange}
      placeholder="example@mail.com"
      className={`bg-white/10 border ${
        errors.email ? "border-red-400" : "border-white/20"
      } rounded-xl px-3 py-2.5 md:py-3 text-white text-xs md:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D6FF2F]/60 transition-all`}
    />
    {errors.email && (
      <p className="text-red-400 text-xs mt-1 ml-1">
        {errors.email}
      </p>
    )}
  </div>

  {/* Password */}
  <div className="flex flex-col">
    <input
      type="password"
      name="password"
      value={loginData.password}
      onChange={handleChange}
      placeholder="••••••••"
      className={`bg-white/10 border ${
        errors.password ? "border-red-400" : "border-white/20"
      } rounded-xl px-3 py-2.5 md:py-3 text-white text-xs md:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D6FF2F]/60 transition-all`}
    />
        {errors.password && (
        <p className="text-red-400 text-xs mt-1 ml-1">
        {errors.password}
        </p>
    )}
  </div>

        {/* General Error */}
        {errors.general && (
        <p className="text-red-400 text-sm text-center mt-1">
        {errors.general}
        </p>
        )}


          <button type="submit" className="
            bg-[#D6FF2F] text-black font-bold
            py-2.5 md:py-3 rounded-xl text-sm md:text-base mt-1
            hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F50]
            active:translate-y-0 active:scale-95 transition-all duration-200
          ">
            Sign In
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs">or</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <button type="button" className="
            bg-white/10 backdrop-blur-md border border-white/20
            py-2.5 md:py-3 rounded-xl text-white text-xs md:text-sm font-medium
            flex items-center justify-center gap-2
            hover:bg-white/20 hover:-translate-y-0.5
            active:translate-y-0 transition-all duration-200
          ">
            <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" />
            Continue with Google
          </button>

        </form>

        <p className="text-center text-white/50 text-xs md:text-sm mt-3 md:mt-5">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-[#D6FF2F] hover:underline font-medium cursor-pointer">
            Sign Up
          </span>
        </p>

      </motion.div>
    </div>
  );
}

export default Login;