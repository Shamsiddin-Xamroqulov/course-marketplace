import { ClientError, globalError } from "shokhijakhon-error-handler";
import { CourseModel, LessonModel } from "../models/index.js";
import {
  deleteFromCloudinarySchema,
  uploadVideoFromBuffer,
} from "../lib/services/cloud.service.js";
import {
  createLessonSchema,
  updateLessonSchema,
} from "../utils/validators/lesson.validation.js";
import logger from "../lib/services/logger.service.js";

class LessonController {
  constructor() {
    this.create_lesson = async (req, res) => {
      try {
        logger.info("Create lesson request received");
        const newLesson = req.body;
        const file = req.file;
        if (!file) {
          logger.warn("Create lesson failed: Video file required");
          throw new ClientError("Video file reqiured", 400);
        } 
        const { error, value } = createLessonSchema.validate(newLesson, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Create lesson validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const uploadResult = await uploadVideoFromBuffer(file.buffer);
        logger.info("Lesson video uploaded successfully");
        const insertLesson = await LessonModel.create({
          ...value,
          video_url: uploadResult.secure_url,
          video_id: uploadResult.public_id,
        });
        logger.info(`Lesson successfully created | id=${insertLesson.id}`);
        return res.status(201).json({
          success: true,
          message: "Lesson successfully created !",
          status: 201,
          data: insertLesson,
        });
      } catch (err) {
        logger.error(`Create lesson error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.get_lesson = async (req, res) => {
      try {
        logger.info(`Get lesson request | id=${id ?? "ALL"}`);
        const { id } = req.params;
        if (id) {
          const findLesson = await LessonModel.findOne({
            where: { id },
            include: {
              model: CourseModel,
            },
          });
          if (!findLesson) {
            logger.warn(`Lesson not found | id=${id}`);
            throw new ClientError("Lesson not found", 404);
          } 
          logger.info(`Lesson fetched successfully | id=${id}`);
          return res.json(findLesson);
        }
        const lessons = await LessonModel.findAll({
          include: {
            model: CourseModel,
          },
        });
        if (!lessons.length) {
          logger.warn("No lessons found");
          throw new ClientError("No Lesson have been created yet", 404);
        }
        logger.info(`Lessons list fetched | count=${lessons.length}`);
        return res.json(lessons);
      } catch (err) {
        logger.error(`Get lesson error | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.update_lesson = async (req, res) => {
      try {
        logger.info(`Update lesson request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Update lesson failed: Params id required");
          throw new ClientError("Params id required", 400);
        }
        const findLesson = await LessonModel.findOne({ where: { id } });
        if (!findLesson) {
          logger.warn(`Update lesson failed: Lesson not found | id=${id}`);
          throw new ClientError("Lesson not found", 404);
        }
        const updateData = req.body;
        const { error, value } = updateLessonSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Update lesson validation failed | id=${id} | ${error.message}`);  
          throw new ClientError(error.message, 400);
        }
        let videoData = {};
        if (req.file) {
          if (findLesson.video_id) {
            logger.info(`Old lesson video deleted | id=${id}`);
            await deleteFromCloudinarySchema(findLesson.video_id, "video");
          }
          const result = await uploadVideoFromBuffer(req.file.buffer);
          logger.info(`Lesson video updated | id=${id}`);
          videoData = {
            video_url: result.secure_url,
            video_id: result.public_id,
          };
        }
        await LessonModel.update(
          {
            ...value,
            ...videoData,
          },
          { where: { id } }
        );
        logger.info(`Lesson successfully updated | id=${id}`);
        return res.json({
          message: "Lesson successfully updated!",
          status: 200,
        });
      } catch (err) {
        logger.error(`Update lesson error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.delete_lesson = async (req, res) => {
      try {
        logger.info(`Delete lesson request | id=${id}`);
        const { id } = req.params;
        if (!id) {
          logger.warn("Delete lesson failed: Params Id required");
          throw new ClientError("Params Id required", 400);
        } 
        const findLesson = await LessonModel.findOne({ where: { id } });
        if (!findLesson) {
          logger.warn(`Delete lesson failed: Lesson not found | id=${id}`);
          throw new ClientError("Lesson not found", 404);
        }
        if (findLesson.video_id) {
          await deleteFromCloudinarySchema(findLesson.video_id, "video");
          logger.info(`Lesson video deleted from Cloudinary | id=${id}`);
        }
        await LessonModel.destroy({ where: { id } });
        logger.info(`Lesson successfully deleted | id=${id}`);
        return res.json({
          message: "Lesson successfully deleted",
          status: 200,
        });
      } catch (err) {
        logger.error(`Delete lesson error | id=${id} | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new LessonController();
