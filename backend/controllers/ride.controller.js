import { createRideService,
         acceptRideService,
         updateRideStatusService,
         getLiveRideLocationService,
         getNearbyRidesService,

        } from "../services/ride.service.js";
import rideModel from "../models/ride.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const createRide = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      pickupLocation,
      dropLocation,
      vehicleType,
    } = req.body;

     if (!pickupLocation || !dropLocation) {
      return next(new AppError("Pickup and drop required", 400));
    }
    const ride = await createRideService(
      userId,
      pickupLocation,
      dropLocation,
      vehicleType
    );

    return res.status(201).json({
      message: "Ride created successfully",
      ride,
    });

  } catch (error) {
    next(error);
  }
};


export const acceptRide = async (req, res, next) => {
  try {
    const driverId = req.user._id;
    const {rideId} = req.body;
    if (!rideId) {
      return next(new AppError("rideId is required", 400));
  }

    const ride = await acceptRideService(driverId, rideId);

    return res.status(200).json({
      message: "Ride accepted successfully",
      ride,
    });

  } catch (error) {
    next(error);

  }
};



export const updateRideStatus = async (req, res, next) => {
    try {
        const {rideId } = req.params;
        const {status} = req.body;

        const ride = await updateRideStatusService({
        rideId,
        newStatus: status,
        userId: req.user._id,
        userRole: req.user.role
    });

   return res.status(200).json({
      success: true,
      message: "Ride status updated successfully",
      ride,
    });

    } catch (error) {
    next(error);
  }
}

export const getRideStatus = async (req, res, next) => {

if (!mongoose.Types.ObjectId.isValid(req.params.rideId)) {
  return next(new AppError("Invalid ride ID", 400));
}
  try {
    const ride = await rideModel.findById(req.params.rideId);

    if (!ride) {
      return next(new AppError("Ride not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Ride status fetched",
      status: ride.status,
      ride,
    });

  } catch (error) {
    next(error);
  }
};

export const getLiveRideLocation = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const riderId = req.user._id;

    const data = await getLiveRideLocationService(rideId, riderId);

    res.status(200).json({
      success: true,
      message: "Live location fetched",
      ...data,
    });

  } catch (error) {
    next(error);
  }
};

export const getNearbyRides = async (req, res, next) => {
    try {
        const {lng, lat} = req.query;

        if (!lng || !lat) {
           return next(new AppError("Longitude and Latitude are required", 400));
        }

        const rides = await getNearbyRidesService(
            Number(lng),
            Number(lat)
        );

         res.status(200).json({
          success: true,
          message: "Nearby rides fetched",
          count: rides.length,
          rides,
        });
    } catch (error) {
        next(error);
    }

};