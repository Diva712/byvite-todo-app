import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required !!"]
    },
    email: {
      type: String,
      required: [true, "Email is required !!"],
      unique: [true, "Email is already exist"],
      lowercase: true,
    },
    profilePicture: {
      type: String // cloudinary url
    },
    password: {
      type: String,
      required: [true, "Password is required !!"],
      min: [6, "Password should be alteast 6 characters"]
    },
    confirmPassword: {
      type: String,
      required: [true, "confirm password is required"]
    },
    refereshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

//Pre Hooks implementation for password encryption
userSchema.pre("save", async function (next) {
  //if password field is not modified
  if (!this.isModified("password")) {
    return next();
  }
  //if password field is modified
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Password Check is it correct or not
userSchema.methods.isPasswordCorrect = async function
  (password) {
  return await bcrypt.compare(password, this.password);

}

export const User = mongoose.model("User", userSchema)