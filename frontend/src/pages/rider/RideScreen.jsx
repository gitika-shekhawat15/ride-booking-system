import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RideOptions from "../../components/rider/RideOptions";
import SearchingRide from "../../components/rider/SearchingRide";
import RideAccepted from "../../components/rider/RideAccepted.jsx";
import DriverArriving from "../../components/rider/DriverArriving.jsx";
import TripStarted from "../../components/rider/TripStarted.jsx";
import NoDrivers from "../../components/rider/NoDrivers.jsx";
import DriverBusy from "../../components/rider/DriverBusy.jsx";
import TripCompleted from "../../components/rider/TripCompleted.jsx";
import { createRideService } from "../../services/ride.service.js";
import RideHeader from "../../components/rider/RideHeader.jsx";
import MapView from "../../components/MapView";
import socket from "../../socket";

export default function RideScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [step, setStep] = useState("OPTIONS");
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideId, setRideId] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [myLocation, setMyLocation] = useState({ lat: null, lng: null });
  const [driverInfo, setDriverInfo] = useState(null);

  const handleConfirm = async () => {
  try {
    const { pickupCoordinates, dropCoordinates } = state; // ✅ sirf state se lo

    const pickupLocation = { type: "Point", coordinates: pickupCoordinates };
    const dropLocation = { type: "Point", coordinates: dropCoordinates };
    const decoded = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
    const userId = decoded._id;

    const res = await createRideService(
      userId,
      pickupLocation,
      dropLocation, 
      selectedRide.toLowerCase()
    );
    setRideId(res._id);
    setStep("SEARCHING");
  } catch (err) {
    console.log("Error:", err);
  }
};

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (err) => console.log("Location error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const decoded = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
    const userId = decoded._id;
    socket.emit("join", { userId, role: "rider" });
    socket.on("ride:status", (data) => {
      if (data.status === "ASSIGNED") { setStep("ACCEPTED"); setDriverInfo(data.driver); }
      if (data.status === "ARRIVED") setStep("DRIVER_ARRIVING");
      if (data.status === "STARTED") setStep("TRIP_STARTED");
      if (data.status === "COMPLETED") setStep("TRIP_COMPLETED");
    });
    socket.on("ride:search_failed", (data) => {
      if (data.reason === "NO_DRIVERS") setStep("NO_DRIVERS");
      if (data.reason === "DRIVER_UNAVAILABLE") setStep("DRIVER_BUSY");
    });
    socket.on("driver:location", (data) => {
      setDriverLocation({ lat: data.lat, lng: data.lng });
    });
    return () => {
      socket.off("ride:status");
      socket.off("driver:location");
      socket.off("ride:search_failed");
    };
  }, []);

  // ✅ Reusable pickup/drop card
  const PickupDropCard = () => (
    <div
      onClick={() => navigate("/book-ride")}
      className="
        bg-black/50 backdrop-blur-xl border border-white/10
        rounded-2xl px-3 py-2.5 md:my-5 md:mx-3 flex flex-col gap-2
        cursor-pointer hover:border-[#D6FF2F]/40 transition-all
      "
    >
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2 h-2 rounded-full bg-[#D6FF2F] shrink-0" />
        <p className="text-white/70 truncate">{state?.pickup || "Pickup"}</p>
      </div>
      <div className="h-px bg-white/10 ml-4" />
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2 h-2 rounded-full bg-white/50 shrink-0" />
        <p className="text-white/70 truncate">{state?.drop || "Drop"}</p>
      </div>
    </div>
  );

  // ✅ Reusable step content
  const StepContent = () => (
    <>
      {step === "OPTIONS" && <RideOptions selectedRide={selectedRide} setSelectedRide={setSelectedRide} onConfirm={handleConfirm} />}
      {step === "SEARCHING" && <SearchingRide selectedRide={selectedRide} />}
      {step === "NO_DRIVERS" && <NoDrivers onRetry={() => setStep("OPTIONS")} />}
      {step === "DRIVER_BUSY" && <DriverBusy onRetry={() => setStep("OPTIONS")} />}
      {step === "ACCEPTED" && <RideAccepted selectedRide={selectedRide} driverInfo={driverInfo} />}
      {step === "DRIVER_ARRIVING" && <DriverArriving selectedRide={selectedRide} driverInfo={driverInfo} />}
      {step === "TRIP_STARTED" && <TripStarted selectedRide={selectedRide} driverInfo={driverInfo} />}
      {step === "TRIP_COMPLETED" && <TripCompleted selectedRide={selectedRide} driverInfo={driverInfo} />}
    </>
  );

  return (
    <div className="h-screen  w-full overflow-hidden">
      
      {/*  LAPTOP — sidebar left + map right */}
      <div className="hidden md:flex  ">
         {/* Map */}
        <div className="absolute inset-0 z-0">
          <MapView
            lat={myLocation.lat}
            lng={myLocation.lng}
            driverLocation={driverLocation}
            pickupLocation={{ coordinates: state?.pickupCoordinates }}
            dropLocation={{ coordinates: state?.dropCoordinates }}
          />
        </div>
    
        {/* Left sidebar */}
        <div className={`w-[380px] flex flex-col absolute left-20 top-20 
           bg-white/10 backdrop-blur-lg
          border-r border-white/10 z-10 * rounded-3xl 
         `}>
            

          <div className="px-4 py-3 md:py-5 border-b border-white/20">

  {step === "OPTIONS" ? (
    <PickupDropCard />
  ) : (
    <RideHeader rideStatus={step} />
  )}

</div>

          <div className="flex-1 overflow-y-auto text-white">
            <StepContent />
          </div>
        </div>

      </div>

      {/*  MOBILE — map full + top card + bottom sheet */}
      <div className="md:hidden h-full relative">

        {/* Map full screen */}
        <div className="absolute inset-0 z-0">
          <MapView
            lat={myLocation.lat}
            lng={myLocation.lng}
            driverLocation={driverLocation}
            pickupLocation={{ coordinates: state?.pickupCoordinates }}
            dropLocation={{ coordinates: state?.dropCoordinates }}
          />
        </div>

        {/* Top card */}
        <div className="absolute top-8 left-12 right-4 z-20">

  {step === "OPTIONS" ? (
    <PickupDropCard />
  ) : (
    <RideHeader rideStatus={step} />
  )}

</div>
      
        {/* Bottom sheet */}
        <div className={`
          absolute bottom-0 left-0 right-0 z-10
          bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-t-3xl
           
         
           
          
        `}>
          <div className="flex flex-col h-full px-1 pt-4 pb-4 text-white overflow-hidden">
            <StepContent />
          </div>
        </div>

      </div>

    </div>
  );
}