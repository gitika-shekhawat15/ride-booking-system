import {body} from "express-validator";
import userModel from "../models/user.model.js";

export const createUserValidator = [
    body("fullname.firstname")
    .notEmpty()
    .withMessage("Firstname is required")
    .bail()
    .customSanitizer(v => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()),

    body("fullname.lastname")
    .notEmpty()
    .withMessage("Lastname is required")
    .bail()
    .customSanitizer(v => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()), 
    
    body("email")
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email format")
    .bail()                                        
    .normalizeEmail()                                
    .custom(async (value) => {
        const user = await userModel.findOne({ email: value });
        if (user) {
            throw new Error("Email already registered");
        }
    }),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Minimum 6 characters required")
]

export const loginUserValidator = [
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),       
    body("password")
    .notEmpty()
    .withMessage("Password is required")
]
export const updateProfileValidator = [
    body("fullname.firstname")
    .optional()
    .customSanitizer(v => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()),

    body("fullname.lastname")
    .optional()
    .customSanitizer(v => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()),

    
]
