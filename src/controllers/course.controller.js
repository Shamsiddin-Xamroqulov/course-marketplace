import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../utils/validators/course.validation.js";
import {
  CategoryModel,
  CourseModel,
  InstructorModel,
  UserModel,
} from "../models/index.js";
import logger from "../lib/services/logger.service.js";

class CourseController {
  constructor() {
    this.create_course = async (req, res) => {
      try {
        logger.info("Create course request received");
        const newCourse = req.body;
        const { error, value } = createCourseSchema.validate(newCourse, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create course validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const instructor_id = req.user.id;
        const findInstructor = await InstructorModel.findOne({
          where: { id: instructor_id },
        });
        if (!findInstructor) {
          logger.warn(`Instructor not found | user_id=${instructor_id}`);
          throw new ClientError("Instructor not found", 404);
        }
        const insertCourse = await CourseModel.create({
          instructor_id: findInstructor.instructor_id,
          ...value,
        });
        logger.info(
          `Course successfully created | id=${insertCourse.id} | instructor_id=${instructor_id}`
        );
        return res.status(201).json({
          success: true,
          message: "Course successfully created !",
          status: 201,
          data: insertCourse,
        });
      } catch (err) {
        logger.error(
          `Create course error | user_id=${req.user.id} | ${err.message}`
        );
        return globalError(err, res);
      }
    };
    this.get_course = async (req, res) => {
      try {
        logger.info(`Get course request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findCourse = await CourseModel.findOne({
            where: { id },
            include: [
              {
                model: InstructorModel,
                include: {
                  model: UserModel,
                  attributes: {
                    exclude: ["photo_id", "otp", "otp_time", "password"],
                  },
                },
              },
              { model: CategoryModel },
            ],
          });
          if (!findCourse) {
            logger.warn(`Course not found | id=${id}`);
            throw new ClientError("Course not found", 404);
          }
          logger.info(`Course fetched successfully | id=${id}`);
          return res.json(findCourse);
        }
        const courses = await CourseModel.findAll({
          include: [
            {
              model: InstructorModel,
              include: {
                model: UserModel,
                attributes: {
                  exclude: ["photo_id", "otp", "otp_time", "password"],
                },
              },
            },
            { model: CategoryModel },
          ],
        });
        if (!courses.length) {
          logger.warn("No courses found");
          throw new ClientError("No Courses have been created yet", 404);
        }
        logger.info(`Courses list fetched | count=${courses.length}`);
        return res.json(courses);
      } catch (err) {
        logger.error(`Get course error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_course = async (req, res) => {
      try {
        logger.info(`Update course request received | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update course failed: Params Id required");
          throw new ClientError("Params Id required", 400);
        }
        const findCourse = await CourseModel.findOne({ where: { id } });
        if (!findCourse) {
          logger.warn(`Update course failed: Course not found | id=${id}`);
          throw new ClientError("Course not found", 404);
        }
        const updateData = req.body;
        const { error, value } = updateCourseSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(
            `Update course validation failed | id=${id} | ${error.message}`
          );
          throw new ClientError(error.message, 400);
        }
        await CourseModel.update(value, { where: { id } });
        logger.info(`Course successfully updated | id=${id}`);
        return res.json({
          message: "Course successfully updated !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update course error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_course = async (req, res) => {
      try {
        logger.info(`Delete course request received | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete course failed: Params Id required");
          throw new ClientError("Params Id required", 400);
        }
        const findCourse = await CourseModel.findOne({ where: { id } });
        if (!findCourse) {
          logger.warn(`Delete course failed: Course not found | id=${id}`);
          throw new ClientError("Course not found", 404);
        }
        await CourseModel.define({ where: { id } });
        logger.info(`Course successfully deleted | id=${id}`);
        return res.json({
          message: "Course successfully deleted !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete course error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new CourseController();
