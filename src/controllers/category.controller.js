import { ClientError, globalError } from "shokhijakhon-error-handler";
import { CategoryModel } from "../models/index.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../utils/validators/category.validator.js";

class CategoryController {
  constructor() {
    this.create_category = async (req, res) => {
      try {
        const newCategory = req.body;
        const { error, value } = createCategorySchema.validate(newCategory, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const checkCategory = await CategoryModel.findOne({
          where: { name: value.name },
        });
        if (checkCategory)
          throw new ClientError("Category already exists", 409);
        const insertCategory = await CategoryModel.create({ ...value });
        return res.status(201).json({
          success: true,
          message: "Category successfully created !",
          status: 201,
          data: insertCategory,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_category = async (req, res) => {
      try {
        const { id } = req.params;
        if (id) {
          const findCategory = await CategoryModel.findOne({ where: { id } });
          if (!findCategory) throw new ClientError("Category not found", 404);
          return res.json(findCategory);
        }
        const categories = await CategoryModel.findAll();
        if (!categories.length)
          throw new ClientError("No categories have been created", 404);
        return res.json(categories);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_category = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id is required", 400);
        const findCategory = await CategoryModel.findOne({ where: { id } });
        if (!findCategory) throw new ClientError("Category not found", 404);
        const updateData = req.body;
        const { error, value } = updateCategorySchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        await CategoryModel.update(value, { where: { id } });
        return res.json({
          message: "Category successfully updated !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_category = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params id required", 400);
        const findCategory = await CategoryModel.findOne({ where: { id } });
        if (!findCategory) throw new ClientError("Category not found", 404);
        await CategoryModel.destroy({ where: { id } });
        return res.json({
          message: "Category successfully deleted !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new CategoryController();
