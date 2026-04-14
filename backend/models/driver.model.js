import user from "./user.model.js";
import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },

  vehicleType: {
    type: String,
    enum: ["car", "bike", "auto"], 
    required: true
  },

  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  licenseNumber: {
    type: String,
    required: true,
    trim: true
  },

  vehicleModel: {
    type: String,
    trim: true
  },

  experience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  isAvailable: {
    type: Boolean,
    default: false
  },

  activeRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ride",
    default: null
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
     
    }
  }

}, { timestamps: true });

driverProfileSchema.index({ location: "2dsphere" }, { sparse: true });

    
const driverProfile = mongoose.model("driverProfile", driverProfileSchema);

export default driverProfile;