import { body } from "express-validator";

export const createRideValidator = [

  body("pickupLocation")
    .notEmpty().withMessage("Pickup location is required"),

  body("dropLocation")
    .notEmpty().withMessage("Drop location is required"),

];