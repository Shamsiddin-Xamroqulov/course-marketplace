import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";
import checkDeleteAdminsGuard from "../guards/check.delete.admins.guard.js";
import { upload } from "../config/multer.config.js";

const adminRouter = Router();

adminRouter.post("/create", checkAdminGuard, checkSuperAdminGuard, adminController.create_admin);
adminRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, adminController.get_admin);

adminRouter.get("/get/by/:id", checkAdminGuard, checkSuperAdminGuard, adminController.get_admin)
adminRouter.put("/update/by/:id", checkUpdatePermissionGuard, upload.single("avatar"), adminController.update_admin)
adminRouter.delete("/delete/by/:id",checkDeleteAdminsGuard, adminController.delete_admin);

export default adminRouter;