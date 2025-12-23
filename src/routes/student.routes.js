import { Router } from "express";
import studentController from "../controllers/student.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";
import checkDeleteAdminsGuard from "../guards/check.delete.admins.guard.js";
import { upload } from "../config/multer.config.js";

const studentRouter = Router();

studentRouter.post("/create", checkAdminGuard, checkSuperAdminGuard, studentController.create_student);
studentRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, studentController.get_student);

studentRouter.get("/get/by/:id", checkAdminGuard, checkSuperAdminGuard, studentController.get_student)
studentRouter.put("/update/by/:id", checkUpdatePermissionGuard, upload.single("avatar"), studentController.update_student)
studentRouter.delete("/delete/by/:id", checkDeleteAdminsGuard, studentController.delete_student);

export default studentRouter;