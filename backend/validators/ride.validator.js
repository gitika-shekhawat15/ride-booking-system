import { body } from "express-validator";

export const createRideValidator = [

  body("pickupLocation")
    .notEmpty().withMessage("Pickup location is required")
    .bail()
    .isObject().withMessage("Pickup must be an object"),

  body("pickupLocation.type")
    .equals("Point")
    .withMessage("Pickup type must be Point"),

  body("pickupLocation.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Pickup coordinates must be [lng, lat]")
    .bail(),

  body("pickupLocation.coordinates.0")
    .isFloat().withMessage("Pickup longitude must be number")
    .toFloat(),

  body("pickupLocation.coordinates.1")
    .isFloat().withMessage("Pickup latitude must be number")
    .toFloat(),

  body("dropLocation")
    .notEmpty().withMessage("Drop location is required")
    .bail()
    .isObject().withMessage("Drop must be an object"),

  body("dropLocation.type")
    .equals("Point")
    .withMessage("Drop type must be Point"),

  body("dropLocation.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Drop coordinates must be [lng, lat]")
    .bail(),

  body("dropLocation.coordinates.0")
    .isFloat().withMessage("Drop longitude must be number")
    .toFloat(),

  body("dropLocation.coordinates.1")
    .isFloat().withMessage("Drop latitude must be number")
    .toFloat(),

  body("vehicleType")
    .notEmpty().withMessage("Vehicle type is required")
    .bail()
    .isIn(["bike", "car", "auto"])
    .withMessage("Invalid vehicle type"),
];