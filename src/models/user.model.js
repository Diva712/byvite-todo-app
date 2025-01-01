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
      type: String,
      required: true
      // cloudinary url
    },
    password: {
      type: String,
      required: [true, "Password is required !!"],
      min: [6, "Password should be alteast 6 characters"]
    },
    confirmPassword: {
      type: String,

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

//logic for generation of accessToken
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


//logic for generation of refreshToken
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,

    },
    process.env.REFERESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFERESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)