import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateRide } from "../../utils/ride.validators";
import { motion } from "framer-motion";
import ImageBackground from "../../components/ImageBackground";
import Header from "../../components/Header.jsx";

function Destination() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropCoordinates, setDropCoordinates] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get current location
  useEffect(() => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPickupCoordinates([longitude, latitude]);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setPickup(data.display_name || "Current Location");
        } catch {
          setPickup("Current Location");
        }

        setLoadingLocation(false);
      },
      () => {
        setPickup("Current Location");
        setPickupCoordinates([78.0322, 30.3165]);
        setLoadingLocation(false);
      }
    );
  }, []);

  // Pickup suggestions
  useEffect(() => {
    if (pickup.length < 3) return setPickupSuggestions([]);
    if (pickupCoordinates) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${pickup}&format=json&limit=5&countrycodes=in`
        );
        const data = await res.json();
        setPickupSuggestions(data);
      } catch (err) {
        console.log(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pickup]);

  // Drop suggestions
  useEffect(() => {
    if (drop.length < 3) return setDropSuggestions([]);
    if (dropCoordinates) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${drop}&format=json&limit=5&countrycodes=in`
        );
        const data = await res.json();
        setDropSuggestions(data);
      } catch (err) {
        console.log(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [drop]);

  const isValid =
    pickup.trim() &&
    drop.trim() &&
    pickupCoordinates &&
    dropCoordinates;

  const handleContinue = () => {
    const errorsObj = validateRide({
    pickup,
    drop,
    pickupCoordinates,
    dropCoordinates,
  });

 if (Object.keys(errorsObj).length > 0) {
  setErrors(errorsObj);
  return;
}

    navigate("/ride-options", {
      state: {
        pickup,
        drop,
        pickupCoordinates,
        dropCoordinates,
      },
    });
  };

  const inputClass = `
    w-full px-4 py-3 md:py-5  
    rounded-xl text-white text-sm md:text-lg
    bg-white/10 border border-white/20
    placeholder:text-white/30
    focus:outline-none focus:border-[#D6FF2F]/60
    transition-all duration-200
  `;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center relative">

      <ImageBackground />
      <Header />

      {/* Content */}
      <div className="px-6 w-full flex flex-col items-center">

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
          Plan your trip
        </h1>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            w-full max-w-[560px] md:max-w-[620px]
            bg-white/10 backdrop-blur-xl border border-white/20
            rounded-3xl py-6 px-4 md:p-8
          "
        >
          <div className="flex items-start gap-1 mb-5 ">

            {/* Dots */}
            <div className="flex flex-col items-center mt-4 md:mt-5">
              <div className="w-3 h-3 rounded-full bg-[#D6FF2F]" />
              <div className="w-px h-13 md:h-22 bg-white/20 my-1" />
              <div className="w-3 h-3 rounded-full bg-white/60" />
            </div>

            {/* Inputs */}
            <div className="flex-1 flex flex-col gap-5 ml-1 md:ml-2">

              {/* Pickup */}
              <div className="relative">
                <input
                  value={loadingLocation ? "Fetching location..." : pickup}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    setPickupCoordinates(null);
                  }}
                  placeholder="Pickup location"
                  className={inputClass}
                />
                {errors.pickup && (
                  <p className="text-red-400 text-xs mt-1">{errors.pickup}</p>
            )}


                {pickupSuggestions.length > 0 && !pickupCoordinates && (
                  <div className="absolute z-10 mt-2 w-full bg-black/90 rounded-2xl overflow-hidden">
                    {pickupSuggestions.slice(0, 3).map((place, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setPickup(place.display_name);
                          setPickupCoordinates([
                            parseFloat(place.lon),
                            parseFloat(place.lat),
                          ]);
                          setPickupSuggestions([]);
                        }}
                        className="px-4 py-3 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
                      >
                        📍 {place.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drop */}
              <div className="relative">
                <input
                  value={drop}
                  onChange={(e) => {
                    setDrop(e.target.value);
                    setDropCoordinates(null);
                  }}
                  placeholder="Where are you going?"
                  className={inputClass}
                />
                {errors.drop && (
                  <p className="text-red-400 text-xs mt-1">{errors.drop}</p>
              )}

                {dropSuggestions.length > 0 && !dropCoordinates && (
                  <div className="absolute z-10 mt-2 w-full bg-black/90 rounded-2xl overflow-hidden">
                    {dropSuggestions.slice(0, 3).map((place, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setDrop(place.display_name);
                          setDropCoordinates([
                            parseFloat(place.lon),
                            parseFloat(place.lat),
                          ]);
                          setDropSuggestions([]);
                        }}
                        className="px-4 py-3 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
                      >
                        📍 {place.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="h-px bg-white/10 mb-4 my-8" />

          <button
            disabled={!isValid}
            onClick={handleContinue}
            className="
              w-full py-3 md:py-4 rounded-2xl
              bg-[#D6FF2F] text-black font-bold text-sm md:text-lg
              hover:-translate-y-1
              active:scale-95
              disabled:opacity-40
              transition-all duration-200
            "
          >
            {isValid ? "Continue →" : "Enter locations to continue"}
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default Destination;