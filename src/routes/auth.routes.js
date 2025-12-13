import {Router} from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authController.REGISTER);

export default authRouter;