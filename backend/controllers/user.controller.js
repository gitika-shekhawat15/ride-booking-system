import userModel from "../models/user.model.js";
import { registerUserService, loginUserService } from "../services/user.service.js";

export const registerUser = async (req, res) => {
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
        res.status(500).json({ 
            message: "Something went wrong",
            error: error.message
        });
    }
}

export const loginUser = async (req, res) => {
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
        if (error.message === "Invalid credentials") {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
        
    }
}


export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user,
            
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message,
        })
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
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};