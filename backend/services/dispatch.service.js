import { io , onlineDrivers} from "../server.js";
import driverProfile from "../models/driver.model.js";
import rideModel from "../models/ride.model.js";
import userModel from "../models/user.model.js";


const DISPATCH_TIMEOUT = 10000;
const RETRY_TIMEOUT = 15000;

const pendingRequests = new Map();

export const dispatchRide = async (rideId, attempt = 1, offeredDrivers = new Set()) => {
  let driversFound = false;

  try {
    const ride = await rideModel.findById(rideId);
    if (!ride || ride.status !== "REQUESTED") return;

    const nearbyDrivers = await driverProfile.find({
      isAvailable: true,
      activeRideId: null,
      vehicleType: ride.vehicleType,
      location: {
        $near: {
          $geometry: ride.pickupLocation,
          $maxDistance: 5000,
        },
      },
    }).limit(10);

    const onlineNearbyDrivers = nearbyDrivers.filter(d =>
      onlineDrivers.has(d.userId.toString())
    );

    // CASE 1: NO DRIVERS
    if (onlineNearbyDrivers.length === 0) {

      if (attempt >= 3) {
        io.to(ride.rider.toString()).emit("ride:search_failed", {
          reason: "NO_DRIVERS"
        });
      
        await rideModel.findByIdAndUpdate(rideId, {
      status: "CANCELLED"
    });

        return;
      }

      setTimeout(() => dispatchRide(rideId, attempt + 1, offeredDrivers), RETRY_TIMEOUT);
      return;
    }

    driversFound = true;

    // STEP 2: OFFER
    for (const driverProfileDoc of onlineNearbyDrivers) {
      const driverId = driverProfileDoc.userId.toString();

      if (offeredDrivers.has(driverId)) continue;

      offeredDrivers.add(driverId);

      const accepted = await offerRideToDriver(driverId, rideId, ride);

      if (accepted) return;
    }

    // CASE 2: DRIVERS BUT NO ACCEPT
    if (driversFound && attempt >= 3) {
      io.to(ride.rider.toString()).emit("ride:search_failed", {
        reason: "DRIVER_UNAVAILABLE"
      });

       await rideModel.findByIdAndUpdate(rideId, {
    status: "CANCELLED"
       });
      return;
    }

    // retry
    setTimeout(() => dispatchRide(rideId, attempt + 1, offeredDrivers), RETRY_TIMEOUT);

  } catch (err) {
    console.error("Dispatch failed:", err.message);
  }
};



const getAddress = async (coordinates) => {
  try {
    const [lng, lat] = coordinates;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "UberCloneApp (gitikashekhwat15@gmail.com)" 
        }
      }
    );

    const data = await res.json();
  if (!data || !data.display_name) {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // fallback coords
}
return data.display_name;


  } catch (err) {
    console.log("Address fetch failed:", err.message);
    return "Unknown Location";
  }
};

const offerRideToDriver = async (driverId, rideId, ride) => {
    const rider = await userModel.findById(ride.rider).select("fullname email");
    const [pickupLng, pickupLat] = ride.pickupLocation.coordinates;
    const [dropLng, dropLat] = ride.dropLocation.coordinates;
    const pickupAddress = await getAddress([pickupLng, pickupLat]);
    const dropAddress = await getAddress([dropLng, dropLat]);

    return new Promise((resolve) => {
        io.to(driverId).emit("ride:request", {
            rideId: ride._id,
            pickupLocation: ride.pickupLocation,
            dropLocation: ride.dropLocation,
            riderName: rider?.fullname?.firstname + " " + rider?.fullname?.lastname,
            riderPhoto: "https://i.pravatar.cc/150?img=12",
            rating: 4.8,
            pickup: pickupAddress,
            drop: dropAddress,
            fare: 120,
        });

        const timeout = setTimeout(() => {
            pendingRequests.delete(driverId);
            resolve(false);
        }, DISPATCH_TIMEOUT);

        pendingRequests.set(driverId, { rideId, resolve, timeout });
    });
};

export const resolveDriverAcceptance =  async (driverId, rideId) => {
  const pending = pendingRequests.get(driverId);
if (!pending || pending.rideId !== rideId) return false;  

  const ride = await rideModel.findOneAndUpdate(
    { _id: rideId, status: "REQUESTED" },
    { status: "ACCEPTED", driver: driverId },
    { new: true }
  );

  if (!ride) {
  clearTimeout(pending.timeout);
  pendingRequests.delete(driverId);
  return false;
}
 await driverProfile.findOneAndUpdate(
    { userId: driverId },
    {
      isAvailable: false,
      activeRideId: rideId
    }
  );
  

  clearTimeout(pending.timeout);
  pending.resolve(true);
  pendingRequests.delete(driverId);

  return true;
};