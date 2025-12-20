import { createVideoSchema } from "../lib/services/cloud.service.js";
import { CourseModel, LessonModel } from "../models/index.js";
import { createLessonSchema } from "../utils/validators/lesson.validation.js";

class lessonController {
  constructor() {
    this.create_lesson = async (req, res) => {
      try {
        const newLesson = req.body;
        const file = req.file;
        const { error, value } = createLessonSchema.validate(newLesson, {
          abortEarly: false,
        });
        if (error) throw new ClienError(error.message, 400);
        if (!file) throw new ClienError("Video file reqiured", 400);
        const result = await createVideoSchema(file);
        const insertLesson = await LessonModel.create({
          ...value,
          video_url: result.secure_url,
          video_id: result.public_id,
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
  }
}
