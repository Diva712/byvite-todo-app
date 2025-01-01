import mongoose from "mongoose";

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
      type: String
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



export const User = mongoose.model("User", userSchema)