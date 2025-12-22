import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from "../utils/validators/purchase.validator.js";
import { CourseModel, PurchaseModel, UserModel } from "../models/index.js";

class PurchaseController {
  constructor() {
    this.create_purchase = async (req, res) => {
      try {
        const newPurchase = req.body;
        const { error, value } = createPurchaseSchema.validate(newPurchase, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const course = await CourseModel.findOne({
          where: { id: value.course_id },
        });
        if (!course) throw new ClientError("Course not found", 404);
        const existingPurchase = await PurchaseModel.findOne({
          where: { user_id: value.user_id, course_id: value.course_id },
        });
        if (existingPurchase)
          throw new ClientError("Course already purchased", 400);
        const purchase = await PurchaseModel.create({
          ...value,
        });
        return res.status(201).json({
          message: "Purchase successfully created",
          status: 201,
          data: purchase,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_purchase = async (req, res) => {
      const { id } = req.params;
      if (id) {
        const findPurchase = await PurchaseModel.findOne({
          where: { id },
          include: [
            {
              model: UserModel,
              attributes: {
                exclude: ["otp", "otp_time", "password", "photo_id"],
              },
            },
            { model: CourseModel },
          ],
        });
        if (!findPurchase) throw new ClientError("Purchase not found", 404);
        return res.json(findPurchase);
      }
      const purchases = await PurchaseModel.findAll({
        include: [
          {
            model: UserModel,
            attributes: {
              exclude: ["otp", "otp_time", "password", "photo_id"],
            },
          },
          { model: CourseModel },
        ],
      });
      if (!purchases.length)
        throw new ClientError("No Purchases have been created yet", 404);
      return res.json(purchases);
    };
    this.update_purchases = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Purchase ID is required", 400);
        const findPurchase = await PurchaseModel.findOne({ where: { id } });
        if (!findPurchase) throw new ClientError("Purchase not found", 404);
        const updateData = req.body;
        const { error, value } = updatePurchaseSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        await PurchaseModel.update(value, { where: { id } });
        return res.status(200).json({
          message: "Purchase successfully updated",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_purchase = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Purchase ID is required", 400);
        const findPurchase = await PurchaseModel.findOne({ where: { id } });
        if (!findPurchase) throw new ClientError("Purchase not found", 404);
        await PurchaseModel.destroy({ where: { id } });
        return res.status(200).json({
          message: "Purchase successfully deleted",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new PurchaseController();