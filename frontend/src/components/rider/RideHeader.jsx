export default function RideHeader({ rideStatus }) {

  const statusMap = {
    SEARCHING: "Looking for drivers...",
    ACCEPTED: "Driver found",
    DRIVER_ARRIVING: "Driver arriving",
    TRIP_STARTED: "Trip in progress",
    TRIP_COMPLETED: "Trip completed",
  };

  const text = statusMap[rideStatus] || "Ride mode";

  return (
    <div className="
      bg-white/10 backdrop-blur-xl border border-white/10
      rounded-2xl px-3 py-2 flex items-center gap-2
    ">

      {/* Dot */}
      <div
        className={`w-2 h-2 rounded-full ${
          rideStatus === "SEARCHING"
            ? "bg-[#D6FF2F] animate-pulse"
            : rideStatus === "DRIVER_ARRIVING"
            ? "bg-[#D6FF2F]"
            : rideStatus === "TRIP_STARTED"
            ? "bg-[#D6FF2F]"
            : rideStatus === "TRIP_COMPLETED"
            ? "bg-white/40"
            : "bg-white/30"
        }`}
      />

      {/* Text */}
      <p className="text-white/70 text-xs">
        {text}
      </p>

    </div>
  );
}