import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createUserSchema,
  updateUserSchema,
} from "../utils/validators/user.validator.js";
import { UserModel } from "../models/index.js";
import hashService from "../lib/services/hashing.service.js";
import {
  deleteFromCloudinarySchema,
  uploadAvatarFromBuffer,
} from "../lib/services/cloud.service.js";
import logger from "../lib/services/logger.service.js";

class StudentController {
  constructor() {
    this.create_student = async (req, res) => {
      try {
        logger.info("Create student request received");
        const newStudent = req.body;
        const { error, value } = createUserSchema.validate(newStudent, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create student validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const checkUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (checkUser) {
          logger.warn(`Student already exists | email=${value.email}`);
          throw new ClientError("Student already exists", 409);
        }
        value.password = await hashService.hashingPassword(value.password);
        const insertStudent = await UserModel.create({
          ...value,
          is_verified: true,
        });
        const { avatar, otp, otp_time, password, photo_id, ...safeUser } =
          insertStudent.toJSON();
        logger.info(`Student successfully created | id=${insertStudent.id}`);
        return res.status(201).json({
          success: true,
          message: "Student successfully create !",
          status: 201,
          data: safeUser,
        });
      } catch (err) {
        logger.error(`Create student error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.get_student = async (req, res) => {
      try {
        logger.info(`Get student request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findStudent = await UserModel.findOne({
            where: { id, role: "student" },
            attributes: { exclude: ["password"] },
          });
          if (!findStudent) {
            logger.warn(`Student not found | id=${id}`);
            throw new ClientError("Student not found", 404);
          }
          logger.info(`Student fetched successfully | id=${id}`);
          return res.json(findStudent);
        }
        const students = await UserModel.findAll({
          where: { role: "student" },
          attributes: { exclude: ["password"] },
        });
        if (!students.length) {
          logger.warn("No students found");
          throw new ClientError("No students have been created", 404);
        }
        logger.info(`Students list fetched | count=${students.length}`);
        return res.json(students);
      } catch (err) {
        logger.error(`Get student error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_student = async (req, res) => {
      try {
        logger.info(`Update student request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update student failed: Params Id is required");
          throw new ClientError("Params Id is required", 400);
        }
        const findStudent = await UserModel.findOne({
          where: { id, role: "student" },
        });
        if (!findStudent) {
          logger.warn(`Student not found | id=${id}`);
          throw new ClientError("Student not found", 404);
        }
        const updateData = req.body;
        const { error, value } = updateUserSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(
            `Update student validation failed | id=${id} | ${error.message}`
          );
          throw new ClientError(error.message, 400);
        }
        if (value.password) {
          value.password = await hashService.hashingPassword(value.password);
        }
        let avatarData = {};
        if (req.file) {
          if (findStudent.avatar_id) {
            await deleteFromCloudinarySchema(findStudent.avatar_id, "image");
          }
          const result = await uploadAvatarFromBuffer(
            req.file.path || req.file.buffer
          );
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
            where: { id, role: "student" },
          }
        );
        logger.info(`Student successfully updated | id=${id}`);
        return res.json({
          message: "Student successfully updated!",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update student error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_student = async (req, res) => {
      try {
        logger.info(`Delete student request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete student failed: Params Id is required");
          throw new ClientError("Params Id is required", 400);
        }
        const findUser = await UserModel.findOne({
          where: { id, role: "student" },
        });
        if (!findUser) {
          logger.warn(`Student not found | id=${id}`);
          throw new ClientError("Student not found", 404);
        }
        if (findUser.photo_id) {
          await deleteFromCloudinarySchema(findUser.photo_id);
        }
        await UserModel.destroy({ where: { id, role: "student" } });
        logger.info(`Student successfully deleted | id=${id}`);
        return res.json({
          message: "Student successfully deleted !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete student error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new StudentController();
