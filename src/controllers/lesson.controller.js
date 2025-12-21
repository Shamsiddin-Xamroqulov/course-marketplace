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

class LessonController {
  constructor() {
    this.create_lesson = async (req, res) => {
      try {
        const newLesson = req.body;
        const file = req.file;
        if (!file) throw new ClientError("Video file reqiured", 400);
        const { error, value } = createLessonSchema.validate(newLesson, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const uploadResult = await uploadVideoFromBuffer(file.buffer);
        const insertLesson = await LessonModel.create({
          ...value,
          video_url: uploadResult.secure_url,
          video_id: uploadResult.public_id,
        });
        return res.status(201).json({
          success: true,
          message: "Lesson successfully created !",
          status: 201,
          data: insertLesson,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.get_lesson = async (req, res) => {
      try {
        const { id } = req.params;
        if (id) {
          const findLesson = await LessonModel.findOne({
            where: { id },
            include: {
              model: CourseModel,
            },
          });
          if (!findLesson) throw new ClientError("Lesson not found", 404);
          return res.json(findLesson);
        }
        const lessons = await LessonModel.findAll({
          include: {
            model: CourseModel,
          },
        });
        if (!lessons.length)
          throw new ClientError("No Lesson have been created yet", 404);
        return res.json(lessons);
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.update_lesson = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params id required", 400);
        const findLesson = await LessonModel.findOne({ where: { id } });
        if (!findLesson) throw new ClientError("Lesson not found", 404);
        const updateData = req.body;
        const { error, value } = updateLessonSchema.validate(updateData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        let videoData = {};
        if (req.file) {
          if (findLesson.video_id) {
            await deleteFromCloudinarySchema(findLesson.video_id, "video");
          }
          const result = await uploadVideoFromBuffer(req.file.buffer);
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
        return res.json({
          message: "Lesson successfully updated!",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.delete_lesson = async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) throw new ClientError("Params Id required", 400);
        const findLesson = await LessonModel.findOne({ where: { id } });
        if (!findLesson) throw new ClientError("Lesson not found", 404);
        if (findLesson.video_id) {
          await deleteFromCloudinarySchema(findLesson.video_id, "video");
        }
        await LessonModel.destroy({ where: { id } });
        return res.json({
          message: "Lesson successfully deleted",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
  }
}

export default new LessonController();
