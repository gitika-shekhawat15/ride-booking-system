import express from "express";
import { createDriverValidator,goOnlineValidator, updateProfileValidator, updateDriverLocationValidator } from "../validators/driver.validator.js";
import validate from "../middlewares/validate.js";
import { registerDriver,updateProfile, getMyProfile, updateDriverLocation, goOnline, goOffline} from "../controllers/driver.controller.js";
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
    updateProfile
);

router.patch("/location",
    
    auth,
    requireDriver,
    updateDriverLocationValidator,
    validate,
    updateDriverLocation
);
router.post("/online", auth, requireDriver,goOnlineValidator,validate,  goOnline);
router.post("/offline", auth, requireDriver, goOffline);


export default router;