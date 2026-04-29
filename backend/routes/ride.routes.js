import express from "express";
import { acceptRide,
        createRide,
        updateRideStatus,
        getRideStatus,
        getLiveRideLocation,
        getNearbyRides 

    } from "../controllers/ride.controller.js";
import { createRideValidator } from "../validators/ride.validator.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { requireDriver, requireRider } from "../middlewares/role.js";

const router = express.Router();

router.post("/",
    auth,
    requireRider,
    createRideValidator, 
    validate,
    createRide
);

router.post("/accept",
    auth,
    requireDriver,
    acceptRide
);

router.get("/nearby",
    auth,
    requireDriver,
    getNearbyRides
);

router.get("/:rideId/status",
    auth,
    getRideStatus
);

router.patch("/:rideId/status",
    auth,
    requireDriver,
    updateRideStatus,
);

router.get("/:rideId/live",
    auth,
    requireRider,
    getLiveRideLocation
);



export default router;
