import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/create", adminController.create_admin);
adminRouter.get("/all", adminController.get_admin);

adminRouter
  .route("/:id")
  .get(adminController.get_admin)
  .put(adminController.update_admin)
  .delete(adminController.delete_admin);

export default adminRouter;
