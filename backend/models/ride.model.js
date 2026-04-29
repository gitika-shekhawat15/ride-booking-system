import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
    default: null
  },
  vehicleType: {
    type: String,
    enum: ["bike", "auto", "car"],
    required: true
},
  fare: {
  type: Number,
  default: 0,
},

  pickupLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

dropLocation: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    }
},
  status: {
    type: String,
    enum: [
      "REQUESTED",
      "ASSIGNED",
      "ARRIVED",
      "STARTED",
      "COMPLETED",
      "CANCELLED"
    ],
    default: "REQUESTED"
  }

}, { timestamps: true });

rideSchema.index({ pickupLocation: "2dsphere" });

const rideModel = mongoose.model("ride", rideSchema)

export default rideModel;