import { Router } from "express";
import instructorController from "../controllers/instructor.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";
import checkDeleteAdminsGuard from "../guards/check.delete.admins.guard.js";

const instructorRouter = Router();

instructorRouter.post("/create",checkAdminGuard, checkSuperAdminGuard, instructorController.create_instructor);
instructorRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, instructorController.get_instructor);

instructorRouter
  .route("/:id")
  .get(checkAdminGuard, checkSuperAdminGuard, instructorController.get_instructor)
  .put(checkUpdatePermissionGuard, instructorController.update_instructor)
  .delete(checkDeleteAdminsGuard, instructorController.delete_instructor);

export default instructorRouter;
