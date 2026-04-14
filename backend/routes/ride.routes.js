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
    acceptRide,
);

// ✅ Static routes pehle
router.get("/nearby",
    auth,
    requireDriver,
    getNearbyRides
);

// ✅ Dynamic routes baad mein
router.get("/:rideId/status",
    auth,
    getRideStatus
);

router.patch("/:rideId/status",
    auth,
    updateRideStatus,
);

router.get("/:id/live",
    auth,
    requireRider,
    getLiveRideLocation
);



export default router;
