import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { EMAIL_REGEX } from "../constants.js"
import { User } from "../models/user.model.js"
import { uploadOncloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


//generate accessToken & refreshToken
const generateAccessAndRefreshTokens = async (userId) => {
  try {

    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //set refreshToken in user property
    user.refereshToken = refreshToken;
    //save user into db
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access Token")
  }
}



//register User
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
  })
  //remove password and refreshtoken field from resposne
  const createdUser = await User.findById(user._id).select(
    "-password -refereshToken"
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

//login User
const loginUser = asyncHandler(async (req, res) => {
  //get user details from frontend based on model
  const { email, password } = req.body;
  console.log("email :", email);
  console.log("password : ", password);
  //validation 
  if (!email.trim() || !password.trim()) {
    throw new ApiError(400, "All Fields are required");
  }

  const emailRegex = EMAIL_REGEX;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password is invalid or it must take atleast 6 characters");
  }

  //check if user already exist or not
  const existedUser = await User.findOne({ email })
  if (!existedUser) {
    throw new ApiError(404, "User does not exist! Please Registered first")
  }
  //check password is correct or not !
  const isPasswordValid = await existedUser.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials !!");
  }

  //create AccessToken and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existedUser._id)

  //send accesstoken in cookiees.
  const loggedInUser = await User.findById(existedUser._id).select("-password -refereshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refereshToken: refreshToken
      }, "User Logged In Successfully !!")
    );

});

//logOut User
const logoutUser = asyncHandler(async (req, res) => {
  //clear cookies and reset refreshetoken
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refereshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refereshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})


//refresh your accessToken 
const refreshAceesToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refereshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request")
  }

  try {
    const decodedInfo = jwt.verify(
      incomingRefreshToken,
      process.env.REFERESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedInfo?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    //check incoming refresh token and user's refresh token
    if (incomingRefreshToken !== user?.refereshToken) {
      throw new ApiError(401, "Refresh Token is expired or used!!")
    }

    const options = {
      httpOnly: true,
      secure: true
    }
    //get new accessToken and refreshToken
    const { newAccessToken, newRrefeshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refereshToken", newRefeshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: newAccessToken,
            refereshToken: newRrefeshToken

          },
          "AccessToken refreshed successfully !!"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})


//change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?.id)
  const isCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isCorrect) {
    throw new ApiError(400, "Invalid User Old Password")
  }

  //change password
  user.password = newPassword

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully !!"))

})


//currentUSer
const currentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "Current user fetched !!")
})

//updateUser Profile Picture
const updateUserProfile = asyncHandler(async (req, res) => {
  //to-do

})




export {
  registerUser, loginUser,
  logoutUser, refreshAceesToken,
  changeCurrentPassword,
  currentUser, updateUserProfile
};