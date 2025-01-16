import express from "express";
import protect from "../middleware/auth.js"; // Adjust path as needed
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/profile", protect, getUserProfile); // Protected route

export default userRouter;
