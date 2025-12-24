import { Router } from "express";
import instructorController from "../controllers/instructor.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";
import checkDeleteAdminsGuard from "../guards/check.delete.admins.guard.js";
import { upload } from "../config/multer.config.js";

const instructorRouter = Router();

instructorRouter.post("/create",checkAdminGuard, checkSuperAdminGuard, instructorController.create_instructor);
instructorRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, instructorController.get_instructor);

instructorRouter.get("/get/by/:id", checkAdminGuard, checkSuperAdminGuard, instructorController.get_instructor)
instructorRouter.put("/update/by/:id", checkUpdatePermissionGuard, upload.single("avatar"), instructorController.update_instructor)
instructorRouter.delete("/delete/by/:id", checkDeleteAdminsGuard, instructorController.delete_instructor);

export default instructorRouter;
