import {Router} from "express";
import authRouter from "./auth.routes.js";
import adminRouter from "./admin.routes.js";
import studentRouter from "./student.routes.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/admin", adminRouter);
mainRouter.use("/student", studentRouter);

export default mainRouter;