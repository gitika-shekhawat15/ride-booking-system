
    import jwt from "jsonwebtoken";
    import userModel from "../models/user.model.js";

const auth = async (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const token = authHeader.split(" ")[1];

    // VERIFY token (NOT sign)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get full user from DB
    const user = await userModel.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.user = user; 
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;

