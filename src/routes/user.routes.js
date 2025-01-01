import { Router } from "express";
import { loginUser, logoutUser, refreshAceesToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//register end-point
router.route("/register").post(
  upload.single("profilePicture"),
  registerUser
)
//login end-point
router.route("/login").post(loginUser)

//refresh-token end-point
router.route("/refresh-token").post(refreshAceesToken)

//secured routes

//logout end-point
router.route("/logout").post(verifyJWT, logoutUser)



export default router;