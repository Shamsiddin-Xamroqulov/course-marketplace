import { ClientError, globalError } from "shokhijakhon-error-handler";
import { CategoryModel } from "../models/index.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../utils/validators/category.validator.js";
import logger from "../lib/services/logger.service.js";

class CategoryController {
  constructor() {
    this.create_category = async (req, res) => {
      try {
        logger.info("Create category request received");
        const newCategory = req.body;
        const { error, value } = createCategorySchema.validate(newCategory, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create category validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const checkCategory = await CategoryModel.findOne({
          where: { name: value.name },
        });
        if (checkCategory) {
          logger.warn(`Category already exists | name=${value.name}`);
          throw new ClientError("Category already exists", 409);
        }
        const insertCategory = await CategoryModel.create({ ...value });
        logger.info(
          `Category successfully created | id=${insertCategory.id} | name=${insertCategory.name}`
        );
        return res.status(201).json({
          success: true,
          message: "Category successfully created !",
          status: 201,
          data: insertCategory,
        });
      } catch (err) {
        logger.error(`Create category error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.get_category = async (req, res) => {
      try {
        logger.info(`Get category request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findCategory = await CategoryModel.findOne({ where: { id } });
          if (!findCategory) {
            logger.warn(`Category not found | id=${id}`);
            throw new ClientError("Category not found", 404);
          }
          logger.info(`Category fetched successfully | id=${id}`);
          return res.json(findCategory);
        }
        const categories = await CategoryModel.findAll();
        if (!categories.length) {
          logger.warn("No categories found");
          throw new ClientError("No categories have been created", 404);
        }
        logger.info(`Categories list fetched | count=${categories.length}`);
        return res.json(categories);
      } catch (err) {
        logger.error(`Get category error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_category = async (req, res) => {
      try {
        logger.info(`Update category request received | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update category failed: Params Id is required");
          throw new ClientError("Params Id is required", 400);
        }
        const findCategory = await CategoryModel.findOne({ where: { id } });
        if (!findCategory) {
          logger.warn(`Update category failed: Category not found | id=${id}`);
          throw new ClientError("Category not found", 404);
        }
        const updateData = req.body;
        const { error, value } = updateCategorySchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(
            `Update category validation failed | id=${id} | ${error.message}`
          );
          throw new ClientError(error.message, 400);
        }
        await CategoryModel.update(value, { where: { id } });
        logger.info(`Category successfully updated | id=${id}`);
        return res.json({
          message: "Category successfully updated !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update category error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_category = async (req, res) => {
      try {
        logger.info(`Delete category request received | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete category failed: Params id required");
          throw new ClientError("Params id required", 400);
        }
        const findCategory = await CategoryModel.findOne({ where: { id } });
        if (!findCategory) {
          logger.warn(`Delete category failed: Category not found | id=${id}`);
          throw new ClientError("Category not found", 404);
        }
        await CategoryModel.destroy({ where: { id } });
        logger.info(`Category successfully deleted | id=${id}`);
        return res.json({
          message: "Category successfully deleted !",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete category error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new CategoryController();
