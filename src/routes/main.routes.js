import { Router } from "express";
import authRouter from "./auth.routes.js";
import adminRouter from "./admin.routes.js";
import studentRouter from "./student.routes.js";
import categoryRouter from "./category.routes.js";
import instructorRouter from "./instructor.routes.js";
import checkTokenGuard from "../guards/check.token.guard.js";
import courseRouter from "./course.routes.js";
import lessonRouter from "./lesson.routes.js";
import purchaseRouter from "./purchase.routes.js";
import paymentRouter from "./payment.routes.js";
import lastCourseRouter from "./last.course.routes.js";

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

// Course
mainRouter.use("/course", courseRouter);

// Lesson 
mainRouter.use("/lesson", lessonRouter);

// Purchase
mainRouter.use("/purchase", purchaseRouter);

// Payment
mainRouter.use("/payment", paymentRouter);

// Last 30 days Course
mainRouter.use("/last/course", lastCourseRouter);

export default mainRouter;
