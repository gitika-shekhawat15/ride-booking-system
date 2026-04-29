import driverProfile from "../models/driver.model.js";
import rideModel from "../models/ride.model.js";
import {dispatchRide, resolveDriverAcceptance, pendingRequests} from "./dispatch.service.js";
import { io } from "../server.js"; 
import { calculateFare } from "./dispatch.service.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const createRideService = async (
  userId,
  pickupLocation,
  dropLocation,
  vehicleType
) => {

  const validVehicles = ["bike", "car", "auto"];

  if (!validVehicles.includes(vehicleType)) {
      throw new AppError("Invalid vehicle type", 400);

  }
    const fare = calculateFare(
    pickupLocation.coordinates,
    dropLocation.coordinates,
    vehicleType
  );

  const ride = await rideModel.create({
    rider: userId,
    pickupLocation,
    dropLocation,
    vehicleType,
    status: "REQUESTED",
    driver: null,
    fare,
  });

  try {
    dispatchRide(ride._id);
  } catch (err) {
    console.log("Dispatch error:", err);
  }

  return ride;
};

export const acceptRideService = async (driverId, rideId) => {
  if (!mongoose.Types.ObjectId.isValid(rideId)) {
    throw new AppError("Invalid ride ID", 400);
  }

  // 1. Driver check
  const driver = await driverProfile
    .findOne({ userId: driverId })
    .populate("userId", "fullname");
  if (!driver) throw new AppError("Driver not found", 404);
  if (!driver.isAvailable) throw new AppError("Driver is offline", 400);
  if (driver.activeRideId) throw new AppError("Driver already on a ride", 400);

  // 2. Pending check
  const pending = pendingRequests.get(driverId.toString());
  if (!pending || pending.rideId.toString() !== rideId.toString()) {
    throw new AppError("Ride request expired", 400);
  }

  // 3. Resolve acceptance
  const ride = await resolveDriverAcceptance(driverId.toString(), rideId);

  if (!ride) {
    const existingRide = await rideModel.findById(rideId);
    if (!existingRide) throw new AppError("Ride not found", 404);
    if (existingRide.status === "CANCELLED") throw new AppError("Ride was cancelled", 400);
    if (existingRide.status === "ASSIGNED") throw new AppError("Ride already assigned", 409);
    throw new AppError("Ride not available", 400);
  }

  // 4. Emit to rider
  io.to(ride.rider.toString()).emit("ride:status", {
    status: "ASSIGNED",
    rideId: ride._id,
    driver: {
      name: driver?.userId?.fullname
        ? `${driver.userId.fullname.firstname} ${driver.userId.fullname.lastname || ""}`
        : "Driver",
      photo: driver?.photo || "https://i.pravatar.cc/100",
      vehicle: driver?.vehicleType,
      rating: driver?.rating || "4.9",
      vehicleNumber: driver?.vehicleNumber || "—",
    },
  });

  return ride;
};


 export const updateRideStatusService = async ({
    rideId,
    newStatus,
    userId,
    userRole
}) => {


if (!mongoose.Types.ObjectId.isValid(rideId)) {
 throw new AppError("Invalid ride ID", 400);
}
  


    const ride = await rideModel.findById(rideId);
    if(!ride) {
        throw new AppError("Ride not found", 404);
    }

    const currentStatus = ride.status;

    //Allow Transitions
    const allowedTransitions = {
        REQUESTED: ["ASSIGNED", "CANCELLED"],
        ASSIGNED: ["ARRIVED", "CANCELLED"],
        ARRIVED: ["STARTED", "CANCELLED"],
        STARTED: ["COMPLETED"],
    };

    //Transiton validation
    const allowedNext = allowedTransitions[currentStatus] || [];
    if(!allowedNext.includes(newStatus)) {
      throw new AppError(
      `Invalid transition from ${currentStatus} to ${newStatus}`,
      400
    );    }

    // Role-based validation
     if (newStatus === "ARRIVED" && userRole !== "driver") {
    throw new AppError("Only driver can perform this action", 403);
  }

 if (newStatus === "STARTED" && userRole !== "driver") {
    throw new AppError("Only driver can start the ride",403);
  }

  if (newStatus === "COMPLETED" && userRole !== "driver") {
    throw new AppError("Only driver can complete the ride", 403);
  }


  if (newStatus === "CANCELLED") {
    const isRider = ride.rider.toString() === userId.toString();
    const isDriver = ride.driver?.toString() === userId.toString();

    if (!isRider && !isDriver) {
      throw new AppError("Not authorized to cancel this ride",403);
    }
  }

  // Update status
  ride.status = newStatus;
  await ride.save();
  
  const driverData = await driverProfile.findOne({ userId: ride.driver })
    .populate("userId", "fullname");

  io.to(ride.rider.toString()).emit("ride:status", {
   status: newStatus,
    rideId: ride._id,
   
  });

  if(newStatus === "COMPLETED" || newStatus === "CANCELLED") {
    await driverProfile.findOneAndUpdate(
        { userId: ride.driver },
        { isAvailable: true, activeRideId: null }
    );
}

  return ride;
};


export const getLiveRideLocationService = async(rideId, riderId) => {

if (!mongoose.Types.ObjectId.isValid(rideId)) {
  throw new AppError("Invalid ride ID", 400);
}
    const ride = await rideModel.findById(rideId);

    if (!ride) {
        throw new AppError("Ride not found", 404);
    }

    // rider ownership check
    if(ride.rider.toString() !== riderId.toString()){
      throw new AppError("Ride not found", 404);
    }
     //  fetch driver profile using userId
  const driver = await driverProfile.findOne({
    userId: ride.driver,
  });
  

    return {
        status: ride.status,
        driverLocation: driver ? driver.location : null,
    };
}

export const getNearbyRidesService = async (lng, lat) => {
   if (!lng || !lat) {
    throw new AppError("Longitude and latitude required", 400);
  }
    return await rideModel.find({
        status: "REQUESTED",
        driver: null,
        pickupLocation: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                $maxDistance: 5000,
            },
        },
    }).limit(10);
}