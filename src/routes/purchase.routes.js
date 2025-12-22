import { Router } from "express";
import purchaseController from "../controllers/purchase.controller.js";
import checkStudentGuard from "../guards/check.student.guard.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";
import checkParamsPermissionGuard from "../guards/check.params.permssion.guard.js";

const purchaseRouter = Router();

purchaseRouter.post("/create", checkStudentGuard, purchaseController.create_purchase);
purchaseRouter.get("/all", purchaseController.get_purchase);

purchaseRouter
  .route("/:id")
  .get(purchaseController.get_purchase)
  .put(checkAdminGuard, checkSuperAdminGuard, purchaseController.update_purchases)
  .delete(checkParamsPermissionGuard, purchaseController.delete_purchase);

export default purchaseRouter;