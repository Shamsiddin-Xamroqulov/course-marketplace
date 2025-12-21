import cloudinary from "../../config/cloud.config.js";

export const uploadAvatarFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "course_marketplace/avatars",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

export const uploadVideoFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "course_marketplace/videos",
        resource_type: "video",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

export const deleteFromCloudinarySchema = async (public_id, resource_type) => {
  return await cloudinary.uploader.destroy(public_id, { resource_type });
};