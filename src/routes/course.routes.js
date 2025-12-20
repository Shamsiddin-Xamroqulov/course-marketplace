import {Router} from "express";
import checkInstructorGuard from "../guards/check.instructor.guard.js";
import courseController from "../controllers/course.controller.js";
import checkRightsGuard from "../guards/check.rights.guard.js";

const courseRouter = Router();

courseRouter.post("/create", checkInstructorGuard, courseController.create_course);
courseRouter.get("/all", courseController.get_course);

courseRouter
  .route("/:id")
  .get(courseController.get_course)
  .put(checkRightsGuard, courseController.update_course)
  .delete(checkRightsGuard, courseController.delete_course);

export default courseRouter;