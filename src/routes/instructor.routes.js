import { Router } from "express";
import instructorController from "../controllers/instructor.controller.js";

const instructorRouter = Router();

instructorRouter.post("/create", instructorController.create_instructor);
instructorRouter.get("/all", instructorController.get_instructor);

instructorRouter
  .route("/:id")
  .get(instructorController.get_instructor)
  .put(instructorController.update_instructor)
  .delete(instructorController.delete_instructor);

export default instructorRouter;
