import { Router } from "express";
import lessonController from "../controllers/lesson.controller.js";
import { upload } from "../config/multer.config.js";
import checkInstructorGuard from "../guards/check.instructor.guard.js";
import checkRightsGuard from "../guards/check.rights.guard.js";

const lessonRouter = Router();

lessonRouter.post(
  "/create",
  checkInstructorGuard,
  upload.single("video"),
  lessonController.create_lesson
);
lessonRouter.get("/all", lessonController.get_lesson);

lessonRouter.get("/get/by/:id", lessonController.get_lesson)
lessonRouter.put("/update/by/:id", checkRightsGuard, upload.single("video"), lessonController.update_lesson)
lessonRouter.delete("/delete/by/:id", checkRightsGuard, lessonController.delete_lesson);

export default lessonRouter;
