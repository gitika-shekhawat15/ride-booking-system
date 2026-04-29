import socket from "../../socket";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { goOnlineService, goOfflineService, updateLocationService } from "../../services/driver.service";
import { acceptRideService, updateRideStatusService } from "../../services/ride.service";

const StatusCard = ({ driverStatus, isOffline, onToggle }) => {
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
      </div>
      {showToggle && (
        <OnlineToggle isOnline={driverStatus !== "OFFLINE"} onToggle={onToggle} />
      )}
    </div>
  );
};

const StepContent = ({
  driverStatus, activeRide,
  onAccept, onReject,
  onArrived, onStartTrip, onEndTrip,
  onGoOnline
}) => (
  <>
    {driverStatus === "OFFLINE" && <OfflineMode onGoOnline={onGoOnline} />}
    {driverStatus === "SEARCHING" && <SearchingRide />}
    {driverStatus === "RIDE_REQUEST" && activeRide && (
      <RideRequestPopup
        ride={activeRide}
        onAccept={onAccept}   
        onReject={onReject} 
      />
    )}
    {driverStatus === "TO_ARRIVE" && activeRide && (
      <ToArriveSheet ride={activeRide} onArrived={onArrived} />
    )}
    {driverStatus === "READY_TO_START" && activeRide && (
      <StartTripSheet ride={activeRide} onStartTrip={onStartTrip} />
    )}
    {driverStatus === "TO_END" && activeRide && (
      <CompleteTrip ride={activeRide} onEndTrip={onEndTrip} />
    )}
  </>
);

