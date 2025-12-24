import {Router} from "express";
import checkInstructorGuard from "../guards/check.instructor.guard.js";
import courseController from "../controllers/course.controller.js";
import checkRightsGuard from "../guards/check.rights.guard.js";

const courseRouter = Router();

courseRouter.post("/create", checkInstructorGuard, courseController.create_course);
courseRouter.get("/all", courseController.get_course);

courseRouter.get("/get/by/:id", courseController.get_course)
courseRouter.put("/update/by/:id", checkRightsGuard, courseController.update_course)
courseRouter.delete("/delete/by/:id", checkRightsGuard, courseController.delete_course);

export default courseRouter;