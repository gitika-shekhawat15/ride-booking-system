import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            trim: true

        },
    },
   
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
        
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["rider", "driver"],
        default: "rider",

    }
},
    {timestamps: true}
);
 
// generate token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { _id: this._id, role: this.role },
         process.env.JWT_SECRET,
         {expiresIn: process.env.JWT_EXPIRES_IN}
        )
}

userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

// Compare password
userSchema.methods.comparePassword = async function (password)  {
    return bcrypt.compare(password, this.password);
}


// userSchema.methods.hashPassword = async function (password) {
//     return bcrypt.hash(password, 10);
    
// }

const userModel = mongoose.model("user", userSchema);

export default userModel;