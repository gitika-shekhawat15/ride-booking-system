import socket from "../../socket";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OfflineMode from "../../components/driver/OfflineMode";
import OnlineToggle from "../../components/driver/OnlineToggle";
import SearchingRide from "../../components/driver/SearchingRide";
import MapView from "../../components/MapView";
import ImageBackground from "../../components/ImageBackground";
import Header from "../../components/Header";
import RideRequestPopup from "../../components/driver/RideRequestPopUp";
import ToArriveSheet from "../../components/driver/ToArriveSheet";
import StartTripSheet from "../../components/driver/StartTripSheet";
import CompleteTrip from "../../components/driver/CompleteTrip";
import {
  goOnlineService,
  goOfflineService,
  updateLocationService,
} from "../../services/driver.service";
import {
  acceptRideService,
  updateRideStatusService,
} from "../../services/ride.service";

export default function DriverHome() {
  const navigate = useNavigate();
  const [driverStatus, setDriverStatus] = useState("OFFLINE");
  const [activeRide, setActiveRide] = useState(null);
  const [myLocation, setMyLocation] = useState({ lat: null, lng: null });
  const token = localStorage.getItem("token");
  const isOffline = driverStatus === "OFFLINE";

  const handleToggle = async () => {
    if (driverStatus === "OFFLINE") {
      setDriverStatus("SEARCHING");
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const driverId = decoded._id;
        await goOnlineService(driverId, [longitude, latitude]);
        socket.emit("join", { userId: driverId, role: "driver" });
      });
    } else {
      setDriverStatus("OFFLINE");
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const driverId = decoded._id;
      socket.emit("driver:offline", { userId: driverId });
      await goOfflineService(token);
    }
  };

  useEffect(() => {
    if (driverStatus === "OFFLINE") return;
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        await updateLocationService(longitude, latitude, token);
        if (activeRide) {
          socket.emit("driver:location", {
  rideId: activeRide?.rideId,
  location: {
    lat: latitude,
    lng: longitude
  }
});
        }
      },
      (err) => console.log("Location error:", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [driverStatus, activeRide]);

  useEffect(() => {
    socket.on("ride:request", (rideData) => {
      setActiveRide(rideData);
      setDriverStatus("RIDE_REQUEST");
    });
    return () => socket.off("ride:request");
  }, []);

  const StatusCard = () => {
    const showToggle = driverStatus === "OFFLINE" || driverStatus === "SEARCHING";
    return (
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2 md:m-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isOffline ? "bg-white/30" : "bg-orange-500"}`} />
          <p className="text-white/70">
            {driverStatus === "OFFLINE" ? "You are offline"
              : driverStatus === "SEARCHING" ? "Looking for rides..."
              : driverStatus === "RIDE_REQUEST" ? "New ride request"
              : driverStatus === "TO_ARRIVE" ? "Heading to pickup"
              : driverStatus === "READY_TO_START" ? "At pickup location"
              : driverStatus === "TO_END" ? "Trip in progress"
              : "Driver mode"}
          </p>
        </div>.
        {showToggle && (
          <OnlineToggle isOnline={driverStatus !== "OFFLINE"} onToggle={handleToggle} />
        )}
      </div>
    );
  };

  const StepContent = () => (
    <>
      {driverStatus === "OFFLINE" && <OfflineMode onGoOnline={handleToggle} />}
      {driverStatus === "SEARCHING" && <SearchingRide />}
      {driverStatus === "RIDE_REQUEST" && activeRide && (
        <RideRequestPopup
          ride={activeRide}
          onAccept={async () => {
  try {
    const id = activeRide?.rideId || activeRide?._id;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const driverId = decoded._id;

    socket.emit("ride:accept", {
      driverId,
      rideId: id
    });

    socket.emit("ride:join", { rideId: id });

    await acceptRideService(id);

    setDriverStatus("TO_ARRIVE");

  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
    setDriverStatus("SEARCHING");
  }
}}
          onReject={() => { setActiveRide(null); setDriverStatus("SEARCHING"); }}
        />
      )}
      {driverStatus === "TO_ARRIVE" && activeRide && (
        <ToArriveSheet
          ride={activeRide}
          onArrived={async () => {
            const id = activeRide?.rideId || activeRide?._id;
            await updateRideStatusService(id, "ARRIVED");
            setDriverStatus("READY_TO_START");
          }}
        />
      )}
      {driverStatus === "READY_TO_START" && activeRide && (
        <StartTripSheet
          ride={activeRide}
          onStartTrip={async () => {
            const id = activeRide?.rideId || activeRide?._id;
            await updateRideStatusService(id, "STARTED");
            setDriverStatus("TO_END");
          }}
        />
      )}
      {driverStatus === "TO_END" && activeRide && (
        <CompleteTrip
          ride={activeRide}
          onEndTrip={async () => {
            const id = activeRide?.rideId || activeRide?._id;
            await updateRideStatusService(id, "COMPLETED");
            setActiveRide(null);
            setDriverStatus("SEARCHING");
          }}
        />
      )}
    </>
  );

  // ── OFFLINE UI — center card + image background ──
  if (isOffline) {
    return (
      <div className="h-screen w-full overflow-hidden relative flex items-center justify-center px-4">
        <ImageBackground />

        {/* Header */}
        <Header profilePath="/driver/me" />

        {/* Center Card */}
        <div className="w-full max-w-[360px] md:max-w-md bg-white/10 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 rounded-3xl relative z-10 mt-8">
          <div className="px-4 md:pt-4 mt-8 md:mt-0">
            <StatusCard />
          </div>
          <StepContent />
        </div>
      </div>
    );
  }

  // ── ONLINE UI — map + sidebar/bottom sheet ──
  return (
    <div className="h-screen w-full overflow-hidden">

      {/* LAPTOP */}
      <div className="hidden md:flex">
        <div className="absolute inset-0 z-0">
          <MapView lat={myLocation.lat} lng={myLocation.lng} />
        </div>
        <div className="w-[380px] flex flex-col absolute left-20 top-20 bg-black/40 backdrop-blur-lg border border-white/10 z-10 rounded-3xl">
          <div className="px-4 py-3 border-b border-white/20">
            <StatusCard />
          </div>
          <div className="flex-1 overflow-y-auto text-white">
            <StepContent />
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden h-full relative">
        <div className="absolute inset-0 z-0">
          <MapView lat={myLocation.lat} lng={myLocation.lng} />
        </div>
        <div className="absolute top-4 left-4 right-4 z-20 ">
          <StatusCard />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-xl border-t border-white/20 rounded-t-3xl">
          <div className="flex flex-col h-full px-1 pt-4 pb-4 text-white overflow-hidden">
            <StepContent />
          </div>
        </div>
      </div>

    </div>
  );
}