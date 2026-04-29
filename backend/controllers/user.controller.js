import userModel from "../models/user.model.js";
import { registerUserService, loginUserService } from "../services/user.service.js";
import AppError from "../utils/AppError.js";

export const registerUser = async (req, res, next) => {
    try {
        const user = await registerUserService(req.body);
        const token = user.generateAuthToken(); 

        const userObj = user.toObject();
        delete userObj.password;
        
        res.status(201).json({
            message: "User register successfully",
            user : userObj,
            token 
        })
        
    } catch (error) {
        next(error);
    
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body
        
        const user = await loginUserService({email, password});
        const token = user.generateAuthToken()

        res.status(200).json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        })
        console.log("REQ BODY:", req.body);

        
    } catch (error) {
        next(error);
        
    }
}


export const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
        return next(new AppError("User not found", 404));
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user,
            
        })

    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
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