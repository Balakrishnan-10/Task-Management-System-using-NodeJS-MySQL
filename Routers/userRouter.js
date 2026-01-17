import express from "express";
import {
  deleteUser,
  getAllUsers,
  updateuser,
} from "../Controllers/userController.js";
import authUser from "../Middleware/tokenVerify.js";
import isAdmin from "../Middleware/role.js";


const router = express.Router();

// Admin routes :-
router.get("/all_users",authUser,isAdmin, getAllUsers);
router.delete("/delete/:id", authUser, isAdmin,deleteUser);

// User routes :-
router.put("/update", authUser, updateuser);


export default router;
