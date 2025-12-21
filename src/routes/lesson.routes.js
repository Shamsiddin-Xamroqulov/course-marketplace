import { Router } from "express";
import lessonController from "../controllers/lesson.controller.js";
import { upload } from "../config/multer.config.js";

const lessonRouter = Router();

lessonRouter.post(
  "/create",
  upload.single("video"),
  lessonController.create_lesson
);
lessonRouter.get("/all", lessonController.get_lesson);

lessonRouter
  .route("/:id")
  .get(lessonController.get_lesson)
  .put(upload.single("video"), lessonController.update_lesson)
  .delete(lessonController.delete_lesson);

export default lessonRouter;
