import { globalError, ClientError } from "shokhijakhon-error-handler";
import {
  createPaymentSchema,
  updatePaymentSchema,
} from "../utils/validators/payment.validator.js";
import { PaymentModel, PurchaseModel } from "../models/index.js";
import { sequelize } from "../lib/connection/db.connection.js";

class PaymentController {
  constructor() {
    this.create_payment = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        logger.info("Create payment request received");
        const { error, value } = createPaymentSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create payment validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const purchase = await PurchaseModel.findOne({
          where: { id: value.purchase_id },
        });
        if (!purchase) {
          logger.warn(`Purchase not found | purchase_id=${value.purchase_id}`);
          throw new ClientError("Purchase not found", 404);
        }
        if (
          purchase.user_id != value.user_id &&
          purchase.total_price != value.amount
        ) {
          logger.warn(
            `Unauthorized payment attempt | user_id=${value.user_id} | amount=${value.amount}`
          );
          throw new ClientError(
            "You are not allowed to complete this purchase or the payment amount is invalid",
            403
          );
        }
        const payment = await PaymentModel.create(value, { transaction: t });
        logger.info(`Payment successfully created | id=${payment.id}`);
        await t.commit();
        return res.status(201).json({
          message: "Payment created successfully",
          status: 201,
          data: payment,
        });
      } catch (err) {
        await t.rollback();
        logger.error(`Create payment error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.get_payment = async (req, res) => {
      try {
        logger.info(`Get payment request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findPayment = await PaymentModel.findByPk(id, {
            include: PurchaseModel,
          });
          if (!findPayment) {
            logger.warn(`Payment not found | id=${id}`);
            throw new ClientError("Payment not found", 404);
          }
          logger.info(`Payment fetched successfully | id=${id}`);
          return res.json(findPayment);
        }
        const payments = await PaymentModel.findAll({
          include: { model: PurchaseModel },
        });
        if (!payments.length) {
          logger.warn("No payments found");
          throw new ClientError("No Payment have been created yet", 404);
        }
        logger.info(`Payments list fetched | count=${payments.length}`);
        return res.json(payments);
      } catch (err) {
        logger.error(`Get payment error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_payment = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        logger.info(`Update payment request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update payment failed: Payment ID is required");
          throw new ClientError("Payment ID is required", 400);
        }
        const payment = await PaymentModel.findOne({ where: { id } });
        if (!payment) {
          logger.warn(`Payment not found | id=${id}`);
          throw new ClientError("Payment not found", 404);
        }
        const { error, value } = updatePaymentSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(
            `Update payment validation failed | id=${id} | ${error.message}`
          );
          throw new ClientError(error.message, 400);
        }
        await PaymentModel.update(value, { where: { id }, transaction: t });
        logger.info(`Payment successfully updated | id=${id}`);
        await t.commit();
        return res.status(200).json({
          message: "Payment updated successfully",
          status: 200,
        });
      } catch (err) {
        await t.rollback();
        logger.error(`Update payment error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_payment = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        logger.info(`Delete payment request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete payment failed: Payment ID is required");
          throw new ClientError("Payment ID is required", 400);
        }
        const payment = await PaymentModel.findOne({ where: { id } });
        if (!payment) {
          logger.warn(`Payment not found | id=${id}`);
          throw new ClientError("Payment not found", 404);
        }
        await PaymentModel.destroy({ where: { id }, transaction: t });
        logger.info(`Payment successfully deleted | id=${id}`);
        await t.commit();
        return res.status(200).json({
          message: "Payment deleted successfully",
          status: 200,
        });
      } catch (err) {
        await t.rollback();
        logger.error(`Delete payment error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new PaymentController();
