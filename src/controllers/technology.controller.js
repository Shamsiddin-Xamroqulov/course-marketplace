import { TechnologyModel } from "../models/index.js";
import { technologySchema } from "../utils/validators/technology.validation.js";

import { globalError, ClientError } from "shokhijakhon-error-handler";

class TechnologyController {
  constructor() {
    this.create_technology = async (req, res) => {
      try {
        const newTechnology = req.body;
        const { error, value } = technologySchema.validate(newTechnology, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const checkTechnology = await TechnologyModel.findOne({
          where: { name: value.name },
        });
        if (checkTechnology)
          throw new ClientError("Technology alredy exists", 409);
        const insertTechnology = await TechnologyModel.create(value);
        return res.status(201).json({
          success: true,
          message: "Technology successfully created !",
          status: 201,
          data: insertTechnology,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_technology = async (req, res) => {
      try {
        const { id } = req.params;
        if (id) {
          const findTechnology = await TechnologyModel.findOne({
            where: { id },
          });
          if (!findTechnology)
            throw new ClientError("Technology not found", 404);
          return res.json(findTechnology);
        }
        const technologies = await TechnologyModel.findAll();
        if (!technologies.length)
          throw new ClientError("No Technologies have been created yet", 404);
        return res.json(technologies);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_technology = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params id required", 400);
        const findTechnology = await TechnologyModel.findOne({ where: { id } });
        if (!findTechnology) throw new ClientError("Technology not found", 404);
        const updateData = req.body;
        const { error, value } = technologySchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        await TechnologyModel.update(value, { where: { id } });
        return res.json({
          message: "Technology successfully updated",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_technology = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params id required", 400);
        const findTechnology = await TechnologyModel.findOne({ where: { id } });
        if (!findTechnology)
          throw new ClientError("Technology not found !", 404);
        await TechnologyModel.destroy({ where: { id } });
        return res.json({
          message: "Technology successfully deleted !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new TechnologyController();
