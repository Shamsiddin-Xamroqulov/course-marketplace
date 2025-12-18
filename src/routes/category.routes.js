import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkUpdatePermissionGuard from "../guards/check.update.permission.guard.js";

const categoryRouter = Router();

categoryRouter.post("/create", checkAdminGuard, checkSuperAdminGuard, categoryController.create_category);
categoryRouter.get("/all", checkAdminGuard, checkSuperAdminGuard, categoryController.get_category);

categoryRouter
  .route("/:id")
  .get(checkUpdatePermissionGuard, categoryController.get_category)
  .put(checkUpdatePermissionGuard, categoryController.update_category)
  .delete(checkUpdatePermissionGuard, categoryController.delete_category);

export default categoryRouter;
