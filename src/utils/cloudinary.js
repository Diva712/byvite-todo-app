import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import ApiError from "./ApiError.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOncloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      //error handling
      console.log("localFilePath is null while uploading file into cloudinary!");
      throw new ApiError(400, "LocalFilePath is null");

      //uploading logic to upload file into cloduinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })
      console.log("file has been uplaoded !!", response.url);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath)
    throw new ApiError(500, "Something went wrong while uploading file !!"); // remove the locally sacved temporary file
  }
}


export { uploadOncloudinary };