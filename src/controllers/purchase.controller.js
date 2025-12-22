import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from "../utils/validators/purchase.validator.js";
import { CourseModel, PurchaseModel, UserModel } from "../models/index.js";
import logger from "../lib/services/logger.service.js";

class PurchaseController {
  constructor() {
    this.create_purchase = async (req, res) => {
      try {
        logger.info("Create purchase request received");
        const newPurchase = req.body;
        const { error, value } = createPurchaseSchema.validate(newPurchase, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create purchase validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const course = await CourseModel.findOne({
          where: { id: value.course_id },
        });
        if (!course) {
          logger.warn(`Course not found | course_id=${value.course_id}`);
          throw new ClientError("Course not found", 404);
        }
        const existingPurchase = await PurchaseModel.findOne({
          where: { user_id: value.user_id, course_id: value.course_id },
        });
        if (existingPurchase) {
          logger.warn(
            `Course already purchased | user_id=${value.user_id} | course_id=${value.course_id}`
          );
          throw new ClientError("Course already purchased", 400);
        }
        if (course.price != value.total_price) {
          logger.warn(
            `Total price mismatch | expected=${course.price} | received=${value.total_price}`
          );
          throw new ClientError("The amount of total price is low", 400);
        }
        const purchase = await PurchaseModel.create({
          ...value,
        });
        logger.info(`Purchase successfully created | id=${purchase.id}`);
        return res.status(201).json({
          message: "Purchase successfully created",
          status: 201,
          data: purchase,
        });
      } catch (err) {
        logger.error(`Create purchase error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.get_purchase = async (req, res) => {
      try {
        logger.info(`Get purchase request | id=${id ?? "ALL"}`);
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
          if (!findPurchase) {
            logger.warn(`Purchase not found | id=${id}`);
            throw new ClientError("Purchase not found", 404);
          }
          logger.info(`Purchase fetched successfully | id=${id}`);
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
        if (!purchases.length) {
          logger.warn("No purchases found");
          throw new ClientError("No Purchases have been created yet", 404);
        }
        logger.info(`Purchases list fetched | count=${purchases.length}`);
        return res.json(purchases);
      } catch (err) {
        logger.error(`Get purchase error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_purchases = async (req, res) => {
      try {
        logger.info(`Update purchase request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update purchase failed: Purchase ID is required");
          throw new ClientError("Purchase ID is required", 400);
        }
        const findPurchase = await PurchaseModel.findOne({ where: { id } });
        if (!findPurchase) {
          logger.warn(`Purchase not found | id=${id}`);
          throw new ClientError("Purchase not found", 404);
        }
        const updateData = req.body;
        const { error, value } = updatePurchaseSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(
            `Update purchase validation failed | id=${id} | ${error.message}`
          );
          throw new ClientError(error.message, 400);
        }
        await PurchaseModel.update(value, { where: { id } });
        logger.info(`Purchase successfully updated | id=${id}`);
        return res.status(200).json({
          message: "Purchase successfully updated",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update purchase error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_purchase = async (req, res) => {
      try {
        logger.info(`Delete purchase request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete purchase failed: Purchase ID is required");
          throw new ClientError("Purchase ID is required", 400);
        }
        const findPurchase = await PurchaseModel.findOne({ where: { id } });
        if (!findPurchase) {
          logger.warn(`Purchase not found | id=${id}`);
          throw new ClientError("Purchase not found", 404);
        }
        await PurchaseModel.destroy({ where: { id } });
        logger.info(`Purchase successfully deleted | id=${id}`);
        return res.status(200).json({
          message: "Purchase successfully deleted",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete purchase error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new PurchaseController();
