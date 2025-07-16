import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    userName: {type : String, required: true},
    email: {type : String, required: true},
    password: {type : String, required: true}
})

userSchema.pre("save",async function (next)  {

    if(!this.isModified("password")){
        return next()
    }


     // Hash the password with bcrypt before saving
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed with the save operation
  } catch (error) {
    next(error); // Pass error to the next middleware
  }


})

export const UserModal = mongoose.model('User',userSchema)