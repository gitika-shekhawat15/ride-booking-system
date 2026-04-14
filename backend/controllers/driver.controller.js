import { registerDriverService, updateDriverLocationService, goOnlineService } from "../services/driver.service.js";
import driverProfile from "../models/driver.model.js";
import userModel from "../models/user.model.js";

export const registerDriver = async(req, res) => {
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
        res.status(500).json({ message: err.message });
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // ✅ vehicle details bhi fetch karo
        const driver = await driverProfile.findOne({ userId }).select("-__v");

        res.status(200).json({
            message: "Driver profile fetched successfully",
            user,
            driver, 
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
}
export const updateProfile = async (req, res) => {
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
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};

export const goOffline = async (req, res) => {
    try {
        const driverId = req.user._id;
        await driverProfile.findOneAndUpdate(
            { userId: driverId },
            { isAvailable: false }
        );
        return res.status(200).json({ message: "Driver is now OFFLINE" });
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateDriverLocation = async(req, res) => {
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
    return res.status(400).json({
      message: error.message,
    });
  }
};
    

export const goOnline = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { coordinates } = req.body; 

    const driver = await goOnlineService(driverId, coordinates);

    return res.status(200).json({
      message: "Driver is now ONLINE",
      driver,
    });

  } catch (error) {
    if (error.message === "DRIVER_NOT_FOUND") {
      return res.status(404).json({ message: "Driver not found" });
    }

    return res.status(500).json({
      message: "Failed to go online",
      error: error.message,
    });
  }
};

