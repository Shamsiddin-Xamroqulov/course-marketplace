import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";

const categoryRouter = Router();

categoryRouter.post("/create", checkAdminGuard, checkSuperAdminGuard, categoryController.create_category);
categoryRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, categoryController.get_category);

categoryRouter.get("/get/by/:id", checkUpdatePermissionGuard, categoryController.get_category)
categoryRouter.put("/update/by/:id", checkUpdatePermissionGuard, categoryController.update_category)
categoryRouter.delete("/delete/by/:id", checkUpdatePermissionGuard, categoryController.delete_category);

export default categoryRouter;
