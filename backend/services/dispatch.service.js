import { io, onlineDrivers } from "../server.js";
import driverProfile from "../models/driver.model.js";
import rideModel from "../models/ride.model.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const DISPATCH_TIMEOUT = 10000;
const RETRY_TIMEOUT = 15000;

export const pendingRequests = new Map();
const activeDispatches = new Set();

export const calculateFare = (pickupCoords, dropCoords, vehicleType) => {
  const [lng1, lat1] = pickupCoords;
  const [lng2, lat2] = dropCoords;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const ratePerKm = { bike: 8, auto: 12, car: 18 };
  const baseFare = { bike: 20, auto: 30, car: 50 };
  const rate = ratePerKm[vehicleType] || 10;
  const base = baseFare[vehicleType] || 20;
  return Math.round(Math.max(base, base + distKm * rate));
};

export const dispatchRide = async (rideId, attempt = 1, offeredDrivers = new Set()) => {
  const rideKey = rideId.toString();

  if (attempt === 1) {
    if (activeDispatches.has(rideKey)) {
      console.log("Dispatch already running:", rideKey);
      return;
    }
    activeDispatches.add(rideKey);
  }

  try {
    const ride = await rideModel.findById(rideId);
    if (!ride || ride.status !== "REQUESTED") {
      activeDispatches.delete(rideKey);
      return;
    }

    const [pickupLng, pickupLat] = ride.pickupLocation.coordinates;
    const [dropLng, dropLat] = ride.dropLocation.coordinates;
    const pickupAddress = await getAddress([pickupLng, pickupLat]);
    const dropAddress = await getAddress([dropLng, dropLat]);

    const nearbyDrivers = await driverProfile.find({
      isAvailable: true,
      activeRideId: null,
      vehicleType: ride.vehicleType,
      location: {
        $near: {
          $geometry: ride.pickupLocation,
          $maxDistance: 5000 * attempt,
        },
      },
    }).limit(10);

    const onlineNearbyDrivers = nearbyDrivers.filter((d) =>
      onlineDrivers.has(d.userId.toString())
    );

    console.log(`Attempt ${attempt} — Online nearby drivers:`, onlineNearbyDrivers.length);

    // NO DRIVERS
    if (onlineNearbyDrivers.length === 0) {
      if (attempt >= 3) {
        const currentRide = await rideModel.findById(rideId);
        if (currentRide?.status !== "REQUESTED") {
          activeDispatches.delete(rideKey);
          return;
        }
        await rideModel.findByIdAndUpdate(rideId, { status: "CANCELLED" });
        io.to(ride.rider.toString()).emit("ride:search_failed", { reason: "NO_DRIVERS" });
        activeDispatches.delete(rideKey);
        return;
      }
      setTimeout(() => dispatchRide(rideId, attempt + 1, offeredDrivers), RETRY_TIMEOUT);
      return;
    }

    // SEQUENTIAL OFFER 
    for (const driverProfileDoc of onlineNearbyDrivers) {
      const driverId = driverProfileDoc.userId.toString();

      if (offeredDrivers.has(driverId)) {
        console.log("SKIP — already offered:", driverId);
        continue;
      }

      offeredDrivers.add(driverId);
      console.log("OFFERING to:", driverId);

      const accepted = await offerRideToDriver(
        driverId, rideId, ride, pickupAddress, dropAddress
      );

      console.log("RESULT:", accepted, "— driver:", driverId);

      if (accepted) {
        activeDispatches.delete(rideKey);
        return;
      }

      const currentRide = await rideModel.findById(rideId);
      if (!currentRide || currentRide.status !== "REQUESTED") {
        console.log("Ride no longer REQUESTED — stopping dispatch");
        activeDispatches.delete(rideKey);
        return;
      }
    }

    // DRIVERS BUT NO ACCEPT
    if (attempt >= 3) {
      const currentRide = await rideModel.findById(rideId);
      if (currentRide?.status !== "REQUESTED") {
        activeDispatches.delete(rideKey);
        return;
      }
      await rideModel.findByIdAndUpdate(rideId, { status: "CANCELLED" });
      io.to(ride.rider.toString()).emit("ride:search_failed", { reason: "DRIVER_UNAVAILABLE" });
      activeDispatches.delete(rideKey);
      return;
    }

    setTimeout(() => dispatchRide(rideId, attempt + 1, offeredDrivers), RETRY_TIMEOUT);

  } catch (err) {
    console.error("Dispatch failed:", err.message);
    activeDispatches.delete(rideKey);
  }
};

const getAddress = async (coordinates) => {
  try {
    const [lng, lat] = coordinates;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "Ride-Sharing-App (gitikashekhwat15@gmail.com)" } }
    );
    const data = await res.json();
    if (!data || !data.display_name) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    return data.display_name;
  } catch (err) {
    console.log("Address fetch failed:", err.message);
    return "Unknown Location";
  }
};

const offerRideToDriver = async (driverId, rideId, ride, pickupAddress, dropAddress) => {
  const rider = await userModel.findById(ride.rider).select("fullname email");

  return new Promise((resolve) => {
    let resolved = false;

    io.to(driverId).emit("ride:request", {
      rideId: ride._id,
      pickupLocation: ride.pickupLocation,
      dropLocation: ride.dropLocation,
      riderName:
        rider?.fullname?.firstname + " " + rider?.fullname?.lastname,
      riderPhoto: "https://i.pravatar.cc/150?img=12",
      rating: 4.8,
      pickup: pickupAddress,
      drop: dropAddress,
      fare: calculateFare(
        ride.pickupLocation.coordinates,
        ride.dropLocation.coordinates,
        ride.vehicleType
      ),
    });

    const timeout = setTimeout(() => {
      if (resolved) return;  
      pendingRequests.delete(driverId);
      io.to(driverId).emit("ride:timeout", { rideId });
      resolve(false);
    }, DISPATCH_TIMEOUT);

    pendingRequests.set(driverId, {
      rideId,
      resolve: (val) => {
        resolved = true;
        resolve(val);
      },
      timeout,
    });
  });
};

export const resolveDriverAcceptance = async (driverId, rideId) => {
  const pending = pendingRequests.get(driverId);
  if (!pending || pending.rideId.toString() !== rideId.toString()) return false;

   const ride = await rideModel.findOneAndUpdate(
    { _id: rideId, status: "REQUESTED" },
    { status: "ASSIGNED", driver: driverId },
  
    { new: true }
  );

 if (!ride) {
  clearTimeout(pending.timeout);
  pendingRequests.delete(driverId);
  pending.resolve(false);
  return false;
}

  await driverProfile.findOneAndUpdate(
    { userId: driverId },
    { isAvailable: false, activeRideId: rideId }
  );

  clearTimeout(pending.timeout);
  pending.resolve(true);
  pendingRequests.delete(driverId);
  

  return ride;
};