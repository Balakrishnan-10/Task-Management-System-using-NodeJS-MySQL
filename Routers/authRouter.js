import express from "express";
import { loginUser, myprofile, registerUser } from "../Controllers/authController.js";
import upload from "../Middleware/upload.js";
import authUser from "../Middleware/tokenVerify.js";

const router = express.Router();

router.post('/user/register',upload.single("profile_image"),registerUser);
router.post('/user/login',loginUser);
router.get('/user/myprofile',authUser,myprofile)

export default router;