import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createUserSchema,
  updateUserSchema,
} from "../utils/validators/user.validator.js";
import { UserModel } from "../models/index.js";
import hashService from "../lib/services/hashing.service.js";

class StudentController {
  constructor() {
    this.create_student = async (req, res) => {
      try {
        const newStudent = req.body;
        const { error, value } = createUserSchema.validate(newStudent, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const checkUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (checkUser) throw new ClientError("Student already exists", 409);
        value.password = await hashService.hashingPassword(value.password);
        const insertStudent = await UserModel.create({
          ...value,
          is_verified: true,
        });
        const { avatar, otp, otp_time, password, photo_id, ...safeUser } =
          insertStudent.toJSON();
        return res.status(201).json({
          success: true,
          message: "Student successfully create !",
          status: 201,
          data: safeUser,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_student = async (req, res) => {
      try {
        const { id } = req.params;
        if (id) {
          const findStudent = await UserModel.findOne({
            where: { id, role: "student" },
            attributes: { exclude: ["password"] },
          });
          if (!findStudent) throw new ClientError("Student not found", 404);
          return res.json(findStudent);
        }
        const students = await UserModel.findAll({
          where: { role: "student" },
          attributes: { exclude: ["password"] },
        });
        if (!students.length)
          throw new ClientError("No students have been created", 404);
        return res.json(students);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_student = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id is required", 400);
        const findStudent = await UserModel.findOne({
          where: { id, role: "student" },
        });
        if (!findStudent) throw new ClientError("Student not found", 404);
        const updateData = req.body;
        const { error, value } = updateUserSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        if (value.password) {
          value.password = await hashService.hashingPassword(value.password);
        }
        await UserModel.update(value, { where: { id, role: "student" } });
        return res.json({
          message: "Student successfully updated !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_student = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id is required", 400);
        const findUser = await UserModel.findOne({
          where: { id, role: "student" },
        });
        if (!findUser) throw new ClientError("Student not found", 404);
        await UserModel.destroy({ where: { id, role: "student" } });
        return res.json({
          message: "Student successfully deleted !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new StudentController();
