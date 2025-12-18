import { Router } from "express";
import studentController from "../controllers/student.controller.js";

const studentRouter = Router();

studentRouter.post("/create", studentController.create_student);
studentRouter.get("/all", studentController.get_student);

studentRouter
  .route("/:id")
  .get(studentController.get_student)
  .put(studentController.update_student)
  .delete(studentController.delete_student);

export default studentRouter;
