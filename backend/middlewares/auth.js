    import jwt from "jsonwebtoken";
    import userModel from "../models/user.model.js";
    import AppError from "../utils/AppError.js";

const auth = async (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized user", 401));
    }

    const token = authHeader.split(" ")[1];

    // VERIFY token (NOT sign)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get full user from DB
    const user = await userModel.findById(decoded._id).select("-password");

    if (!user) {
      return next(new AppError("Unauthorized user", 401));
    }

    req.user = user; 
    next();

  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export default auth;

