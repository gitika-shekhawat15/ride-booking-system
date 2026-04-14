import express from "express";
import { registerUser, loginUser, getMyProfile, updateProfile } from "../controllers/user.controller.js";
import { createUserValidator,loginUserValidator, updateProfileValidator } from "../validators/user.validator.js";
import validate from "../middlewares/validate.js"
import auth from "../middlewares/auth.js";
import { requireRider } from "../middlewares/role.js";

const router = express.Router();

router.post("/register",
    createUserValidator, 
    validate,
    registerUser
    );


router.post("/login",
    loginUserValidator,
    validate,
    loginUser
    );


router.get("/me",
        auth,
        requireRider,

        getMyProfile
    )

router.put("/me",
        auth,
        requireRider,
        updateProfileValidator,
        validate,
        updateProfile
    )


export default router;
