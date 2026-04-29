import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageBackground from "../../components/ImageBackground";
import { getDriverProfile, updateDriverProfile } from "../../services/driver.service";
import Button from "../../components/ui/Button";

function DriverProfile() {
  const navigate = useNavigate();
    

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    vehicleType: "",
    vehicleNumber: "",
    vehicleModel: "",
    licenseNumber: "",
    experience: "",
    isApproved: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);


 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await getDriverProfile();
      const { user, driver } = res;

      setProfileData({
        firstName: user.fullname.firstname,
        lastName: user.fullname.lastname || "",
        email: user.email,
        role: user.role,
        vehicleType: driver?.vehicleType || "",
        vehicleNumber: driver?.vehicleNumber || "",
        vehicleModel: driver?.vehicleModel || "",
        licenseNumber: driver?.licenseNumber || "",
        experience: driver?.experience || "",
        isApproved: driver?.isApproved || false,
      });

      setFormData({
        firstName: user.fullname.firstname,
        lastName: user.fullname.lastname || "",
      });
    } catch (error) {
      console.error("Failed to fetch driver profile", error);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    return errs;
  };

  const handleSave = async () => {
  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }
  setSaveLoading(true);

  try {
    const res = await updateDriverProfile({
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName,
      },
    });

    const user = res.user;
    setProfileData((prev) => ({
      ...prev,
      firstName: user.fullname.firstname,
      lastName: user.fullname.lastname || "",
    }));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  } catch (error) {
    console.error("Failed to update profile", error);
  } finally {
    setSaveLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ImageBackground />
        <div className="text-white text-sm opacity-60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden text-white items-center flex flex-col px-6 pt-20 md:pt-24 pb-10 relative">
      <ImageBackground />

      <div className="w-full max-w-[360px] md:max-w-md bg-white/10 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 rounded-3xl p-6 md:p-8 relative">

        {/* Toast */}
        {showToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#D6FF2F]/15 border border-[#D6FF2F]/30 text-[#D6FF2F] text-xs font-medium px-5 py-2.5 rounded-xl whitespace-nowrap z-10">
            Profile updated!
          </div>
        )}

        {/* Logo */}
        <button onClick={() => navigate("/home")} className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 bg-[#D6FF2F] rounded-lg flex items-center justify-center">
            <span className="text-black font-extrabold text-xs">R</span>
          </div>
          <span className="text-white font-extrabold text-lg">
            Ride<span className="text-[#D6FF2F]">X</span>
          </span>
        </button>

        {/* Scrollable content */}
        <div
          className="pr-1 hsc"
          style={{
            overflowY: "auto",
            maxHeight: "60vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`.hsc::-webkit-scrollbar{display:none}`}</style>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://i.pravatar.cc/100?img=33"
              alt="avatar"
              className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#D6FF2F]/50 object-cover mb-3"
            />
            <h2 className="text-lg font-bold">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-white/45 text-xs mt-1 capitalize">{profileData.role}</p>

            {/* Approval Badge */}
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mt-2 ${
              profileData.isApproved
                ? "bg-green-500/15 text-green-400 border border-green-500/25"
                : "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                profileData.isApproved ? "bg-green-400" : "bg-yellow-400"
              }`} />
              {profileData.isApproved ? "Approved" : "Pending approval"}
            </div>
          </div>

          {/* Account Info */}
          <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2.5">
            Account info
          </p>

          <div className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-2xl px-4 py-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#D6FF2F]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 stroke-[#D6FF2F] fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-white/40">Email</p>
              <p className="text-sm font-medium">{profileData.email}</p>
            </div>
          </div>

          {/* Vehicle Details */}
          <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2.5">
            Vehicle details
          </p>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <p className="text-[10px] text-white/38 mb-1">Type</p>
              <p className="text-sm font-medium capitalize">{profileData.vehicleType || "—"}</p>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <p className="text-[10px] text-white/38 mb-1">Number</p>
              <p className="text-sm font-medium">{profileData.vehicleNumber || "—"}</p>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <p className="text-[10px] text-white/38 mb-1">Model</p>
              <p className="text-sm font-medium">{profileData.vehicleModel || "—"}</p>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <p className="text-[10px] text-white/38 mb-1">Experience</p>
              <p className="text-sm font-medium">
                {profileData.experience ? `${profileData.experience} yrs` : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#D6FF2F]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 stroke-[#D6FF2F] fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-white/40">License number</p>
              <p className="text-sm font-medium">{profileData.licenseNumber || "—"}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/8 mb-5" />

          {/* Edit Profile */}
          <p className="text-sm font-semibold mb-3">Edit profile</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-[11px] text-white/40 mb-1.5">First name</p>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`w-full bg-white/8 border ${
                    errors.firstName ? "border-red-400" : "border-white/15"
                  } rounded-xl px-3 pr-8 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#D6FF2F]/50 transition-all`}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-40">
                  <svg className="w-3.5 h-3.5 stroke-[#D6FF2F] fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </span>
              </div>
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <p className="text-[11px] text-white/40 mb-1.5">Last name</p>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`w-full bg-white/8 border ${
                    errors.lastName ? "border-red-400" : "border-white/15"
                  } rounded-xl px-3 pr-8 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#D6FF2F]/50 transition-all`}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-40">
                  <svg className="w-3.5 h-3.5 stroke-[#D6FF2F] fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </span>
              </div>
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            loading={saveLoading}
            className="w-full bg-[#D6FF2F] text-black font-bold py-3 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F40] active:scale-95 transition-all duration-200 mb-2.5"
          >
            Save changes
          </Button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/8 border border-red-500/20 text-red-400 font-semibold py-3 rounded-xl text-sm hover:bg-red-500/15 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 stroke-red-400 fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default DriverProfile;