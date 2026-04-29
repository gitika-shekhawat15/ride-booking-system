import { useState } from "react";
import { becomeDriver } from "../../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ImageBackground from "../../components/ImageBackground.jsx";
import { validateDriver } from "../../utils/driver.validators.js";
import Button from "../../components/ui/Button.jsx";

export default function BecomeDriver() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState({
    vehicleType: "",
    vehicleNumber: "",
    vehicleModel: "",
    licenseNumber: "",
    experience: ""
  });

  const handleChange = (e) => {
  const { name, value } = e.target;

  setDriverData((prev) => ({ ...prev, [name]: value }));

  setErrors((prev) => ({ ...prev, [name]: "" }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
     const validationErrors = validateDriver(driverData);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        vehicleType: driverData.vehicleType,
        vehicleNumber: driverData.vehicleNumber,
        vehicleModel: driverData.vehicleModel,
        licenseNumber: driverData.licenseNumber,
        experience: driverData.experience,
      };
      const res = await becomeDriver(payload, token);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "driver");
      navigate("/driver/home");
    } catch (error) {
      setErrors({
      general: error.response?.data?.message || "Something went wrong",
    });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    bg-white/10 border border-white/20 rounded-xl
    px-3 py-2.5 text-white text-xs md:text-sm w-full
    placeholder:text-white/30
    focus:outline-none focus:border-[#D6FF2F]/60
    transition-all duration-200
  `;

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-6 py-10">

      <ImageBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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

        <h2 className="text-lg md:text-2xl font-bold text-center mb-0.5">Become a Driver</h2>
        <p className="text-white/50 text-xs md:text-sm text-center mb-4 md:mb-6">Fill in your vehicle details</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

  {/* Vehicle Type */}
  <div className="flex flex-col">
    <select
      name="vehicleType"
      value={driverData.vehicleType}
      onChange={handleChange}
      className={`${inputClass} ${
        errors.vehicleType ? "border-red-400" : "border-white/20"
      } bg-white/10`}
    >
      <option value="" className="bg-zinc-900">Select Vehicle Type</option>
      <option value="bike" className="bg-zinc-900">Bike</option>
      <option value="car" className="bg-zinc-900">Car</option>
      <option value="auto" className="bg-zinc-900">Auto</option>
    </select>

    {errors.vehicleType && (
      <p className="text-red-400 text-xs mt-1 ml-1">
        {errors.vehicleType}
      </p>
    )}
  </div>

  {/* Vehicle Number */}
  <div className="flex flex-col">
    <input
      type="text"
      name="vehicleNumber"
      value={driverData.vehicleNumber}
      onChange={handleChange}
      placeholder="Vehicle Number"
      className={`${inputClass} ${
        errors.vehicleNumber ? "border-red-400" : "border-white/20"
      }`}
    />

    {errors.vehicleNumber && (
      <p className="text-red-400 text-xs mt-1 ml-1">
        {errors.vehicleNumber}
      </p>
    )}
  </div>

  {/* Vehicle Model */}
  <div className="flex flex-col">
    <input
      type="text"
      name="vehicleModel"
      value={driverData.vehicleModel}
      onChange={handleChange}
      placeholder="Vehicle Model"
      className={inputClass}
    />
  </div>

  {/* License Number */}
  <div className="flex flex-col">
    <input
      type="text"
      name="licenseNumber"
      value={driverData.licenseNumber}
      onChange={handleChange}
      placeholder="License Number"
      className={`${inputClass} ${
        errors.licenseNumber ? "border-red-400" : "border-white/20"
      }`}
    />

    {errors.licenseNumber && (
      <p className="text-red-400 text-xs mt-1 ml-1">
        {errors.licenseNumber}
      </p>
    )}
  </div>

  {/* Experience */}
  <div className="flex flex-col">
    <input
      type="number"
      name="experience"
      value={driverData.experience}
      onChange={handleChange}
      placeholder="Years of Experience"
      className={inputClass}
    />
  </div>

  {/* General Error */}
  {errors.general && (
    <p className="text-red-400 text-xs text-center">
      {errors.general}
    </p>
  )}

          <Button onClick={handleSubmit} loading={loading} className="
            bg-[#D6FF2F] text-black font-bold
            py-2.5 md:py-3 rounded-xl text-sm md:text-base mt-1
            hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F50]
            active:translate-y-0 active:scale-95 transition-all duration-200
          ">
            Submit Application
          </Button>

        </form>

        <p className="text-center text-white/40 text-xs mt-3">
          Changed your mind?{" "}
          <span onClick={() => navigate("/home")} className="text-[#D6FF2F] cursor-pointer hover:underline">
            Go Back
          </span>
        </p>

      </motion.div>
    </div>
  );
}