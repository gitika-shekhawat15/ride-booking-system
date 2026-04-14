import userModel from "../models/user.model.js";

export const registerUserService = async (userData) => {
    const { email, password } = userData;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

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
        throw new Error("Invalid credentials");
    }
    
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        throw new Error("Invalid credentials");
    }
  
    
    return user;

};