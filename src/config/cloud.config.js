import {v2 as cloudinary} from "cloudinary";
import serverConfig from "../config.js";

const {cloud_service: {CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY}} = serverConfig;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET_KEY
});

export default cloudinary;