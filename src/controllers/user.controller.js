import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { EMAIL_REGEX } from "../constants.js"
import { User } from "../models/user.model.js"
import { uploadOncloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {

  //get user details from frontend based on model
  const { username, email, password, confirmPassword } = req.body;

  //validation 
  if (!username.trim() || !email.trim() || !password.trim()
    || !confirmPassword.trim()) {
    throw new ApiError(400, "All Fields are required");
  }

  const emailRegex = EMAIL_REGEX;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  if (password != confirmPassword) {
    throw new ApiError(400, "Password and confirm Password not matched!!")
  }
  //check if user already exist or not
  const existedUser = await User.findOne({ email })
  if (existedUser) {
    throw new ApiError(409, "User already existed with this email!!")
  }
  //check for profile picture image
  if (!req.file) {
    throw new ApiError(400, "Profile picture is required.");
  }
  //upload profilePicture into cloudinary
  console.log("File path : ", req.file.path);
  const uploadResult = await uploadOncloudinary(req.file.path);
  if (!uploadResult) {
    throw new ApiError(500, "Failed to upload profile picture.");
  }
  //create user Object - create entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    profilePicture: uploadResult.secure_url || "",
    password,
    confirmPassword
  })
  //remove password and refreshtoken field from resposne
  const createdUser = await User.findById(user._id).select(
    "-password -refereshToken -confirmPassword"
  )
  //check for user creation

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong during register the user !!")
  }
  //return response or error
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User Registered Sucessfully!!")
  )

})

export { registerUser };