import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import checkRightsGuard from "../guards/check.rights.guard.js";

const notificationRouter = Router();

notificationRouter.post("/create", checkRightsGuard, notificationController.create_notification);
notificationRouter.get("/all", notificationController.get_notification);

notificationRouter
  .route("/:id")
  .get(notificationController.get_notification_by_id)
  .delete(checkRightsGuard, notificationController.delete);

export default notificationRouter;
