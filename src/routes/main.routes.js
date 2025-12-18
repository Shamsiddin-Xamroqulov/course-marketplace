import { Router } from "express";
import authRouter from "./auth.routes.js";
import adminRouter from "./admin.routes.js";
import studentRouter from "./student.routes.js";
import categoryRouter from "./category.routes.js";
import instructorRouter from "./instructor.routes.js";
import checkTokenGuard from "../guards/check.token.guard.js";

const mainRouter = Router();

// Auth
mainRouter.use("/auth", authRouter);

// Token Guard Police
mainRouter.use(checkTokenGuard);

// Admin
mainRouter.use("/admin", adminRouter);

// Instructor
mainRouter.use("/instructor", instructorRouter);

// Student
mainRouter.use("/student", studentRouter);

// Category
mainRouter.use("/category", categoryRouter);

export default mainRouter;
