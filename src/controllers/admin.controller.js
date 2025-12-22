import { ClientError, globalError } from "shokhijakhon-error-handler";
import { AdminModel, UserModel } from "../models/index.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../utils/validators/user.validator.js";
import hashService from "../lib/services/hashing.service.js";
import {
  deleteFromCloudinarySchema,
  uploadAvatarFromBuffer,
} from "../lib/services/cloud.service.js";
import logger from "../lib/services/logger.service.js";

class AdminController {
  constructor() {
    this.create_admin = async (req, res) => {
      try {
        logger.info("Create admin request received");
        const newAdmin = req.body;
        const { error, value } = createUserSchema.validate(newAdmin, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create admin validation error: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const checkAdmin = await UserModel.findOne({
          where: { email: value.email, role: "admin" },
        });
        if (checkAdmin) {
          logger.warn(`Admin already exists with email: ${value.email}`);
          throw new ClientError("Admin already exists", 409);
        }
        value.password = await hashService.hashingPassword(value.password);
        const insertAdmin = await UserModel.create({
          ...value,
          is_verified: true,
          role: "admin",
        });
        const { password, otp, otp_time, avatar, photo_id, ...safeAdmin } =
          insertAdmin.toJSON();
        await AdminModel.create({ user_id: insertAdmin.id });
        logger.info(`Admin successfully created | admin_id=${insertAdmin.id}`);
        return res.status(201).json({
          success: true,
          message: "Admin successfully created !",
          status: 201,
          data: safeAdmin,
        });
      } catch (err) {
        logger.error(`Create admin error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.get_admin = async (req, res) => {
      try {
        logger.info(`Get admin request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findAdmin = await AdminModel.findOne({
            where: { id },
            include: {
              model: UserModel,
              attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "role",
                "createdAt",
                "updatedAt",
              ],
            },
          });
          if (!findAdmin) {
            logger.warn(`Admin not found | id=${id}`);
            throw new ClientError("Admin not found", 404);
          }
          logger.info(`Admin fetched successfully | id=${id}`);
          return res.json(findAdmin);
        }
        const admins = await AdminModel.findAll({
          include: {
            model: UserModel,
            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "phone_number",
              "role",
              "createdAt",
              "updatedAt",
            ],
          },
        });
        logger.info(`Admins list fetched | count=${admins.length}`);
        if (!admins.length) {
          logger.warn("No admins found");
          throw new ClientError("No admin have been created yet", 404);
        }
        return res.json(admins);
      } catch (err) {
        logger.error(`Get admin error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_admin = async (req, res) => {
      try {
        logger.info(`Update admin request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update admin failed: Params Id is required");
          throw new ClientError("Params Id is required", 400);
        }
        const findAdmin = await AdminModel.findOne({ where: { id } });
        if (!findAdmin) {
          logger.warn(`Update admin failed: Admin not found | id=${id}`);
          throw new ClientError("Admin not found", 404);
        }
        const updateData = req.body;
        const { error, value } = updateUserSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(
            `Update admin validation error | id=${id} | ${error.message}`
          );
          throw new ClientError(error.message, 400);
        }
        if (value.password) {
          value.password = await hashService.hashingPassword(value.password);
        }
        let avatarData = {};
        if (req.file) {
          logger.info(`Admin avatar update started | id=${id}`);
          const existingUser = await UserModel.findOne({
            where: { id: findAdmin.user_id },
          });
          if (existingUser.avatar_id) {
            await deleteFromCloudinarySchema(existingUser.avatar_id, "image");
          }
          const result = await uploadAvatarFromBuffer(
            req.file.path || req.file.buffer
          );
          logger.info(`Admin avatar updated | id=${id}`);
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
            where: { id: findAdmin.user_id, role: "admin" },
          }
        );
        logger.info(`Admin successfully updated | id=${id}`);
        return res.json({
          message: "Admin successfully updated!",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update admin error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_admin = async (req, res) => {
      try {
        logger.info(`Delete admin request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete admin failed: Params Id is required");
          throw new ClientError("Params Id is required", 400);
        }
        const findAdmin = await AdminModel.findOne({ where: { id } });
        if (!findAdmin) {
          logger.warn(`Delete admin failed: Admin not found | id=${id}`);
          throw new ClientError("Admin not found !", 404);
        }
        if (findAdmin.photo_id) {
          logger.info(`Deleting admin photo from Cloudinary | id=${id}`);
          await deleteFromCloudinarySchema(findAdmin.photo_id);
          logger.info(`Admin photo deleted from Cloudinary | id=${id}`);
        }
        await AdminModel.destroy({ where: { id } });
        logger.info(`Admin successfully deleted | id=${id}`);
        return res.json({
          message: "Admin successfully deleted !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete admin error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new AdminController();
