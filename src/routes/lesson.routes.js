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

lessonRouter
  .route("/:id")
  .get(lessonController.get_lesson)
  .put(checkRightsGuard, upload.single("video"), lessonController.update_lesson)
  .delete(checkRightsGuard, lessonController.delete_lesson);

export default lessonRouter;
