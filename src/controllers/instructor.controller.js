import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createInstructorSchema,
  updateInstructorSchema,
} from "../utils/validators/instructor.validator.js";
import { InstructorModel, UserModel } from "../models/index.js";
import hashService from "../lib/services/hashing.service.js";
import {
  deleteFromCloudinarySchema,
  uploadAvatarFromBuffer,
} from "../lib/services/cloud.service.js";
import logger from "../lib/services/logger.service.js";

class InstructorController {
  constructor() {
    this.create_instructor = async (req, res) => {
      try {
        logger.info("Create instructor request received");
        const newInstructor = req.body;
        const { error, value } = createInstructorSchema.validate(
          newInstructor,
          { abortEarly: false }
        );
        if (error) {
          logger.warn(`Create instructor validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const checkInstructor = await UserModel.findOne({
          where: { email: value.email, role: "instructor" },
        });
        if (checkInstructor) {
          logger.warn(`Instructor already exists | email=${value.email}`);
          throw new ClientError("Instructor already exists", 409);
        }
        value.password = await hashService.hashingPassword(value.password);
        logger.info(`Instructor password hashed | email=${value.email}`);
        const insertInstructor = await UserModel.create({
          ...value,
          is_verified: true,
          role: "instructor",
        });
        await InstructorModel.create({ user_id: insertInstructor.id });
        const { otp, password, otp_time, avatar, photo_id, ...safeInstructor } =
          insertInstructor.toJSON();
        logger.info(
          `Instructor successfully created | id=${insertInstructor.id}`
        );
        return res.status(201).json({
          success: true,
          message: "Instructor successfully created !",
          status: 201,
          data: safeInstructor,
        });
      } catch (err) {
        logger.error(
          `Create instructor error | email=${req.body.email} | ${err.message}`
        );
        return globalError(err, res);
      }
    };
    this.get_instructor = async (req, res) => {
      try {
        logger.info(`Get instructor request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findInstructor = await InstructorModel.findOne({
            where: { id },
            include: {
              model: UserModel,
              attributes: { exclude: ["otp", "otp_time", "password"] },
            },
          });
          if (!findInstructor) {
            logger.warn(`Instructor not found | id=${id}`);
            throw new ClientError("Instructor not found", 404);
          }
          logger.info(`Instructor fetched successfully | id=${id}`);
          return res.json(findInstructor);
        }
        const instructors = await InstructorModel.findAll({
          include: {
            model: UserModel,
            attributes: { exclude: ["otp", "otp_time", "password"] },
          },
        });
        if (!instructors.length) {
          logger.warn("No instructors found");
          throw new ClientError("No instructors have been created yet", 404);
        }
        logger.info(`Instructors list fetched | count=${instructors.length}`);
        return res.json(instructors);
      } catch (err) {
        logger.error(`Get instructor error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_instructor = async (req, res) => {
      try {
        logger.info(`Update instructor request received | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update instructor failed: Params Id is required");
          throw new ClientError("Params Id is required", 400);
        }
        const findInstructor = await InstructorModel.findOne({ where: { id } });
        if (!findInstructor) {
          logger.warn(`Instructor not found | id=${id}`);
          throw new ClientError("Instructor not found", 404);
        } 
        const updateData = req.body;
        const { error, value } = updateInstructorSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Update instructor validation failed | id=${id} | ${error.message}`);
          throw new ClientError(error.message, 400);
        } 
        if (value.password) {
          logger.info(`Instructor password hashed | id=${id}`);
          value.password = await hashService.hashingPassword(value.password);
        }
        let avatarData = {};
        if (req.file) {
          const existingUser = await UserModel.findOne({
            where: { id: findInstructor.user_id },
          });
          if (existingUser.avatar_id) {
            await deleteFromCloudinarySchema(existingUser.avatar_id, "image");
          }
          const result = await uploadAvatarFromBuffer(
            req.file.path || req.file.buffer
          );
          logger.info(`Instructor avatar updated | id=${id}`);
          avatarData = {
            avatar: result.secure_url,
            avatar_id: result.public_id,
          };
        }
        await UserModel.update(
          {
            ...value,
            ...avatarData,
          },
          {
            where: { id: findInstructor.user_id, role: "instructor" },
          }
        );
        logger.info(`Instructor successfully updated | id=${id}`);
        return res.json({
          message: "Instructor successfully updated!",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update instructor error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_instructor = async (req, res) => {
      try {
        logger.info(`Delete instructor request received | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete instructor failed: Params Id is required");
          throw new ClientError("Params Id is required", 404);
        }
        const findInstructor = await InstructorModel.findOne({ where: { id } });
        if (!findInstructor) {
          logger.warn(`Instructor not found | id=${id}`);
          throw new ClientError("Instructor not found", 404);
        } 
        if (findInstructor.photo_id) {
          logger.info(`Instructor avatar deleted from Cloudinary | id=${id}`);
          await deleteFromCloudinarySchema(findInstructor.photo_id);
        }
        await InstructorModel.destroy({ where: { id } });
        logger.info(`Instructor successfully deleted | id=${id}`);
        return res.json({
          message: "Instructor successfully deleted !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete instructor error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new InstructorController();
