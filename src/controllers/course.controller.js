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

class CourseController {
  constructor() {
    this.create_course = async (req, res) => {
      try {
        const newCourse = req.body;
        const { error, value } = createCourseSchema.validate(newCourse, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const instructor_id = req.user.id;
        const findInstructor = await InstructorModel.findOne({
          where: { id: instructor_id },
        });
        if (!findInstructor) throw new ClientError("Instructor not found", 404);
        const insertCourse = await CourseModel.create({
          instructor_id: findInstructor.instructor_id,
          ...value,
        });
        return res.status(201).json({
          success: true,
          message: "Course successfully created !",
          status: 201,
          data: insertCourse,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_course = async (req, res) => {
      try {
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
          if (!findCourse) throw new ClientError("Course not found", 404);
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
        if (!courses.length)
          throw new ClientError("No Courses have been created yet", 404);
        return res.json(courses);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_course = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id required", 400);
        const findCourse = await CourseModel.findOne({ where: { id } });
        if (!findCourse) throw new ClientError("Course not found", 404);
        const updateData = req.body;
        const { error, value } = updateCourseSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        await CourseModel.update(value, { where: { id } });
        return res.json({
          message: "Course successfully updated !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_course = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id required", 400);
        const findCourse = await CourseModel.findOne({ where: { id } });
        if (!findCourse) throw new ClientError("Course not found", 404);
        await CourseModel.define({ where: { id } });
        return res.json({
          message: "Course successfully deleted !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new CourseController();
