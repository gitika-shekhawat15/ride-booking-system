import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const registerUserService = async (userData) => {
    const { email, password } = userData;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new AppError("Email already registered", 400);

    userData.password = await userModel.hashPassword(password);
    const user = await userModel.create(userData);
    
    return user; 
};

export const loginUserService = async ({email, password}) => {
    const user = await userModel
            .findOne({email})
            .select("+password"); 
;
    if(!user) {
        throw new AppError("Invalid credentials", 401);
    }
    
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }
  
    
    return user;

};