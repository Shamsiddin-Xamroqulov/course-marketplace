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
        const { error, value } = createPaymentSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const purchase = await PurchaseModel.findOne({
          where: { id: value.purchase_id },
        });
        if (!purchase) throw new ClientError("Purchase not found", 404);
        const payment = await PaymentModel.create(value, { transaction: t });
        await t.commit();
        return res.status(201).json({
          message: "Payment created successfully",
          status: 201,
          data: payment,
        });
      } catch (err) {
        await t.rollback();
        return globalError(err, res);
      }
    };
    this.get_payment = async (req, res) => {
      try {
        const { id } = req.params;
        if (id) {
          const findPayment = await PaymentModel.findByPk(id, {
            include: PurchaseModel,
          });
          if (!findPayment) throw new ClientError("Payment not found", 404);
          return res.json(findPayment);
        }
        const payments = await PaymentModel.findAll({
          include: { model: PurchaseModel },
        });
        if(!payments.length) throw new ClientError("No Payment have been created yet", 404);
        return res.json(payments);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_payment = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Payment ID is required", 400);
        const payment = await PaymentModel.findOne({ where: { id } });
        if (!payment) throw new ClientError("Payment not found", 404);
        const { error, value } = updatePaymentSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        await PaymentModel.update(value, { where: { id }, transaction: t });
        await t.commit();
        return res.status(200).json({
          message: "Payment updated successfully",
          status: 200,
          data: payment,
        });
      } catch (err) {
        await t.rollback();
        return globalError(err, res);
      }
    };
    this.delete_payment = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Payment ID is required", 400);
        const payment = await PaymentModel.findOne({ where: { id } });
        if (!payment) throw new ClientError("Payment not found", 404);
        await PaymentModel.destroy({ where: { id }, transaction: t });
        await t.commit();
        return res.status(200).json({
          message: "Payment deleted successfully",
          status: 200,
        });
      } catch (err) {
        await t.rollback();
        return globalError(err, res);
      }
    };
  }
}

export default new PaymentController();
