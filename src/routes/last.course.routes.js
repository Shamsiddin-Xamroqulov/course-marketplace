import {Router} from "express";
import lastCourseController from "../controllers/last.course.controller.js";

const lastCourseRouter = Router();

lastCourseRouter.get("/all", lastCourseController.LAST_30_DAYS_SALES);

export default lastCourseRouter;