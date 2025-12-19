import { Router } from "express";
import technologyController from "../controllers/technology.controller.js";
import checkTechnologyGuard from "../guards/check.technology.guard.js";

const technologyRouter = Router();

technologyRouter.post("/create", checkTechnologyGuard, technologyController.create_technology);
technologyRouter.get("/all", checkTechnologyGuard, technologyController.get_technology);

technologyRouter
  .route("/:id")
  .get(checkTechnologyGuard, technologyController.get_technology)
  .put(checkTechnologyGuard, technologyController.update_technology)
  .delete(checkTechnologyGuard, technologyController.delete_technology);

export default technologyRouter;