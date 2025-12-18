import { Router } from "express";
import categoryController from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/create", categoryController.create_category);
categoryRouter.get("/all", categoryController.get_category);

categoryRouter
  .route("/:id")
  .get(categoryController.get_category)
  .put(categoryController.update_category)
  .delete(categoryController.delete_category);

export default categoryRouter;
