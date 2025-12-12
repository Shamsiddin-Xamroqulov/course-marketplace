import {config} from "dotenv";
config();

const serverConfig = {
    server: {
        PORT: process.env.PORT || 3000
    },
    database: {
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PASSWORD: process.env.DB_PASSWORD
    },
    mail_service: {
        EMAIL: process.env.EMAIL,
        NODE_MAILER_KEY: process.env.NODE_MAILER_KEY,
    },
};

export default serverConfig;