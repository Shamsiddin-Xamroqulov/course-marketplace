import cloudinary from "../../config/cloud.config.js";

export const createAvatarSchema = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "/course_marketplace/avatars",
    resource_type: "image",
  });
};

export const createVideoSchema = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "/course_marketplace/videos",
    resource_type: "video",
  });
};

export const deleteFromCloudinarySchema = async (public_id, resource_type) => {
  return await cloudinary.uploader.destroy(public_id, {
    resource_type,
  });
};