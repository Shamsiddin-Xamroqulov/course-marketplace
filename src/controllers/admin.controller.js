import { ClientError, globalError } from "shokhijakhon-error-handler";
import { AdminModel, UserModel } from "../models/index.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../utils/validators/user.validator.js";
import hashService from "../lib/services/hashing.service.js";

class AdminController {
  constructor() {
    this.create_admin = async (req, res) => {
      try {
        const newAdmin = req.body;
        const { error, value } = createUserSchema.validate(newAdmin, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const checkAdmin = await UserModel.findOne({
          where: { email: value.email },
        });
        if (checkAdmin) throw new ClientError("Admin already exists", 400);
        value.password = await hashService.hashingPassword(value.password);
        const insertAdmin = await UserModel.create({
          ...value,
          is_verified: true,
        });
        await AdminModel.create({ user_id: insertAdmin.id });
        return res
          .status(201)
          .json({ message: "Admin successfully created !", status: 201 });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_admin = async (req, res) => {
      try {
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
          if (!findAdmin) throw new ClientError("Admin not found", 404);
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
        return res.json(admins);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_admin = async (req, res) => {
      try {
        const { id } = req.params;
        const findAdmin = await AdminModel.findOne({ where: { id } });
        if (!findAdmin) throw new ClientError("Admin not found", 404);
        const updateData = req.body;
        const { error, value } = updateUserSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        await UserModel.update({ ...value });
        return res.json({
          message: "Admin successfully updated !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_admin = async (req, res) => {
      try {
        const {id} = req.params;
        const findAdmin = await AdminModel.findOne({where: {id}});
        if(!findAdmin) throw new ClientError("Admin not found !", 404);
        await AdminModel.destroy({where: {id}});
        return res.json({message: "Admin successfully deleted !", status: 200});
      } catch (err) {
        return globalError(err, res);
      }
    };
  };
};

export default new AdminController();
