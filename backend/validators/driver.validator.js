import { body } from "express-validator";
import driverProfile from "../models/driver.model.js";

export const createDriverValidator = [

  body("vehicleType")
    .notEmpty().withMessage("Vehicle type is required").bail()
    .isIn(["car", "bike", "auto"])
    .withMessage("Vehicle type must be car, bike or auto"),

  body("vehicleNumber")
    .notEmpty().withMessage("Vehicle number is required").bail()
    .customSanitizer(v => v.trim().toUpperCase())          
    .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)
    .withMessage("Invalid vehicle number (e.g. RJ14AB1234)")
    .custom(async (value) => {
      const exists = await driverProfile.findOne({ vehicleNumber: value }); 
      if (exists) throw new Error("Vehicle already registered");
      return true;
    }),

  body("licenseNumber")
    .notEmpty().withMessage("License number is required").bail()
    .isLength({ min: 6 })
    .withMessage("Invalid license number"),

  
  body("vehicleModel")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Enter a valid vehicle model"),

  body("experience")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 50 })
    .withMessage("Experience must be a number between 0 and 50"),

];
export const updateProfileValidator = [
    body("fullname.firstname")
    .optional()
    .customSanitizer(v => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()),

    body("fullname.lastname")
    .optional()
    .customSanitizer(v => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()),
]

export const updateDriverLocationValidator = [
  body("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude required"),

  body("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude required"),
];