import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../../services/auth.service.js";
import VideoBackground from "../../components/VideoBackground.jsx";
import { validateSignup } from "../../utils/auth.validators.js";

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: "", lastName: "", email: "", password: "",
  });
  const [errors, setErrors] = useState({});

 const handleChange = (e) => {
  const { name, value } = e.target;

  setSignupData((prev) => ({ ...prev, [name]: value }));

  setErrors((prev) => ({ ...prev, [name]: "" }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignup(signupData);
    if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
  return;
}
    try {
      const payload = {
        fullname: {
          firstname: signupData.firstName,
          lastname: signupData.lastName,
        },
        email: signupData.email,
        password: signupData.password,
      };
      const res = await registerUser(payload);
      console.log("User created", res);
      localStorage.clear();
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      navigate("/home");
    } catch (error) {
  const backendErrors = error.response?.data?.error;

  if (backendErrors) {
    const formattedErrors = {};

    backendErrors.forEach((err) => {
      if (err.path === "email") {
        formattedErrors.email = err.msg;
      }
      if (err.path === "password") {
        formattedErrors.password = err.msg;
      }
      if (err.path === "fullname.firstname") {
        formattedErrors.firstName = err.msg;
      }
      if (err.path === "fullname.lastname") {
        formattedErrors.lastName = err.msg;
      }
    });

    setErrors(formattedErrors);
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
      <span className="text-white font-extrabold text-lg md:text-xl">
        Ride<span className="text-[#D6FF2F]">X</span>
      </span>
    </button>

    <h2 className="text-lg md:text-2xl font-bold text-center mb-0.5">Create account</h2>
    <p className="text-white/50 text-xs md:text-sm text-center mb-4 md:mb-6">Start riding with RideX today</p>

<form onSubmit={handleSubmit} noValidate
 className="flex flex-col gap-3 md:gap-4">

  <div className="grid grid-cols-2 gap-2 md:gap-3">

    {/* First Name */}
    <div className="flex flex-col">
      <input
        type="text"
        name="firstName"
        value={signupData.firstName}
        onChange={handleChange}
        placeholder="First name"
        className={`bg-white/10 border ${
          errors.firstName ? "border-red-400" : "border-white/20"
        } rounded-xl px-3 py-2.5 md:py-3 text-white text-xs md:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D6FF2F]/60 transition-all`}
      />
      {errors.firstName && (
        <p className="text-red-400 text-xs mt-1 ml-1">
          {errors.firstName}
        </p>
      )}
    </div>

    {/* Last Name */}
    <div className="flex flex-col">
      <input
        type="text"
        name="lastName"
        value={signupData.lastName}
        onChange={handleChange}
        placeholder="Last name"
        className={`bg-white/10 border ${
          errors.lastName ? "border-red-400" : "border-white/20"
        } rounded-xl px-3 py-2.5 md:py-3 text-white text-xs md:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D6FF2F]/60 transition-all`}
      />
      {errors.lastName && (
        <p className="text-red-400 text-xs mt-1 ml-1">
          {errors.lastName}
        </p>
      )}
    </div>

  </div>

  {/* Email */}
  <div className="flex flex-col">
    <input
      type="email"
      name="email"
      value={signupData.email}
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
      value={signupData.password}
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

    <button
  type="submit"
  className="
    bg-[#D6FF2F] text-black font-bold
    py-2.5 md:py-3 rounded-xl text-sm md:text-base mt-1
    hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F50]
    active:translate-y-0 active:scale-95 transition-all duration-200
  "
>
  Create Account
</button>
      <button type="button" className="
        bg-white/10 border border-white/20
        py-2.5 md:py-3 rounded-xl text-white text-xs md:text-sm font-medium
        flex items-center justify-center gap-2
        hover:bg-white/20 transition-all duration-200
      ">
        <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" />
        Sign up with Google
      </button>

    </form>

    <p className="text-center text-white/40 text-xs md:text-sm mt-3 md:mt-5">
      Already have an account?{" "}
      <span onClick={() => navigate("/login")} className="text-[#D6FF2F] cursor-pointer hover:underline">
        Sign In
      </span>
    </p>

  </motion.div>
</div>
);
}

export default Signup;