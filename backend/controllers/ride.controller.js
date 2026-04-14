import { createRideService,
         acceptRideService,
         updateRideStatusService,
         getLiveRideLocationService,
         getNearbyRidesService,

        } from "../services/ride.service.js";
import rideModel from "../models/ride.model.js";

export const createRide = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      pickupLocation,
      dropLocation,
      vehicleType,
    } = req.body;

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
    return res.status(500).json({
      message: "Failed to create ride",
    });
  }
};


export const acceptRide = async (req, res) => {
  try {
    const driverId = req.user._id;

    const ride = await acceptRideService(driverId);

    return res.status(200).json({
      message: "Ride accepted successfully",
      ride,
    });

  } catch (error) {

    if (error.message === "NO_PENDING_REQUEST") {
      return res.status(400).json({
        message: "No active ride request for this driver",
      });
    }

    if (error.message === "RIDE_ALREADY_ASSIGNED") {
      return res.status(409).json({
        message: "Ride already assigned to another driver",
      });
    }

    return res.status(500).json({
      message: "Failed to accept ride",
      error: error.message,
    });
  }
};



export const updateRideStatus = async (req, res) => {
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
      message: "Ride status updated successfully",
      ride,
    });

    } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export const getRideStatus = async (req, res) => {
    try {
        const ride = await rideModel.findById(req.params.rideId);
        if(!ride) return res.status(404).json({ message: "Ride not found" });
        return res.status(200).json({ status: ride.status, ride });
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getLiveRideLocation = async(req, res)=> {
    try {
        const {id: rideId} = req.params;
        const riderId = req.user._id;

        const data = await getLiveRideLocationService(rideId, riderId);

        return res.status(200).json(data);
        
    
    } catch (error) {
        return res.status(400).json({ message: error.message });

    }

}

export const getNearbyRides = async (req, res) => {
    try {
        const {lng, lat} = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: "Longitude and Latitude are required" });
        }

        const rides = await getNearbyRidesService(
            Number(lng),
            Number(lat)
        );

        return res.status(200).json({
            count: rides.length,
            rides,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};