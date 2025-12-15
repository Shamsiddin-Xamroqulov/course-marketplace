import {Router} from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Register
authRouter.post("/register", authController.register);
authRouter.post("/verify", authController.verify);
authRouter.post("/resend/otp", authController.resendOtp);

// Password
authRouter.post("/forgot/password", authController.forgotPassword);
authRouter.post("/change/password", authController.change_password);

// Login
authRouter.post("/login", authController.login);

export default authRouter;