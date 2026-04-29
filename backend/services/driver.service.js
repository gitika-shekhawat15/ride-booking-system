import driverProfile from "../models/driver.model.js";
import userModel from "../models/user.model.js";
import rideModel from "../models/ride.model.js";
import AppError from "../utils/AppError.js";


export const registerDriverService = async(userId, driverData) => {
     const existingDriver = await driverProfile.findOne({ userId });
    if (existingDriver) {
        throw new AppError("Driver profile already exists", 400);
    }
    const driver = await driverProfile.create({
        userId,
        ...driverData

    })

       await userModel.findByIdAndUpdate(userId, {
        role: "driver"
    });

    return driver;

};

export const updateDriverLocationService = async (userId, lng, lat) => {

    // fetch driver profile
    const driver = await driverProfile.findOne({ userId });

    if(!driver){
        throw new AppError("Driver not found", 404);
    }

    // overwrite latest location
    driver.location = {
        type: "Point",
        coordinates: [ lng, lat ],
    };

    await driver.save();
    return driver.location;
}


export const goOnlineService = async (driverUserId, coordinates) => {

  const driver = await driverProfile.findOne({ userId: driverUserId });

  if (!driver) throw new AppError("Driver not found", 404);

  //  stale ride cleanup
  if (driver.activeRideId) {

    const ride = await rideModel.findById(driver.activeRideId);

    if (!ride || ride.status === "COMPLETED" || ride.status === "CANCELLED") {
      driver.activeRideId = null;
      driver.isAvailable = true;
    } 
    else {
      driver.isAvailable = false;
      return driver;
    }
  } 
  else {
    driver.isAvailable = true;
  }

  if (coordinates) {
    driver.location = {
      type: "Point",
      coordinates
    };
  }

  await driver.save();

  return driver;
};