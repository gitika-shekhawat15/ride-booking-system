import driverProfile from "../models/driver.model.js";
import rideModel from "../models/ride.model.js";
import {dispatchRide, resolveDriverAcceptance } from "./dispatch.service.js";
import { io } from "../server.js"; 

export const createRideService = async (
  userId,
  pickupLocation,
  dropLocation,
  vehicleType
) => {

  const validVehicles = ["bike", "car", "auto"];

  if (!validVehicles.includes(vehicleType)) {
    throw new Error("Invalid vehicle type");
  }

  const ride = await rideModel.create({
    rider: userId,
    pickupLocation,
    dropLocation,
    vehicleType,
    status: "REQUESTED",
    driver: null,
  });

  try {
    dispatchRide(ride._id);
  } catch (err) {
    console.log("Dispatch error:", err);
  }

  return ride;
};

export const acceptRideService = async (driverId) => {

  resolveDriverAcceptance(driverId.toString());

  const ride = await rideModel.findOneAndUpdate(
    {
      status: "REQUESTED",
      driver: null,
    },
    {
      status: "ASSIGNED",
      driver: driverId,
    },
    { new: true }
  );

  if (!ride) {
    throw new Error("RIDE_ALREADY_ASSIGNED");
  }

const driver = await driverProfile
  .findOne({ userId: driverId })
  .populate("userId", "fullname");
  //  emit to rider
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
    }
  });


  await driverProfile.findOneAndUpdate(
    { userId: driverId },
    {
      isAvailable: false,
      activeRideId: ride._id,
    }
  );

  return ride;
};


 export const updateRideStatusService = async ({
    rideId,
    newStatus,
    userId,
    userRole
}) => {

    const ride = await rideModel.findById(rideId);
    if(!ride) {
        throw new Error("Ride not found");
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
        throw new Error(`Invalid transition from ${currentStatus} to ${newStatus}`);
    }

    // Role-based validation
     if (newStatus === "ARRIVED" && userRole !== "driver") {
    throw new Error("Only driver can mark the ride as arrived");
  }

 if (newStatus === "STARTED" && userRole !== "driver") {
    throw new Error("Only driver can start the ride");
  }

  if (newStatus === "COMPLETED" && userRole !== "driver") {
    throw new Error("Only driver can complete the ride");
  }


  if (newStatus === "CANCELLED") {
    const isRider = ride.rider.toString() === userId.toString();
    const isDriver = ride.driver?.toString() === userId.toString();

    if (!isRider && !isDriver) {
      throw new Error("Not authorized to cancel this ride");
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

    const ride = await rideModel.findById(rideId);

    if (!ride) {
        throw new Error("Ride not found!");
    }

    // rider ownership check
    if(ride.rider.toString() !== riderId.toString()){
        throw new Error("Not authorized to view this ride");

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