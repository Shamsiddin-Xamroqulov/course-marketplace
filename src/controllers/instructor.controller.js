import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createInstructorSchema,
  updateInstructorSchema,
} from "../utils/validators/instructor.validator.js";
import { InstructorModel, UserModel } from "../models/index.js";
import hashService from "../lib/services/hashing.service.js";

class InstructorController {
  constructor() {
    this.create_instructor = async (req, res) => {
      try {
        const newInstructor = req.body;
        const { error, value } = createInstructorSchema.validate(
          newInstructor,
          { abortEarly: false }
        );
        if (error) throw new ClientError(error.message, 400);
        const checkInstructor = await UserModel.findOne({
          where: { email: value.email, role: "instructor" },
        });
        if (checkInstructor)
          throw new ClientError("Instructor already exists", 409);
        value.password = await hashService.hashingPassword(value.password);
        const insertInstructor = await UserModel.create({
          ...value,
          is_verified: true,
          role: "instructor",
        });
        await InstructorModel.create({ user_id: insertInstructor.id });
        const { otp, password, otp_time, avatar, photo_id, ...safeInstructor } =
          insertInstructor.toJSON();
        return res.status(201).json({
          success: true,
          message: "Instructor successfully created !",
          status: 201,
          data: safeInstructor,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_instructor = async (req, res) => {
      try {
        const { id } = req.params;
        if (id) {
          const findInstructor = await InstructorModel.findOne({
            where: { id },
            include: {
              model: UserModel,
              attributes: { exclude: ["otp", "otp_time", "password"] },
            },
          });
          if (!findInstructor)
            throw new ClientError("Instructor not found", 404);
          return res.json(findInstructor);
        }
        const instructors = await InstructorModel.findAll({
          include: {
            model: UserModel,
            attributes: { exclude: ["otp", "otp_time", "password"] },
          },
        });
        if (!instructors.length)
          throw new ClientError("No instructors have been created yet", 404);
        return res.json(instructors);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_instructor = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id is required", 400);
        const findInstructor = await InstructorModel.findOne({ where: { id } });
        if (!findInstructor) throw new ClientError("Instructor not found", 404);
        const updateData = req.body;
        const { error, value } = updateInstructorSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        if (value.password) {
          value.password = await hashService.hashingPassword(value.password);
        }
        await UserModel.update(value, {
          where: { id: findInstructor.id, role: "instructor" },
        });
        return res.json({
          message: "Instructor successfully updated !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_instructor = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id is required", 404);
        const findInstructor = await InstructorModel.findOne({ where: { id } });
        if (!findInstructor) throw new ClientError("Instructor not found", 404);
        await InstructorModel.destroy({ where: { id } });
        return res.json({
          message: "Instructor successfully deleted !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new InstructorController();
