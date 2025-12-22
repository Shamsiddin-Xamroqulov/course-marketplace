import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import checkStudentGuard from "../guards/check.student.guard.js";
import checkAdminGuard from "../guards/check.admin.guard.js";
import checkSuperAdminGuard from "../guards/check.super.admin.guard.js";

const paymentRouter = Router();

paymentRouter.post("/create", checkStudentGuard, paymentController.create_payment);
paymentRouter.get("/all", paymentController.get_payment);

paymentRouter
  .route("/:id")
  .get(paymentController.get_payment)
  .put(checkAdminGuard, checkSuperAdminGuard, paymentController.update_payment)
  .delete(checkAdminGuard, checkSuperAdminGuard, paymentController.delete_payment);

export default paymentRouter;