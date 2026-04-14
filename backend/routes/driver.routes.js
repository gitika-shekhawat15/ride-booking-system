import express from "express";
import { createDriverValidator, updateProfileValidator, updateDriverLocationValidator } from "../validators/driver.validator.js";
import validate from "../middlewares/validate.js";
import { registerDriver, getMyProfile, updateDriverLocation, goOnline, goOffline} from "../controllers/driver.controller.js";
import auth from "../middlewares/auth.js";
import { requireDriver } from "../middlewares/role.js";

const router = express.Router();


router.post("/register",
    auth,
    createDriverValidator,
    validate,
    registerDriver
);

router.get("/me",

    auth,
    requireDriver,
    getMyProfile
);

router.put("/me",

    auth,
    requireDriver,
        updateProfileValidator,
    validate,
    getMyProfile
);

router.patch("/location",
    
    auth,
    requireDriver,
    updateDriverLocationValidator,
    validate,
    updateDriverLocation
);
router.post("/online", auth, goOnline);
router.post("/offline", auth, goOffline);


export default router;