export default function DriverHome() {
  const navigate = useNavigate();
  const [driverStatus, setDriverStatus] = useState("OFFLINE");
  const [activeRide, setActiveRide] = useState(null);
  const [myLocation, setMyLocation] = useState({ lat: null, lng: null });
  const myLocationRef = useRef({ lat: null, lng: null });
  const lastMapUpdate = useRef(0);
  const lastDBUpdate = useRef(0);
  const token = localStorage.getItem("token");
  const isOffline = driverStatus === "OFFLINE";

  // useCallback — stable functions
  const handleAccept = useCallback(async () => {
    try {
      const id = activeRide?.rideId || activeRide?._id;
      await acceptRideService(id);
      socket.emit("ride:join", { rideId: id });
      setDriverStatus("TO_ARRIVE");
    } catch (err) {
      setDriverStatus("SEARCHING");
    }
  }, [activeRide]);

 const handleReject = useCallback(() => {
  setActiveRide(null);
  setDriverStatus("SEARCHING");
}, []);

  const handleArrived = useCallback(async () => {
    const id = activeRide?.rideId || activeRide?._id;
    await updateRideStatusService(id, "ARRIVED");
    setDriverStatus("READY_TO_START");
  }, [activeRide]);

  const handleStartTrip = useCallback(async () => {
    const id = activeRide?.rideId || activeRide?._id;
    await updateRideStatusService(id, "STARTED");
    setDriverStatus("TO_END");
  }, [activeRide]);

  const handleEndTrip = useCallback(async () => {
    try {
      const id = activeRide?.rideId || activeRide?._id;
      await updateRideStatusService(id, "COMPLETED");
      setActiveRide(null);
      setDriverStatus("SEARCHING");
    } catch (err) {
    }
  }, [activeRide]);

  const handleToggle = async () => {
    if (driverStatus === "OFFLINE") {
      setDriverStatus("SEARCHING");
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
if (!token) return;

let decoded;
try {
  decoded = JSON.parse(atob(token.split(".")[1]));
} catch {
  return;
}

        const driverId = decoded._id;
       try {
  await goOnlineService(driverId, [longitude, latitude]);
  socket.emit("join", { userId: driverId, role: "driver" });
} catch (err) {
  setDriverStatus("OFFLINE");
}
      });
    } else {
      setDriverStatus("OFFLINE");
if (!token) return;

let decoded;
try {
  decoded = JSON.parse(atob(token.split(".")[1]));
} catch {
  return;
}

const driverId = decoded._id;
      socket.emit("driver:offline", { userId: driverId });
      await goOfflineService();
    }
  };


  useEffect(() => {
    if (driverStatus === "OFFLINE") return;
    
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        myLocationRef.current = { lat: latitude, lng: longitude };
        if (Date.now() - lastDBUpdate.current > 10000) {
        await updateLocationService(longitude, latitude);
        lastDBUpdate.current = Date.now();
        }
        if (activeRide) {
         const id = activeRide?.rideId || activeRide?._id;

socket.emit("driver:location", {
  rideId: id,
  location: { lat: latitude, lng: longitude }
});
        }
        if (Date.now() - lastMapUpdate.current > 5000) {
          setMyLocation({ lat: latitude, lng: longitude });
          lastMapUpdate.current = Date.now();
        }
      },
            (err) => console.log("Location error:", err),

      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [driverStatus, activeRide]);

  useEffect(() => {
    socket.on("ride:request", (rideData) => {
      setActiveRide((prev) => {
        if (prev?.rideId === rideData.rideId) return prev;
        return rideData;
      });
      setDriverStatus((prev) => {
        if (prev === "RIDE_REQUEST") return prev;
        return "RIDE_REQUEST";
      });
    });

    //  ride:timeout handler
    socket.on("ride:timeout", () => {
    setDriverStatus((current) => {
        if (current === "RIDE_REQUEST") {
            setActiveRide(null);
            return "SEARCHING";
        }
        return current;
    });
});

    return () => {
      socket.off("ride:request");
      socket.off("ride:timeout");
    };
  }, []);
  useEffect(() => {
  if (driverStatus === "OFFLINE") return;

  const heartbeat = setInterval(() => {
    if (!token) return;

    let decoded;
    try {
      decoded = JSON.parse(atob(token.split(".")[1]));
    } catch {
      return;
    }

    socket.emit("heartbeat", { userId: decoded._id, role: "driver" });
  }, 30000);

  return () => clearInterval(heartbeat);
}, [driverStatus]);

  if (isOffline) {
    return (
      <div className="h-screen w-full overflow-hidden relative flex items-center justify-center px-4">
        <ImageBackground />
        <Header profilePath="/driver/me" />
        <div className="w-full max-w-[360px] md:max-w-md bg-white/10 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 rounded-3xl relative z-10 mt-8">
          <div className="px-4 md:pt-4 mt-8 md:mt-0">
            <StatusCard driverStatus={driverStatus} isOffline={isOffline} onToggle={handleToggle} />
          </div>
          <StepContent
            driverStatus={driverStatus}
            activeRide={activeRide}
            onAccept={handleAccept}
            onReject={handleReject}
            onArrived={handleArrived}
            onStartTrip={handleStartTrip}
            onEndTrip={handleEndTrip}
            onGoOnline={handleToggle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* LAPTOP */}
      <div className="hidden md:flex">
        <div className="absolute inset-0 z-0">
          <MapView lat={myLocation.lat} lng={myLocation.lng} />
        </div>
        <div className="w-[380px] flex flex-col absolute left-20 top-20 bg-black/40 backdrop-blur-lg border border-white/10 z-10 rounded-3xl">
          <div className="px-4 py-3 border-b border-white/20">
            <StatusCard driverStatus={driverStatus} isOffline={isOffline} onToggle={handleToggle} />
          </div>
          <div className="flex-1 overflow-y-auto text-white">
            <StepContent
              driverStatus={driverStatus}
              activeRide={activeRide}
              onAccept={handleAccept}
              onReject={handleReject}
              onArrived={handleArrived}
              onStartTrip={handleStartTrip}
              onEndTrip={handleEndTrip}
              onGoOnline={handleToggle}
            />
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden h-full relative">
        <div className="absolute inset-0 z-0">
          <MapView lat={myLocation.lat} lng={myLocation.lng} />
        </div>
        <div className="absolute top-4 left-4 right-4 z-20">
          <StatusCard driverStatus={driverStatus} isOffline={isOffline} onToggle={handleToggle} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-xl border-t border-white/20 rounded-t-3xl">
          <div className="flex flex-col h-full px-1 pt-4 pb-4 text-white overflow-hidden">
            <StepContent
              driverStatus={driverStatus}
              activeRide={activeRide}
              onAccept={handleAccept}
              onReject={handleReject}
              onArrived={handleArrived}
              onStartTrip={handleStartTrip}
              onEndTrip={handleEndTrip}
              onGoOnline={handleToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}