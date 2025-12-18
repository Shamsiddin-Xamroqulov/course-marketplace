import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";
import checkDeleteAdminsGuard from "../guards/check.delete.admins.guard.js";

const adminRouter = Router();

adminRouter.post("/create", checkAdminGuard, checkSuperAdminGuard, adminController.create_admin);
adminRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, adminController.get_admin);

adminRouter
  .route("/:id")
  .get(checkAdminGuard, checkSuperAdminGuard, adminController.get_admin)
  .put(checkUpdatePermissionGuard, adminController.update_admin)
  .delete(checkDeleteAdminsGuard, adminController.delete_admin);

export default adminRouter;