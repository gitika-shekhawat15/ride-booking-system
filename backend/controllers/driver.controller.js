import { registerDriverService, updateDriverLocationService, goOnlineService } from "../services/driver.service.js";
import driverProfile from "../models/driver.model.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const registerDriver = async(req, res,next) => {
    try {
        const userId = req.user._id;
        
        const driver = await registerDriverService(userId, req.body);
        
        const updatedUser = await userModel.findById(userId);
        const token = updatedUser.generateAuthToken();
        
        res.status(201).json({
            message: "Driver profile created",
            driver,
            token 
        });

    } catch(err) {
        next(err);
    }
}

export const getMyProfile = async (req, res,next) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).select("-password");
        if (!user) {
          return next(new AppError("User not found", 404));
        }

        const driver = await driverProfile.findOne({ userId }).select("-__v");
          if (!driver) {
          return next(new AppError("Driver profile not found", 404));
}
        res.status(200).json({
            message: "Driver profile fetched successfully",
            user,
            driver, 
        });

    } catch (error) {
      next(error);
    }
}
export const updateProfile = async (req, res,next) => {
  try {
    const allowedFields = ["fullname"];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    next(error);
  }
};

export const goOffline = async (req, res, next) => {
  try {
    const driverId = req.user._id;

    const driver = await driverProfile.findOneAndUpdate(
      { userId: driverId },
      { isAvailable: false },
      { new: true }
    );

    if (!driver) {
      return next(new AppError("Driver not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Driver is now OFFLINE",
      driver,
    });

  } catch (error) {
    next(error);
  }
};

export const updateDriverLocation = async(req, res, next) => {
  try {
    const { lat, lng } = req.body;

    //driver  identity from jwt
    const driverId = req.user._id;

    const location = await updateDriverLocationService(
      driverId,
      lat,
      lng
    );

    return res.status(200).json({
      message: "Driver location updated",
      location,
    });
  } catch (error) {
    next(error);
  }
};
    

export const goOnline = async (req, res, next) => {
  try {
    const driverId = req.user._id;
    const { coordinates } = req.body; 

    const driver = await goOnlineService(driverId, coordinates);

    res.status(200).json({
     success: true,
      message: "Driver is now ONLINE",
      driver,
      });

  } catch (error) {
    next(error);;
  }
};

